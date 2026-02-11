import express from 'express';
import { browseJobs } from '../modules/user/controllers/job.controller.js';

const router = express.Router();

router.get('/browse', browseJobs);

export default router;
