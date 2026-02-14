import mongoose from 'mongoose';

const contractorHireRequestSchema = new mongoose.Schema({
    // Contractor Information
    contractorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contractor',
        required: true
    },
    contractorJobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractorJob',
        required: true
    },
    contractorName: {
        type: String,
        required: true
    },
    contractorPhone: {
        type: String,
        required: true
    },
    contractorBusiness: {
        type: String,
        required: true
    },
    contractorCity: {
        type: String,
        required: true
    },

    // Requester Information (User only - users hire contractors)
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requesterName: {
        type: String,
        required: true
    },
    requesterPhone: {
        type: String,
        required: true
    },
    requesterLocation: {
        type: String,
        required: true
    },

    // Request Status
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },

    // Response Details
    respondedAt: {
        type: Date,
        default: null
    },

    // Additional Info
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Indexes for faster queries
contractorHireRequestSchema.index({ contractorId: 1, status: 1 });
contractorHireRequestSchema.index({ contractorJobId: 1, status: 1 });
contractorHireRequestSchema.index({ requesterId: 1 });
contractorHireRequestSchema.index({ status: 1, createdAt: -1 });

const ContractorHireRequest = mongoose.model('ContractorHireRequest', contractorHireRequestSchema);

export default ContractorHireRequest;
