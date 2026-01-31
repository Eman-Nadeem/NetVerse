import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    media: {
      type: {
        type: String,
        enum: ['image', 'video', 'audio', 'file'],
      },
      url: String,
      publicId: String,
      fileName: String,
      fileSize: Number,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying messages
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;