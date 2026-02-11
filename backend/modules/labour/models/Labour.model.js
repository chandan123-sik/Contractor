import mongoose from 'mongoose';

const labourSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skillType: {
        type: String,
        trim: true
        // Removed enum to allow any skill type
    },
    experience: {
        type: String,
        trim: true
    },
    workPhotos: [{
        type: String
    }],
    previousWorkLocation: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    availability: {
        type: String,
        enum: ['Full Time', 'Part Time', 'Available', 'Busy', 'Not Available'],
        default: 'Available'
    },
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Busy', 'Not Available'],
        default: 'Available'
    },
    labourCardDetails: {
        fullName: {
            type: String,
            trim: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        mobileNumber: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        skills: {
            type: String,
            trim: true
        }
    },
    hasLabourCard: {
        type: Boolean,
        default: false
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

labourSchema.index({ user: 1 });
labourSchema.index({ skillType: 1 });
labourSchema.index({ availability: 1 });

const Labour = mongoose.model('Labour', labourSchema);

export default Labour;
