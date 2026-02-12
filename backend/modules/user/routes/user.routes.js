import express from 'express';
import { createJob, getUserJobs, getJobById, updateJob, deleteJob, getJobApplications, getContractorApplications, getMyApplications, getApplicationHistory, updateApplicationStatus } from '../controllers/job.controller.js';
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
router.get('/contractor-applications', getContractorApplications);
router.get('/my-applications', getMyApplications);
router.get('/application-history', getApplicationHistory);
router.put('/jobs/:id/applications/:applicationId', updateApplicationStatus);

// Verification route
router.get('/verification-status', getUserVerificationStatus);

export default router;
