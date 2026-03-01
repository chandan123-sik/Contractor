import Banner from '../models/Banner.model.js';
import { uploadToCloudinary } from '../../../utils/cloudinary.utils.js';

// @desc    Get all banners
// @route   GET /api/admin/banners
// @access  Private (Admin)
export const getAllBanners = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive, targetAudience } = req.query;

        const query = {};
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (targetAudience) query.targetAudience = targetAudience;

        const banners = await Banner.find(query)
            .populate('createdBy', 'username email')
            .sort({ priority: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Banner.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                banners,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching banners:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching banners',
            error: error.message
        });
    }
};

// @desc    Get banner by ID
// @route   GET /api/admin/banners/:id
// @access  Private (Admin)
export const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { banner }
        });

    } catch (error) {
        console.error('❌ Error fetching banner:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching banner',
            error: error.message
        });
    }
};

// @desc    Create new banner
// @route   POST /api/admin/banners
// @access  Private (Admin)
export const createBanner = async (req, res) => {
    try {
        const {
            badgeText,
            title,
            subtitle,
            description,
            price,
            priceUnit,
            discount,
            backgroundImage,
            targetAudience,
            priority,
            expiresAt
        } = req.body;

        console.log('🎨 Creating banner:', { title, targetAudience });

        // Validation
        if (!title || !subtitle || !description || !price || !priceUnit || !discount || !badgeText) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!backgroundImage) {
            return res.status(400).json({
                success: false,
                message: 'Background image is required'
            });
        }

        if (!req.admin || !req.admin._id) {
            return res.status(401).json({
                success: false,
                message: 'Admin authentication required'
            });
        }

        // Upload image to Cloudinary if it's base64
        let imageUrl = backgroundImage;
        if (backgroundImage.startsWith('data:image')) {
            console.log('📤 Uploading image to Cloudinary...');
            imageUrl = await uploadToCloudinary(backgroundImage, 'banners');
            console.log('✅ Image uploaded:', imageUrl);
        }

        const banner = await Banner.create({
            badgeText,
            title,
            subtitle,
            description,
            price,
            priceUnit,
            discount,
            backgroundImage: imageUrl,
            targetAudience: targetAudience || 'ALL',
            priority: priority || 0,
            expiresAt: expiresAt || null,
            createdBy: req.admin._id
        });

        const populatedBanner = await Banner.findById(banner._id)
            .populate('createdBy', 'username email');

        console.log('✅ Banner created:', populatedBanner._id);

        res.status(201).json({
            success: true,
            message: 'Banner created successfully',
            data: { banner: populatedBanner }
        });

    } catch (error) {
        console.error('❌ Error creating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating banner',
            error: error.message
        });
    }
};

// @desc    Update banner
// @route   PUT /api/admin/banners/:id
// @access  Private (Admin)
export const updateBanner = async (req, res) => {
    try {
        const {
            badgeText,
            title,
            subtitle,
            description,
            price,
            priceUnit,
            discount,
            backgroundImage,
            targetAudience,
            priority,
            isActive,
            expiresAt
        } = req.body;

        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }

        // Upload new image if provided and it's base64
        let imageUrl = backgroundImage;
        if (backgroundImage && backgroundImage.startsWith('data:image')) {
            console.log('📤 Uploading new image to Cloudinary...');
            imageUrl = await uploadToCloudinary(backgroundImage, 'banners');
            console.log('✅ New image uploaded:', imageUrl);
        }

        // Update fields
        if (badgeText !== undefined) banner.badgeText = badgeText;
        if (title !== undefined) banner.title = title;
        if (subtitle !== undefined) banner.subtitle = subtitle;
        if (description !== undefined) banner.description = description;
        if (price !== undefined) banner.price = price;
        if (priceUnit !== undefined) banner.priceUnit = priceUnit;
        if (discount !== undefined) banner.discount = discount;
        if (imageUrl !== undefined) banner.backgroundImage = imageUrl;
        if (targetAudience !== undefined) banner.targetAudience = targetAudience;
        if (priority !== undefined) banner.priority = priority;
        if (isActive !== undefined) banner.isActive = isActive;
        if (expiresAt !== undefined) banner.expiresAt = expiresAt;

        await banner.save();

        const updatedBanner = await Banner.findById(banner._id)
            .populate('createdBy', 'username email');

        res.status(200).json({
            success: true,
            message: 'Banner updated successfully',
            data: { banner: updatedBanner }
        });

    } catch (error) {
        console.error('❌ Error updating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating banner',
            error: error.message
        });
    }
};

// @desc    Delete banner
// @route   DELETE /api/admin/banners/:id
// @access  Private (Admin)
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }

        await banner.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Banner deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting banner:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting banner',
            error: error.message
        });
    }
};

// @desc    Get active banners for public display
// @route   GET /api/banners/active
// @access  Public
export const getActiveBanners = async (req, res) => {
    try {
        const { targetAudience = 'ALL' } = req.query;

        console.log('🎯 Fetching active banners for audience:', targetAudience);

        const now = new Date();

        // Find banners that are:
        // 1. Active (isActive = true)
        // 2. Target audience matches or is ALL
        // 3. Not expired (expiresAt is null or in future)
        const banners = await Banner.find({
            isActive: true,
            $or: [
                { targetAudience: targetAudience },
                { targetAudience: 'ALL' }
            ],
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: now } }
            ]
        })
            .select('-createdBy -__v')
            .sort({ priority: -1, createdAt: -1 })
            .limit(10);

        console.log('✅ Found', banners.length, 'active banners');

        res.status(200).json({
            success: true,
            data: {
                banners,
                total: banners.length
            }
        });

    } catch (error) {
        console.error('❌ Error fetching active banners:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching active banners',
            error: error.message
        });
    }
};

// @desc    Toggle banner active status
// @route   PATCH /api/admin/banners/:id/toggle
// @access  Private (Admin)
export const toggleBannerStatus = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }

        banner.isActive = !banner.isActive;
        await banner.save();

        res.status(200).json({
            success: true,
            message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { banner }
        });

    } catch (error) {
        console.error('❌ Error toggling banner status:', error);
        res.status(500).json({
            success: false,
            message: 'Server error toggling banner status',
            error: error.message
        });
    }
};
