import express from 'express';
import { createJob, getUserJobs, getJobById, updateJob, deleteJob } from '../controllers/job.controller.js';
import { protect } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/jobs', createJob);
router.get('/jobs', getUserJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

export default router;
