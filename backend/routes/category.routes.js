import express from 'express';
import { getPublicCategories } from '../controllers/category.controller.js';

const router = express.Router();

// Public route - no authentication required
router.get('/', getPublicCategories);

export default router;
