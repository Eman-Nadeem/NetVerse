import Story from '../models/Story.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { uploadStoryMedia, deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private
export const createStory = async (req, res, next) => {
  try {
    const { caption } = req.body;
    let mediaData = req.body.media;

    // If file is uploaded, upload to Cloudinary
    if (req.file) {
      try {
        const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
        const result = await uploadStoryMedia(req.file.buffer, fileType);
        mediaData = {
          type: fileType,
          url: result.url,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
        };
      } catch (error) {
        console.error('Error uploading story media:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload story media',
        });
      }
    }

    if (!mediaData) {
      return res.status(400).json({
        success: false,
        message: 'Story media is required',
      });
    }

    // Create story
    const story = await Story.create({
      author: req.user._id,
      media: mediaData,
      caption: caption || '',
    });

    // Populate author
    await story.populate('author', '_id name username avatar');

    // Add story to user's stories
    const user = await User.findById(req.user._id);
    user.stories.push(story._id);
    await user.save();

    // Notify followers (optional - you may want to batch this)
    // For now, we'll just notify a few to avoid spam
    const followersToNotify = user.followers.slice(0, 50);
    for (const followerId of followersToNotify) {
      try {
        const notification = await Notification.create({
          recipient: followerId,
          sender: req.user._id,
          type: 'story',
          story: story._id,
          link: `/stories/${req.user._id}`,
        });

        // Populate for real-time emission
        await notification.populate('sender', '_id name username avatar');

        // Emit real-time notification with complete data
        global.io?.to(followerId.toString()).emit('newNotification', notification);
      } catch (notifError) {
        console.error('Failed to create story notification:', notifError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stories from following users
// @route   GET /api/stories
// @access  Private
export const getStories = async (req, res, next) => {
  try {
    // Get current user with following
    const currentUser = await User.findById(req.user._id)
      .populate({
        path: 'following',
        select: '_id name username avatar',
      });

    // Get stories from following users and self
    const usersWithStories = await User.find({
      _id: { $in: [...currentUser.following.map((u) => u._id), req.user._id] },
    })
      .populate({
        path: 'stories',
        match: { isExpired: false },
        populate: {
          path: 'author',
          select: '_id name username avatar',
        },
        options: { sort: { createdAt: -1 } },
      })
      .select('_id name username avatar stories');

    // Filter users with non-expired stories
    const activeStories = usersWithStories.filter(
      (user) => user.stories.length > 0
    );

    res.status(200).json({
      success: true,
      data: activeStories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Private
export const getStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', '_id name username avatar')
      .populate('viewers', '_id name username avatar');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check if story is expired
    if (story.isExpired || story.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Story has expired',
      });
    }

    // Add current user to viewers if not already viewed
    if (!story.viewers.some((v) => v._id.toString() === req.user._id.toString())) {
      story.viewers.push(req.user._id);
      await story.save();
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private
export const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    // Check if user owns the story
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this story',
      });
    }

    // Remove story from user's stories
    const user = await User.findById(req.user._id);
    user.stories.pull(story._id);
    await user.save();

    // Delete media from Cloudinary
    if (story.media && story.media.publicId) {
      try {
        await deleteFromCloudinary(
          story.media.publicId,
          story.media.type === 'video' ? 'video' : 'image'
        );
      } catch (error) {
        console.error('Error deleting story media from Cloudinary:', error);
        // Continue with deletion even if Cloudinary fails
      }
    }

    // Delete notifications related to this story
    await Notification.deleteMany({ story: story._id });

    // Delete the story
    await story.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's stories
// @route   GET /api/stories/user/:userId
// @access  Private
export const getUserStories = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const stories = await Story.find({
      author: userId,
      isExpired: false,
    })
      .populate('author', '_id name username avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};
