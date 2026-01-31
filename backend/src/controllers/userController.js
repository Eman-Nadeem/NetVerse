import User from '../models/User.js';
import Post from '../models/Post.js';
import Story from '../models/Story.js';
import Notification from '../models/Notification.js';
import { uploadAvatar, uploadImage, deleteFromCloudinary } from '../utils/cloudinary.js';

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', '_id name username avatar')
      .populate('following', '_id name username avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if current user is following this user
    let isFollowing = false;
    if (req.user) {
      isFollowing = user.followers.some(
        (follower) => follower._id.toString() === req.user._id.toString()
      );
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        isFollowing,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, username, bio, website, location, coverPhoto } = req.body;
    let avatarUrl = req.body.avatar;

    // Get current user
    const currentUser = await User.findById(req.user._id);

    // If avatar file is uploaded, upload to Cloudinary
    if (req.file) {
      try {
        const result = await uploadAvatar(req.file.buffer);
        avatarUrl = result.url;

        // Delete old avatar from Cloudinary
        if (currentUser.avatar && !currentUser.avatar.includes('placeholder')) {
          try {
            const oldPublicId = currentUser.avatar.split('/').pop().split('.')[0];
            if (oldPublicId) {
              await deleteFromCloudinary(`netverse/avatars/${oldPublicId}`, 'image');
            }
          } catch (error) {
            console.error('Error deleting old avatar from Cloudinary:', error);
          }
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload avatar',
        });
      }
    }

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (username) updateFields.username = username;
    if (bio !== undefined) updateFields.bio = bio;
    if (website !== undefined) updateFields.website = website;
    if (location !== undefined) updateFields.location = location;
    if (avatarUrl) updateFields.avatar = avatarUrl;
    if (coverPhoto !== undefined) updateFields.coverPhoto = coverPhoto;

    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken',
        });
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow/Unfollow user
// @route   POST /api/users/follow/:id
// @access  Private
export const toggleFollow = async (req, res, next) => {
  try {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user._id;

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Cannot follow yourself
    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    // Check if already following
    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);

      await Promise.all([currentUser.save(), targetUser.save()]);

      // Delete follow notification if exists
      await Notification.deleteMany({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow',
      });

      res.status(200).json({
        success: true,
        message: 'Unfollowed successfully',
        data: {
          isFollowing: false,
        },
      });
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await Promise.all([currentUser.save(), targetUser.save()]);

      // Create follow notification
      await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow',
        link: `/profile/${currentUserId}`,
      });

      // Emit real-time notification
      global.io.to(targetUserId.toString()).emit('newNotification', {
        type: 'follow',
        sender: {
          _id: currentUserId,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Followed successfully',
        data: {
          isFollowing: true,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
export const searchUsers = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const searchRegex = new RegExp(q, 'i');

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { username: searchRegex },
        { bio: searchRegex },
      ],
    })
      .select('_id name username avatar bio followersCount followingCount isOnline')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ followersCount: -1 });

    const total = await User.countDocuments({
      $or: [
        { name: searchRegex },
        { username: searchRegex },
        { bio: searchRegex },
      ],
    });

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Public
export const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'followers',
      select: '_id name username avatar bio isOnline',
      options: {
        limit: 20,
        skip: (parseInt(req.query.page || 1) - 1) * 20,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.followers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Public
export const getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'following',
      select: '_id name username avatar bio isOnline',
      options: {
        limit: 20,
        skip: (parseInt(req.query.page || 1) - 1) * 20,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.following,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's posts
// @route   GET /api/users/:id/posts
// @access  Public
export const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const posts = await Post.find({ author: req.params.id })
      .populate('author', '_id name username avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments({ author: req.params.id });

    res.status(200).json({
      success: true,
      data: posts,
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

// @desc    Save/Unsave post
// @route   POST /api/users/saved-posts/:postId
// @access  Private
export const toggleSavePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const user = await User.findById(req.user._id);

    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      user.savedPosts.pull(postId);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Post removed from saved',
        data: { isSaved: false },
      });
    } else {
      user.savedPosts.push(postId);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Post saved successfully',
        data: { isSaved: true },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved posts
// @route   GET /api/users/saved-posts
// @access  Private
export const getSavedPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: {
        path: 'author',
        select: '_id name username avatar',
      },
      options: {
        limit,
        skip: (page - 1) * limit,
      },
    });

    const total = user.savedPosts.length;

    res.status(200).json({
      success: true,
      data: user.savedPosts,
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
