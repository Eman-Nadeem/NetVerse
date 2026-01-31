import multer from 'multer';
import path from 'path';

// Memory storage (files are stored in RAM, not disk)
// This allows us to process files before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP).'));
  }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|avi|webm/;

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('video/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only videos are allowed (MP4, MOV, AVI, WebM).'));
  }
};

// File filter for any media (image or video)
const mediaFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

// Multer configuration for single image upload (avatar, profile picture)
export const uploadSingle = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for single images
  },
}).single('image');

// Multer configuration for multiple image upload (post images)
export const uploadMultiple = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per image
    files: 10, // Max 10 files
  },
}).array('images', 10);

// Multer configuration for video upload
export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
}).single('video');

// Multer configuration for story media (image or video)
export const uploadStoryMedia = multer({
  storage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for story media
  },
}).single('media');

// Error handler middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field',
      });
    }
  }

  if (err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};