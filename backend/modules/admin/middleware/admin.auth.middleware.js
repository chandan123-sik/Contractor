import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model.js';

// Protect admin routes
export const protectAdmin = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id).select('-password -__v');

        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (!req.admin.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Admin account is deactivated'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
            error: error.message
        });
    }
};

// Check admin role
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (!allowedRoles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

// Role-specific middleware shortcuts
export const isSuperAdmin = checkRole(['SUPER_ADMIN']);
export const isUserAdmin = checkRole(['SUPER_ADMIN', 'ADMIN_USER']);
export const isLabourAdmin = checkRole(['SUPER_ADMIN', 'ADMIN_LABOUR']);
export const isContractorAdmin = checkRole(['SUPER_ADMIN', 'ADMIN_CONTRACTOR']);
