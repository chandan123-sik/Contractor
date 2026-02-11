import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserContractorRequests,
    getUserLabourRequests,
    getUserFeedbacks
} from '../controllers/user.admin.controller.js';
import { protectAdmin, isUserAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// All routes are protected and require SUPER_ADMIN or ADMIN_USER role
router.use(protectAdmin, isUserAdmin);

router.route('/')
    .get(getAllUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router.get('/:id/contractor-requests', getUserContractorRequests);
router.get('/:id/labour-requests', getUserLabourRequests);
router.get('/:id/feedbacks', getUserFeedbacks);

export default router;
