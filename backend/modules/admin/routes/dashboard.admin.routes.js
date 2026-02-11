import express from 'express';
import {
    getDashboardAnalytics,
    getAllInteractions,
    getVerificationQueue,
    getDisputes,
    getRevenue,
    getAudioLogs
} from '../controllers/dashboard.admin.controller.js';
import { protectAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protectAdmin);

router.get('/analytics', getDashboardAnalytics);
router.get('/interactions', getAllInteractions);
router.get('/verification-queue', getVerificationQueue);
router.get('/disputes', getDisputes);
router.get('/revenue', getRevenue);
router.get('/audio-logs', getAudioLogs);

export default router;
