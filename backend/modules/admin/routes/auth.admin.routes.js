import express from 'express';
import {
    adminLogin,
    adminLogout,
    changePassword,
    verifyToken,
    getAdminProfile,
    updateAdminProfile
} from '../controllers/auth.admin.controller.js';
import { protectAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.post('/logout', protectAdmin, adminLogout);
router.put('/change-password', protectAdmin, changePassword);
router.get('/verify-token', protectAdmin, verifyToken);
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);

export default router;
