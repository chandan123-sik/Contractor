import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.admin.controller.js';
import { protectAdmin, isLabourAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// All routes are protected and require SUPER_ADMIN or ADMIN_LABOUR role
router.use(protectAdmin, isLabourAdmin);

router.route('/')
    .get(getAllCategories)
    .post(createCategory);

router.route('/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

export default router;
