import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { uploadImage, deleteMultipleFromCloudinary } from '../utils/cloudinary.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content, images, tags, location, privacy } = req.body;
    let uploadedImages = [];

    // If files are uploaded, upload them to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        try {
          const result = await uploadImage(file.buffer, 'netverse/posts');
          return {
            url: result.url,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
          };
        } catch (error) {
          console.error('Error uploading file:', error);
          return null;
        }
      });

      uploadedImages = (await Promise.all(uploadPromises)).filter((img) => img !== null);
    } else if (images && images.length > 0) {
      // If images are provided as URLs (already uploaded)
      uploadedImages = images;
    }

    // Create post
    const post = await Post.create({
      author: req.user._id,
      content,
      images: uploadedImages,
      tags: tags || [],
      location: location || '',
      privacy: privacy || 'public',
    });

    // Populate author
    await post.populate('author', '_id name username avatar');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Private
export const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Get current user with following
    const currentUser = await User.findById(req.user._id).select('following');

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Ensure following is an array
    const following = currentUser.following || [];

    // Get posts from current user and following users
    const posts = await Post.find({
      $or: [
        { author: req.user._id },
        { author: { $in: following } },
      ],
      privacy: { $in: ['public', 'friends'] },
    })
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

    // Get total count
    const total = await Post.countDocuments({
      $or: [
        { author: req.user._id },
        { author: { $in: following } },
      ],
      privacy: { $in: ['public', 'friends'] },
    });

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

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
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
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      // Unlike
      post.likes.pull(req.user._id);
      await post.save();

      res.status(200).json({
        success: true,
        message: 'Post unliked',
        data: { isLiked: false },
      });
    } else {
      // Like
      post.likes.push(req.user._id);
      await post.save();

      // Create notification if not own post
      if (post.author.toString() !== req.user._id.toString()) {
        try {
          const notification = await Notification.create({
            recipient: post.author,
            sender: req.user._id,
            type: 'like',
            post: post._id,
            link: `/post/${post._id}`,
          });

          // Populate sender for real-time emission
          await notification.populate('sender', '_id name username avatar');

          // Emit real-time notification with complete data
          global.io?.to(post.author.toString()).emit('newNotification', notification);
        } catch (notifError) {
          console.error('Failed to create like notification:', notifError);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Post liked',
        data: { isLiked: true },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content, parent } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Create comment
    const comment = await Comment.create({
      post: post._id,
      user: req.user._id,
      content,
      parent: parent || null,
    });

    // If it's a reply, add it to the parent comment's replies array
    if (parent) {
      await Comment.findByIdAndUpdate(parent, {
        $push: { replies: comment._id }
      });
    }

    // Populate user
    await comment.populate('user', '_id name username avatar');

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    // Create notification if not own post
    if (post.author.toString() !== req.user._id.toString()) {
      try {
        const notification = await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: parent ? 'reply' : 'comment',
          post: post._id,
          comment: comment._id,
          content: content.substring(0, 100),
          link: `/post/${post._id}`,
        });

        // Populate for real-time emission
        await notification.populate('sender', '_id name username avatar');

        // Emit real-time notification with complete data
        global.io?.to(post.author.toString()).emit('newNotification', notification);
      } catch (notifError) {
        console.error('Failed to create comment notification:', notifError);
      }
    }

    // If it's a reply, notify the parent comment author
    if (parent && parent.toString() !== req.user._id.toString()) {
      try {
        const parentComment = await Comment.findById(parent);
        if (parentComment && parentComment.user.toString() !== post.author.toString()) {
          await Notification.create({
            recipient: parentComment.user,
            sender: req.user._id,
            type: 'reply',
            post: post._id,
            comment: comment._id,
            link: `/post/${post._id}`,
          });
        }
      } catch (notifError) {
        console.error('Failed to create reply notification:', notifError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this post',
      });
    }

    // Update content
    post.content = content;
    await post.save();

    // Populate author
    await post.populate('author', '_id name username avatar');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    // Delete images from Cloudinary
    if (post.images && post.images.length > 0) {
      const publicIds = post.images.map((img) => img.publicId).filter((id) => id);
      if (publicIds.length > 0) {
        try {
          await deleteMultipleFromCloudinary(publicIds, 'image');
        } catch (error) {
          console.error('Error deleting images from Cloudinary:', error);
          // Continue with deletion even if Cloudinary fails
        }
      }
    }

    // Delete all comments on this post
    await Comment.deleteMany({ post: post._id });

    // Delete notifications related to this post
    await Notification.deleteMany({ post: post._id });

    // Delete the post
    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
export const getComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const comments = await Comment.find({
      post: req.params.id,
      parent: null, // Only top-level comments
    })
      .populate('user', '_id name username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'user',
          select: '_id name username avatar',
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments({
      post: req.params.id,
      parent: null,
    });

    res.status(200).json({
      success: true,
      data: comments,
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

// @desc    Share post
// @route   POST /api/posts/:id/share
// @access  Private
export const sharePost = async (req, res, next) => {
  try {
    const originalPost = await Post.findById(req.params.id);

    if (!originalPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Create repost
    const repost = await Post.create({
      author: req.user._id,
      isRepost: true,
      repostOf: originalPost._id,
    });

    await repost.populate('author', '_id name username avatar');
    await repost.populate('repostOf');

    // Add to original post's shares
    originalPost.shares.push(req.user._id);
    await originalPost.save();

    // Create notification if not own post
    if (originalPost.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: originalPost.author,
        sender: req.user._id,
        type: 'post',
        post: originalPost._id,
        link: `/post/${originalPost._id}`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Post shared successfully',
      data: repost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending/explore posts (public posts sorted by engagement)
// @route   GET /api/posts/explore
// @access  Private
export const getExplorePosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const timeframe = req.query.timeframe || '7d'; // 24h, 7d, 30d

    // Calculate date filter based on timeframe
    let dateFilter = new Date();
    switch (timeframe) {
      case '24h':
        dateFilter.setHours(dateFilter.getHours() - 24);
        break;
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30);
        break;
      default:
        dateFilter.setDate(dateFilter.getDate() - 7);
    }

    // Get public posts sorted by engagement (likes + comments count)
    const posts = await Post.aggregate([
      {
        $match: {
          privacy: 'public',
          createdAt: { $gte: dateFilter },
        },
      },
      {
        $addFields: {
          engagement: {
            $add: [
              { $size: { $ifNull: ['$likes', []] } },
              { $multiply: [{ $size: { $ifNull: ['$comments', []] } }, 2] }, // Comments weighted 2x
              { $size: { $ifNull: ['$shares', []] } },
            ],
          },
        },
      },
      { $sort: { engagement: -1, createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    // Populate author info
    await Post.populate(posts, {
      path: 'author',
      select: '_id name username avatar',
    });

    // Populate comments with user info
    await Post.populate(posts, {
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
    });

    // Get total count
    const total = await Post.countDocuments({
      privacy: 'public',
      createdAt: { $gte: dateFilter },
    });

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