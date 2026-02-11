import express from 'express';
import { createJob, getUserJobs, getJobById, updateJob, deleteJob, getJobApplications, updateApplicationStatus } from '../controllers/job.controller.js';
import { getUserVerificationStatus } from '../controllers/user.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/jobs', createJob);
router.get('/jobs', getUserJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

// Application routes
router.get('/jobs/:id/applications', getJobApplications);
router.put('/jobs/:id/applications/:applicationId', updateApplicationStatus);

// Verification route
router.get('/verification-status', getUserVerificationStatus);

export default router;
