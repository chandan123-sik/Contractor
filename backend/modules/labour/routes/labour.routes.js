import express from 'express';
import {
    createLabourProfile,
    updateWorkDetails,
    createLabourCard,
    getLabourProfile,
    browseLabourCards,
    getLabourById,
    getLabourVerificationStatus,
    createHireRequest,
    getLabourHireRequests,
    getSentHireRequests,
    updateHireRequestStatus,
    deleteHireRequest,
    getLabourApplicationHistory
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

// Hire Request routes
router.post('/hire-request', createHireRequest); // Create hire request
router.get('/hire-requests', getLabourHireRequests); // Get received requests (for labour)
router.get('/hire-requests/sent', getSentHireRequests); // Get sent requests (for user/contractor)
router.patch('/hire-request/:id', updateHireRequestStatus); // Accept/Decline request
router.delete('/hire-request/:id', deleteHireRequest); // Delete request

// Application History
router.get('/application-history', getLabourApplicationHistory); // Get labour's application history

// Dynamic routes (must be last)
router.get('/:id', getLabourById);

export default router;
