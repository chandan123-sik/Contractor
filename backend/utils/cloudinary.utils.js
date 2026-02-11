import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (base64Image, folder = 'rajghar') => {
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: folder,
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image');
    }
};

export default cloudinary;
