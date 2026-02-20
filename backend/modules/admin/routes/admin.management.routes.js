import express from 'express';
import {
    getAllAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    resetAdminPassword,
    getAdminStats
} from '../controllers/admin.management.controller.js';
import { protectAdmin, isSuperAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// All routes require Super Admin access
router.use(protectAdmin, isSuperAdmin);

// Admin CRUD routes
router.get('/admins', getAllAdmins);
router.get('/admins/:id', getAdminById);
router.post('/admins', createAdmin);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);

// Password reset
router.put('/admins/:id/reset-password', resetAdminPassword);

// Statistics
router.get('/stats', getAdminStats);

export default router;
