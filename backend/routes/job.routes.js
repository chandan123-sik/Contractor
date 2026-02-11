import express from 'express';
import { browseJobs, applyToJob } from '../modules/user/controllers/job.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/browse', browseJobs);
router.post('/:id/apply', protect, applyToJob);

export default router;
