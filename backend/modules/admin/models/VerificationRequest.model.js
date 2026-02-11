import mongoose from 'mongoose';

const verificationRequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    entityType: {
        type: String,
        enum: ['user', 'labour', 'contractor'],
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'entityModel'
    },
    entityModel: {
        type: String,
        required: true,
        enum: ['User', 'Labour', 'Contractor']
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    aadhaarNumber: {
        type: String,
        required: true,
        match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhaar number']
    },
    aadhaarFrontUrl: {
        type: String,
        required: true
    },
    aadhaarBackUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    rejectionReason: {
        type: String,
        default: null
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    // Additional fields for specific entity types
    trade: {
        type: String,
        default: null
    },
    company: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Generate requestId before saving
verificationRequestSchema.pre('save', async function(next) {
    if (!this.requestId) {
        const prefix = this.entityType === 'user' ? 'V-U' : 
                      this.entityType === 'labour' ? 'V-L' : 'V-C';
        
        const count = await mongoose.model('VerificationRequest').countDocuments({ 
            entityType: this.entityType 
        });
        
        this.requestId = `${prefix}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

const VerificationRequest = mongoose.model('VerificationRequest', verificationRequestSchema);

export default VerificationRequest;
