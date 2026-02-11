import express from 'express';
import {
    getAllBroadcasts,
    getBroadcastById,
    createBroadcast,
    updateBroadcast,
    deleteBroadcast,
    sendBroadcast,
    getBroadcastStats
} from '../controllers/broadcast.admin.controller.js';
import { protectAdmin, isUserAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// All routes require admin authentication and SUPER_ADMIN or ADMIN_USER role
router.use(protectAdmin, isUserAdmin);

// Stats route (must be before :id route)
router.get('/stats', getBroadcastStats);

// CRUD routes
router.get('/', getAllBroadcasts);
router.get('/:id', getBroadcastById);
router.post('/', createBroadcast);
router.put('/:id', updateBroadcast);
router.delete('/:id', deleteBroadcast);

// Send broadcast
router.post('/:id/send', sendBroadcast);

export default router;
