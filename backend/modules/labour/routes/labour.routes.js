import express from 'express';
import {
    createLabourProfile,
    updateWorkDetails,
    createLabourCard,
    getLabourProfile,
    browseLabourCards,
    getLabourById
} from '../controllers/labour.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/create-profile', createLabourProfile); // For registration flow
router.get('/browse', browseLabourCards);
router.get('/:id', getLabourById);

// Protected routes
router.use(protect);

router.put('/work-details', updateWorkDetails);
router.post('/card', createLabourCard);
router.get('/profile', getLabourProfile);

export default router;
