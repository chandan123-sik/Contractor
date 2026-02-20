import Admin from '../models/Admin.model.js';

// @desc    Get all admins (Super Admin only)
// @route   GET /api/admin/management/admins
// @access  Private (Super Admin)
export const getAllAdmins = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, isActive, search } = req.query;

        // Build query
        const query = {};
        
        if (role) {
            query.role = role;
        }
        
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }
        
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;
        
        const admins = await Admin.find(query)
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Admin.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                admins,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('❌ Get All Admins Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error fetching admins',
            error: error.message
        });
    }
};

// @desc    Get single admin by ID
// @route   GET /api/admin/management/admins/:id
// @access  Private (Super Admin)
export const getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password -refreshToken');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { admin }
        });

    } catch (error) {
        console.error('❌ Get Admin By ID Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error fetching admin',
            error: error.message
        });
    }
};

// @desc    Create new admin (Super Admin only)
// @route   POST /api/admin/management/admins
// @access  Private (Super Admin)
export const createAdmin = async (req, res) => {
    try {
        const { username, password, name, email, phone, role } = req.body;

        // Validation
        if (!username || !password || !name || !email || !phone || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if username or email already exists
        const existingAdmin = await Admin.findOne({
            $or: [{ username }, { email }]
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: existingAdmin.username === username 
                    ? 'Username already exists' 
                    : 'Email already exists'
            });
        }

        // Validate role
        const validRoles = ['SUPER_ADMIN', 'ADMIN_USER', 'ADMIN_LABOUR', 'ADMIN_CONTRACTOR'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        // Create admin
        const admin = await Admin.create({
            username,
            password,
            name,
            email,
            phone,
            role,
            isActive: true
        });

        // Remove password from response
        const adminData = admin.toObject();
        delete adminData.password;
        delete adminData.refreshToken;

        console.log('✅ Admin Created:', admin.username, 'by Super Admin:', req.admin.username);

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: { admin: adminData }
        });

    } catch (error) {
        console.error('❌ Create Admin Error:', error.message);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error creating admin',
            error: error.message
        });
    }
};

// @desc    Update admin (Super Admin only)
// @route   PUT /api/admin/management/admins/:id
// @access  Private (Super Admin)
export const updateAdmin = async (req, res) => {
    try {
        const { name, email, phone, role, isActive } = req.body;

        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Prevent super admin from deactivating themselves
        if (admin._id.toString() === req.admin._id.toString() && isActive === false) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account'
            });
        }

        // Update fields
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;
        if (role) {
            const validRoles = ['SUPER_ADMIN', 'ADMIN_USER', 'ADMIN_LABOUR', 'ADMIN_CONTRACTOR'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role specified'
                });
            }
            admin.role = role;
        }
        if (isActive !== undefined) admin.isActive = isActive;

        await admin.save();

        const updatedAdmin = admin.toObject();
        delete updatedAdmin.password;
        delete updatedAdmin.refreshToken;

        console.log('✅ Admin Updated:', admin.username, 'by Super Admin:', req.admin.username);

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            data: { admin: updatedAdmin }
        });

    } catch (error) {
        console.error('❌ Update Admin Error:', error.message);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error updating admin',
            error: error.message
        });
    }
};

// @desc    Delete admin (Super Admin only)
// @route   DELETE /api/admin/management/admins/:id
// @access  Private (Super Admin)
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Prevent super admin from deleting themselves
        if (admin._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await Admin.findByIdAndDelete(req.params.id);

        console.log('✅ Admin Deleted:', admin.username, 'by Super Admin:', req.admin.username);

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        });

    } catch (error) {
        console.error('❌ Delete Admin Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error deleting admin',
            error: error.message
        });
    }
};

// @desc    Reset admin password (Super Admin only)
// @route   PUT /api/admin/management/admins/:id/reset-password
// @access  Private (Super Admin)
export const resetAdminPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        admin.password = newPassword;
        await admin.save();

        console.log('✅ Admin Password Reset:', admin.username, 'by Super Admin:', req.admin.username);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('❌ Reset Password Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error resetting password',
            error: error.message
        });
    }
};

// @desc    Get admin statistics
// @route   GET /api/admin/management/stats
// @access  Private (Super Admin)
export const getAdminStats = async (req, res) => {
    try {
        const totalAdmins = await Admin.countDocuments();
        const activeAdmins = await Admin.countDocuments({ isActive: true });
        const inactiveAdmins = await Admin.countDocuments({ isActive: false });

        const adminsByRole = await Admin.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentAdmins = await Admin.find()
            .select('-password -refreshToken')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    total: totalAdmins,
                    active: activeAdmins,
                    inactive: inactiveAdmins,
                    byRole: adminsByRole
                },
                recentAdmins
            }
        });

    } catch (error) {
        console.error('❌ Get Admin Stats Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error fetching statistics',
            error: error.message
        });
    }
};
