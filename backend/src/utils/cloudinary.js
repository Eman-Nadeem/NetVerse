import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

/**
 * Upload buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - The image buffer
 * @param {String} folder - The folder to upload to
 * @returns {Promise<Object>} - Upload result with URL and publicId
 */
export const uploadImage = async (fileBuffer, folder = 'netverse') => {
  try {
    const result = await uploadToCloudinary(fileBuffer, {
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1200, crop: 'limit' }, // Limit max width to 1200px
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload video to Cloudinary
 * @param {Buffer} fileBuffer - The video buffer
 * @param {String} folder - The folder to upload to
 * @returns {Promise<Object>} - Upload result with URL and publicId
 */
export const uploadVideo = async (fileBuffer, folder = 'netverse/videos') => {
  try {
    const result = await uploadToCloudinary(fileBuffer, {
      folder,
      resource_type: 'video',
      allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
      chunk_size: 6000000, // 6MB chunks for large videos
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw new Error('Failed to upload video');
  }
};

/**
 * Upload avatar/profile picture to Cloudinary
 * @param {Buffer} fileBuffer - The image buffer
 * @returns {Promise<Object>} - Upload result with URL and publicId
 */
export const uploadAvatar = async (fileBuffer) => {
  try {
    const result = await uploadToCloudinary(fileBuffer, {
      folder: 'netverse/avatars',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Square avatar
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error uploading avatar to Cloudinary:', error);
    throw new Error('Failed to upload avatar');
  }
};

/**
 * Upload story media to Cloudinary
 * @param {Buffer} fileBuffer - The media buffer
 * @param {String} type - 'image' or 'video'
 * @returns {Promise<Object>} - Upload result with URL and publicId
 */
export const uploadStoryMedia = async (fileBuffer, type = 'image') => {
  try {
    const folder = 'netverse/stories';
    const resourceType = type === 'video' ? 'video' : 'image';

    const result = await uploadToCloudinary(fileBuffer, {
      folder,
      resource_type: resourceType,
      allowed_formats: type === 'video' ? ['mp4', 'mov', 'webm'] : ['jpg', 'jpeg', 'png', 'webp'],
      transformation: type === 'image' ? [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1080, crop: 'limit' }, // Max 1080px for stories
      ] : [],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error uploading story media to Cloudinary:', error);
    throw new Error('Failed to upload story media');
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - The public ID of the file to delete
 * @param {String} type - The resource type ('image' or 'video')
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId, type = 'image') => {
  try {
    if (!publicId) {
      return { result: 'ok', message: 'No public ID provided' };
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });

    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array<String>} publicIds - Array of public IDs to delete
 * @param {String} type - The resource type ('image' or 'video')
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMultipleFromCloudinary = async (publicIds, type = 'image') => {
  try {
    if (!publicIds || publicIds.length === 0) {
      return { result: 'ok', message: 'No public IDs provided' };
    }

    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: type,
    });

    return result;
  } catch (error) {
    console.error('Error deleting multiple files from Cloudinary:', error);
    throw new Error('Failed to delete files from Cloudinary');
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String|null} - Public ID or null
 */
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    // Match the pattern after the last / before the extension
    const matches = url.match(/\/v\d+\/(.+?)\./);
    return matches ? matches[1] : null;
  } catch (error) {
    return null;
  }
};
