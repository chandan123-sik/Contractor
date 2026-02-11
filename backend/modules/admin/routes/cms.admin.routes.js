import express from 'express';
import {
    getAllCMSContent,
    getCMSContentBySection,
    updateCMSContent,
    updateCMSSection
} from '../controllers/cms.admin.controller.js';
import { protectAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// Public route for getting CMS content
router.get('/:section', getCMSContentBySection);

// Protected routes
router.get('/', protectAdmin, getAllCMSContent);
router.put('/', protectAdmin, updateCMSContent);
router.put('/:section', protectAdmin, updateCMSSection);

export default router;
