import express from 'express';
import {
    createContractorProfile,
    updateBusinessDetails,
    getContractorProfile,
    browseContractors,
    createContractorJob,
    getContractorJobs,
    browseContractorJobs,
    updateContractorJob,
    deleteContractorJob,
    getContractorVerificationStatus,
    createContractorHireRequest,
    getContractorHireRequests,
    getSentContractorHireRequests,
    updateContractorHireRequestStatus,
    deleteContractorHireRequest,
    applyToContractorJob,
    getContractorJobApplications,
    getLabourApplications,
    updateContractorJobApplicationStatus,
    getContractorApplicationHistory
} from '../controllers/contractor.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/browse', browseContractors);
router.get('/jobs/browse', browseContractorJobs);

// Protected routes
router.use(protect);

router.post('/profile', createContractorProfile); // Create contractor profile
router.get('/profile', getContractorProfile);
router.put('/business-details', updateBusinessDetails);

router.post('/jobs', createContractorJob);
router.get('/jobs', getContractorJobs);
router.put('/jobs/:id', updateContractorJob);
router.delete('/jobs/:id', deleteContractorJob);

// Contractor Job Application routes (Labour → Contractor Job)
router.post('/jobs/:id/apply', applyToContractorJob); // Labour applies to contractor job
router.get('/job-applications', getContractorJobApplications); // Get applications for contractor's jobs
router.get('/my-applications', getLabourApplications); // Get labour's own applications
router.patch('/jobs/:jobId/applications/:applicationId', updateContractorJobApplicationStatus); // Accept/Decline application
router.get('/application-history', getContractorApplicationHistory); // Get contractor's application history

// Contractor Hire Request routes
router.post('/hire-request', createContractorHireRequest); // Create hire request (User → Contractor)
router.get('/hire-requests', getContractorHireRequests); // Get received requests (for contractor)
router.get('/hire-requests/sent', getSentContractorHireRequests); // Get sent requests (for user)
router.patch('/hire-request/:id', updateContractorHireRequestStatus); // Accept/Decline request
router.delete('/hire-request/:id', deleteContractorHireRequest); // Delete request

// Verification route
router.get('/verification-status', getContractorVerificationStatus);

export default router;
