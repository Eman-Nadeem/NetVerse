import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    media: {
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      publicId: String, // For Cloudinary management
      thumbnail: String, // For videos
    },
    caption: {
      type: String,
      maxlength: [500, 'Caption cannot be more than 500 characters'],
      trim: true,
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      default: function () {
        // Stories expire after 24 hours
        return new Date(Date.now() + 24 * 60 * 60 * 1000);
      },
    },
    isExpired: {
      type: Boolean,
      default: false,
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

// Check if story is expired before saving
storySchema.pre('save', async function () {
  if (this.expiresAt < new Date()) {
    this.isExpired = true;
  }
});

// Virtual for viewers count
storySchema.virtual('viewersCount').get(function () {
  return this.viewers.length;
});

// Ensure virtuals are included in JSON
storySchema.set('toJSON', { virtuals: true });
storySchema.set('toObject', { virtuals: true });

// Index for querying active stories
storySchema.index({ author: 1, expiresAt: -1 });
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired stories

const Story = mongoose.model('Story', storySchema);

export default Story;
