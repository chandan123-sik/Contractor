import express from 'express';
import {
    updateBusinessDetails,
    getContractorProfile,
    browseContractors,
    createContractorJob,
    getContractorJobs,
    browseContractorJobs,
    updateContractorJob,
    deleteContractorJob,
    getContractorVerificationStatus
} from '../controllers/contractor.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/browse', browseContractors);
router.get('/jobs/browse', browseContractorJobs);

router.use(protect);

router.get('/profile', getContractorProfile);
router.put('/business-details', updateBusinessDetails);

router.post('/jobs', createContractorJob);
router.get('/jobs', getContractorJobs);
router.put('/jobs/:id', updateContractorJob);
router.delete('/jobs/:id', deleteContractorJob);

// Verification route
router.get('/verification-status', getContractorVerificationStatus);

export default router;
