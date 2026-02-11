import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessType: {
        type: String,
        enum: ['Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP'],
        default: 'Proprietorship'
    },
    businessName: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    addressLine1: {
        type: String,
        trim: true
    },
    landmark: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

contractorSchema.index({ user: 1 });

const Contractor = mongoose.model('Contractor', contractorSchema);

export default Contractor;
