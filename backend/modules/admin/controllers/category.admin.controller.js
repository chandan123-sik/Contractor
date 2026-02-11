import LabourCategory from '../models/LabourCategory.model.js';

// @desc    Get all labour categories
// @route   GET /api/admin/labour-categories
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const getAllCategories = async (req, res) => {
    try {
        const categories = await LabourCategory.find({ isActive: true })
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: { categories }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching categories',
            error: error.message
        });
    }
};

// @desc    Get category by ID
// @route   GET /api/admin/labour-categories/:id
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const getCategoryById = async (req, res) => {
    try {
        const category = await LabourCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { category }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error fetching category',
            error: error.message
        });
    }
};

// @desc    Create labour category
// @route   POST /api/admin/labour-categories
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;

        // Check if category exists
        const existingCategory = await LabourCategory.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }

        const category = await LabourCategory.create({
            name,
            image: image || 'https://cdn-icons-png.flaticon.com/512/4825/4825038.png',
            createdBy: req.admin._id
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { category }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error creating category',
            error: error.message
        });
    }
};

// @desc    Update labour category
// @route   PUT /api/admin/labour-categories/:id
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const updateCategory = async (req, res) => {
    try {
        const { name, image, isActive } = req.body;

        const category = await LabourCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (name !== undefined) category.name = name;
        if (image !== undefined) category.image = image;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: { category }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error updating category',
            error: error.message
        });
    }
};

// @desc    Delete labour category
// @route   DELETE /api/admin/labour-categories/:id
// @access  Private (SUPER_ADMIN, ADMIN_LABOUR)
export const deleteCategory = async (req, res) => {
    try {
        const category = await LabourCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error deleting category',
            error: error.message
        });
    }
};
