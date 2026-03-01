import express from 'express';
import {
    getAllBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    getActiveBanners,
    toggleBannerStatus
} from '../controllers/banner.admin.controller.js';
import { protectAdmin, isUserAdmin } from '../middleware/admin.auth.middleware.js';
import {
    validateObjectIdParam,
    validatePagination
} from '../middleware/admin.validation.middleware.js';

const router = express.Router();

// Public route for active banners
router.get('/active', getActiveBanners);

// All other routes require admin authentication
router.use(protectAdmin, isUserAdmin);

// CRUD routes
router.get('/', validatePagination, getAllBanners);
router.get('/:id', validateObjectIdParam('id'), getBannerById);
router.post('/', createBanner);
router.put('/:id', validateObjectIdParam('id'), updateBanner);
router.delete('/:id', validateObjectIdParam('id'), deleteBanner);

// Toggle active status
router.patch('/:id/toggle', validateObjectIdParam('id'), toggleBannerStatus);

export default router;
