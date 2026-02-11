import express from 'express';
import {
    getAllContractors,
    getContractorById,
    createContractor,
    updateContractor,
    deleteContractor,
    getContractorUserRequests,
    getContractorLabourRequests,
    getContractorFeedbacks
} from '../controllers/contractor.admin.controller.js';
import { protectAdmin, isContractorAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// All routes are protected and require SUPER_ADMIN or ADMIN_CONTRACTOR role
router.use(protectAdmin, isContractorAdmin);

router.route('/')
    .get(getAllContractors)
    .post(createContractor);

router.route('/:id')
    .get(getContractorById)
    .put(updateContractor)
    .delete(deleteContractor);

router.get('/:id/user-requests', getContractorUserRequests);
router.get('/:id/labour-requests', getContractorLabourRequests);
router.get('/:id/feedbacks', getContractorFeedbacks);

export default router;
