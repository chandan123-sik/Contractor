import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Function to ensure Cloudinary is configured
const ensureCloudinaryConfig = () => {
    if (!cloudinary.config().cloud_name) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
};

/**
 * Upload image to Cloudinary
 * @param {string} imageData - Can be base64 string, file path, or URL
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
export const uploadToCloudinary = async (imageData, folder = 'rajghar') => {
    try {
        console.log(`\n📤 Cloudinary Upload Starting...`);
        console.log(`📁 Folder: ${folder}`);
        console.log(`📊 Data type: ${imageData.startsWith('data:') ? 'base64' : imageData.startsWith('http') ? 'url' : 'file path'}`);
        
        // Ensure Cloudinary is configured
        ensureCloudinaryConfig();
        
        // Verify Cloudinary config
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error('❌ Cloudinary credentials missing!');
            console.error('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
            console.error('API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');
            console.error('API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing');
            throw new Error('Cloudinary configuration is incomplete. Please check environment variables.');
        }
        
        console.log(`✅ Cloudinary Config: ${process.env.CLOUDINARY_CLOUD_NAME}`);
        
        // Check if imageData is a file path
        const isFilePath = typeof imageData === 'string' && !imageData.startsWith('data:') && !imageData.startsWith('http');
        
        console.log('🚀 Uploading to Cloudinary...');
        
        const result = await cloudinary.uploader.upload(imageData, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto:good' }
            ]
        });

        console.log('✅ Upload successful!');
        console.log(`🔗 URL: ${result.secure_url}`);
        console.log(`📦 Public ID: ${result.public_id}`);

        // Delete local file if it was a file path
        if (isFilePath && fs.existsSync(imageData)) {
            fs.unlinkSync(imageData);
            console.log('🗑️  Local file deleted');
        }

        return result.secure_url;
    } catch (error) {
        console.error('❌ Cloudinary upload error:', error);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            http_code: error.http_code
        });
        
        // Provide more specific error messages
        if (error.message && error.message.includes('Must supply api_key')) {
            throw new Error('Cloudinary API key is missing. Please check your environment variables.');
        } else if (error.message && error.message.includes('Invalid image')) {
            throw new Error('Invalid image format. Please upload a valid image file.');
        } else if (error.http_code === 401) {
            throw new Error('Cloudinary authentication failed. Please check your credentials.');
        }
        
        throw new Error(`Failed to upload image to Cloudinary: ${error.message || 'Unknown error'}`);
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<string>} images - Array of base64 strings or file paths
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Array<string>>} - Array of secure URLs
 */
export const uploadMultipleToCloudinary = async (images, folder = 'rajghar') => {
    try {
        const uploadPromises = images.map(image => uploadToCloudinary(image, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Cloudinary multiple upload error:', error);
        throw new Error('Failed to upload multiple images');
    }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicIdOrUrl - Public ID or full URL of the image
 */
export const deleteFromCloudinary = async (publicIdOrUrl) => {
    try {
        let publicId = publicIdOrUrl;
        
        // Extract public_id from URL if full URL is provided
        if (publicIdOrUrl.includes('cloudinary.com')) {
            const urlParts = publicIdOrUrl.split('/');
            const uploadIndex = urlParts.indexOf('upload');
            if (uploadIndex !== -1) {
                const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
                publicId = pathAfterUpload.split('.')[0];
            }
        }
        
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} - Public ID
 */
export const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex !== -1) {
        const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
        return pathAfterUpload.split('.')[0];
    }
    return null;
};

export default cloudinary;
