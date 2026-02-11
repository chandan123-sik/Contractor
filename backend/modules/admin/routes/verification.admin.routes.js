import express from 'express';
import multer from 'multer';
import {
    getAllVerificationRequests,
    getVerificationRequestById,
    createVerificationRequest,
    approveVerificationRequest,
    rejectVerificationRequest,
    uploadVerificationDocument
} from '../controllers/verification.admin.controller.js';
import { protectAdmin, isSuperAdmin } from '../middleware/admin.auth.middleware.js';

const router = express.Router();

// Multer configuration for file upload
const upload = multer({ dest: 'uploads/' });

// All routes are protected and require SUPER_ADMIN role
router.use(protectAdmin, isSuperAdmin);

router.route('/requests')
    .get(getAllVerificationRequests)
    .post(createVerificationRequest);

router.get('/requests/:id', getVerificationRequestById);
router.put('/requests/:id/approve', approveVerificationRequest);
router.put('/requests/:id/reject', rejectVerificationRequest);

router.post('/upload-document', upload.single('file'), uploadVerificationDocument);

export default router;
