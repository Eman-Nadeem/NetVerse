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
    let isRequested = false;
    if (req.user) {
      isFollowing = user.followers.some(
        (follower) => follower._id.toString() === req.user._id.toString()
      );
      isRequested = user.followRequests?.some(
        (requesterId) => requesterId.toString() === req.user._id.toString()
      );
    }

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        isFollowing,
        isRequested,
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
    const { name, username, bio, website, location, coverPhoto, accountType } = req.body;
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
    if (accountType && ['public', 'private'].includes(accountType)) updateFields.accountType = accountType;

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
    const hasRequested = targetUser.followRequests?.includes(currentUserId);

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
          isRequested: false,
        },
      });
    } else if (hasRequested) {
      // Cancel follow request
      targetUser.followRequests.pull(currentUserId);
      await targetUser.save();

      // Delete follow request notification
      await Notification.deleteMany({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'followRequest',
      });

      res.status(200).json({
        success: true,
        message: 'Follow request cancelled',
        data: {
          isFollowing: false,
          isRequested: false,
        },
      });
    } else if (targetUser.accountType === 'private') {
      // Send follow request for private accounts
      targetUser.followRequests.push(currentUserId);
      await targetUser.save();

      // Create follow request notification
      try {
        const notification = await Notification.create({
          recipient: targetUserId,
          sender: currentUserId,
          type: 'followRequest',
          link: `/profile/${currentUserId}`,
        });

        await notification.populate('sender', '_id name username avatar');
        const targetRoom = targetUserId.toString();
        global.io?.to(targetRoom).emit('newNotification', notification);
      } catch (notifError) {
        console.error('Failed to create follow request notification:', notifError);
      }

      res.status(200).json({
        success: true,
        message: 'Follow request sent',
        data: {
          isFollowing: false,
          isRequested: true,
        },
      });
    } else {
      // Follow public account directly
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await Promise.all([currentUser.save(), targetUser.save()]);

      // Create follow notification
      try {
        const notification = await Notification.create({
          recipient: targetUserId,
          sender: currentUserId,
          type: 'follow',
          link: `/profile/${currentUserId}`,
        });

        // Populate sender for real-time emission
        await notification.populate('sender', '_id name username avatar');

        // Emit real-time notification with complete data
        const targetRoom = targetUserId.toString();
        console.log('📢 Emitting follow notification to room:', targetRoom);
        global.io?.to(targetRoom).emit('newNotification', notification);
      } catch (notifError) {
        console.error('Failed to create follow notification:', notifError);
      }

      res.status(200).json({
        success: true,
        message: 'Followed successfully',
        data: {
          isFollowing: true,
          isRequested: false,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Accept follow request
// @route   POST /api/users/:id/accept
// @access  Private
export const acceptFollowRequest = async (req, res, next) => {
  try {
    const { id: requesterId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!requester) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if request exists
    if (!currentUser.followRequests?.includes(requesterId)) {
      return res.status(400).json({
        success: false,
        message: 'No follow request from this user',
      });
    }

    // Remove from follow requests
    currentUser.followRequests.pull(requesterId);
    // Add to followers
    currentUser.followers.push(requesterId);
    // Add to requester's following
    requester.following.push(currentUserId);

    await Promise.all([currentUser.save(), requester.save()]);

    // Delete the follow request notification
    await Notification.deleteMany({
      recipient: currentUserId,
      sender: requesterId,
      type: 'followRequest',
    });

    // Create a new "follow" notification for the requester (they are now following)
    try {
      const notification = await Notification.create({
        recipient: currentUserId,
        sender: requesterId,
        type: 'follow',
        link: `/profile/${requesterId}`,
      });
      await notification.populate('sender', '_id name username avatar');
    } catch (notifError) {
      console.error('Failed to create follow notification:', notifError);
    }

    // Notify the requester that their request was accepted
    try {
      const acceptNotif = await Notification.create({
        recipient: requesterId,
        sender: currentUserId,
        type: 'followAccepted',
        link: `/profile/${currentUserId}`,
      });
      await acceptNotif.populate('sender', '_id name username avatar');
      global.io?.to(requesterId.toString()).emit('newNotification', acceptNotif);
    } catch (notifError) {
      console.error('Failed to create accept notification:', notifError);
    }

    res.status(200).json({
      success: true,
      message: 'Follow request accepted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Decline follow request
// @route   POST /api/users/:id/decline
// @access  Private
export const declineFollowRequest = async (req, res, next) => {
  try {
    const { id: requesterId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser.followRequests?.includes(requesterId)) {
      return res.status(400).json({
        success: false,
        message: 'No follow request from this user',
      });
    }

    // Remove from follow requests
    currentUser.followRequests.pull(requesterId);
    await currentUser.save();

    // Delete the follow request notification
    await Notification.deleteMany({
      recipient: currentUserId,
      sender: requesterId,
      type: 'followRequest',
    });

    res.status(200).json({
      success: true,
      message: 'Follow request declined',
    });
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

    // Check if private account and not following
    if (user.accountType === 'private') {
      const isOwnProfile = req.user && req.user._id.toString() === user._id.toString();
      const isFollowing = req.user && user.followers.some(
        (followerId) => followerId.toString() === req.user._id.toString()
      );

      if (!isOwnProfile && !isFollowing) {
        return res.status(200).json({
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        });
      }
    }

    const posts = await Post.find({ author: req.params.id })
      .populate('author', '_id name username avatar')
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: '_id name username avatar',
          },
          {
            path: 'replies',
            populate: [
              {
                path: 'user',
                select: '_id name username avatar',
              },
              {
                path: 'replies',
                populate: {
                  path: 'user',
                  select: '_id name username avatar',
                },
              },
            ],
          },
        ],
      })
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

// @desc    Get suggested users to follow
// @route   GET /api/users/suggestions
// @access  Private
export const getSuggestedUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const currentUser = await User.findById(req.user._id).select('following');

    // Get users that:
    // 1. Are not the current user
    // 2. Are not already followed by current user
    // 3. Have the most followers (popular users)
    const suggestions = await User.aggregate([
      {
        $match: {
          _id: { 
            $ne: req.user._id, 
            $nin: currentUser.following || []
          },
        },
      },
      {
        $addFields: {
          followersCount: { $size: { $ifNull: ['$followers', []] } },
          postsCount: { $size: { $ifNull: ['$posts', []] } },
        },
      },
      // Prioritize users with more followers and posts
      { $sort: { followersCount: -1, postsCount: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          name: 1,
          username: 1,
          avatar: 1,
          bio: 1,
          followers: 1,
          following: 1,
          followersCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    next(error);
  }
};