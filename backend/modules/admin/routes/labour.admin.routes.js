import express from 'express';
import {
    getAllLabours,
    getLabourById,
    createLabour,
    updateLabour,
    deleteLabour,
    getLabourContractorRequests,
    getLabourUserRequests,
    getLabourFeedbacks
} from '../controllers/labour.admin.controller.js';
import { protectAdmin, isLabourAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// All routes are protected and require SUPER_ADMIN or ADMIN_LABOUR role
router.use(protectAdmin, isLabourAdmin);

router.route('/')
    .get(getAllLabours)
    .post(createLabour);

router.route('/:id')
    .get(getLabourById)
    .put(updateLabour)
    .delete(deleteLabour);

router.get('/:id/contractor-requests', getLabourContractorRequests);
router.get('/:id/user-requests', getLabourUserRequests);
router.get('/:id/feedbacks', getLabourFeedbacks);

export default router;
