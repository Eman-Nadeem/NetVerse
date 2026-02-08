import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Create or get existing chat
// @route   POST /api/chats
// @access  Private
export const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Cannot chat with yourself
    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create chat with yourself',
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId], $size: 2 },
      isGroup: false,
    }).populate('participants', '_id name username avatar isOnline');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [req.user._id, userId],
        isGroup: false,
      });

      await chat.populate('participants', '_id name username avatar isOnline');
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user's chats
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate('participants', '_id name username avatar isOnline')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat by ID
// @route   GET /api/chats/:id
// @access  Private
export const getChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', '_id name username avatar isOnline')
      .populate('lastMessage');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is a participant
    if (!chat.participants.some((p) => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat',
      });
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/chats/:id/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { content, media, messageType, replyTo } = req.body;

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is a participant
    if (!chat.participants.includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this chat',
      });
    }

    // Create message
    const message = await Message.create({
      chat: chat._id,
      sender: req.user._id,
      content,
      media,
      messageType: messageType || 'text',
      replyTo,
    });

    await message.populate('sender', '_id name username avatar');

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.updatedAt = new Date();
    await chat.save();

    // Update unread count and send notifications for other participants
    for (const participantId of chat.participants) {
      if (participantId.toString() !== req.user._id.toString()) {
        const currentCount = chat.unreadCount.get(participantId.toString()) || 0;
        chat.unreadCount.set(participantId.toString(), currentCount + 1);

        // Create notification
        const notification = await Notification.create({
          recipient: participantId,
          sender: req.user._id,
          type: 'message',
          chat: chat._id,
          content: content.substring(0, 100),
          link: `/chats/${chat._id}`,
        });

        // Populate sender for real-time notification
        await notification.populate('sender', '_id name username avatar');
        
        // Emit real-time notification and message
        const targetRoom = participantId.toString();
        
        global.io.to(targetRoom).emit('newNotification', notification);
        global.io.to(targetRoom).emit('newMessage', {
          chatId: chat._id.toString(),
          message,
        });
      }
    }
    await chat.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a chat
// @route   GET /api/chats/:id/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is a participant
    if (!chat.participants.includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access messages in this chat',
      });
    }

    const messages = await Message.find({
      chat: req.params.id,
      isDeleted: false,
    })
      .populate('sender', '_id name username avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      {
        chat: req.params.id,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      {
        isRead: true,
        $addToSet: { readBy: req.user._id },
      }
    );

    // Reset unread count
    chat.unreadCount.set(req.user._id.toString(), 0);
    await chat.save();

    const total = await Message.countDocuments({
      chat: req.params.id,
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      data: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/chats/:chatId/messages/:messageId
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message',
      });
    }

    // Soft delete
    message.isDeleted = true;
    await message.save();

    // Emit real-time event
    const chat = await Chat.findById(req.params.chatId);
    chat.participants.forEach((participantId) => {
      global.io.to(participantId.toString()).emit('messageDeleted', {
        chatId: chat._id,
        messageId: message._id,
      });
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark chat as read
// @route   PUT /api/chats/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is a participant
    if (!chat.participants.includes(req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat',
      });
    }

    // Mark all messages as read
    await Message.updateMany(
      {
        chat: req.params.id,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      {
        isRead: true,
        $addToSet: { readBy: req.user._id },
      }
    );

    // Reset unread count
    chat.unreadCount.set(req.user._id.toString(), 0);
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat marked as read',
    });
  } catch (error) {
    next(error);
  }
};