import express from 'express';
import { getProfile, updateProfile } from '../modules/user/controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
