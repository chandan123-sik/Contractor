import express from 'express';
import {
    createLabourProfile,
    updateWorkDetails,
    createLabourCard,
    getLabourProfile,
    browseLabourCards,
    getLabourById,
    getLabourVerificationStatus
} from '../controllers/labour.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/create-profile', createLabourProfile); // For registration flow
router.get('/browse', browseLabourCards);

// Protected routes
router.use(protect);

router.get('/profile', getLabourProfile); // Must come before /:id
router.get('/verification-status', getLabourVerificationStatus);
router.put('/work-details', updateWorkDetails);
router.post('/card', createLabourCard);

// Dynamic routes (must be last)
router.get('/:id', getLabourById);

export default router;
