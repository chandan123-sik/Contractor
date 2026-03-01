import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    badgeText: {
        type: String,
        required: [true, 'Badge text is required'],
        trim: true,
        maxlength: [50, 'Badge text cannot exceed 50 characters']
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    subtitle: {
        type: String,
        required: [true, 'Subtitle is required'],
        trim: true,
        maxlength: [100, 'Subtitle cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: String,
        required: [true, 'Price is required'],
        trim: true
    },
    priceUnit: {
        type: String,
        required: [true, 'Price unit is required'],
        trim: true
    },
    discount: {
        type: String,
        required: [true, 'Discount is required'],
        trim: true
    },
    backgroundImage: {
        type: String,
        required: [true, 'Background image is required']
    },
    targetAudience: {
        type: String,
        enum: ['ALL', 'USERS', 'LABOUR', 'CONTRACTORS'],
        default: 'ALL',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    priority: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    expiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for faster queries
bannerSchema.index({ isActive: 1, priority: -1 });
bannerSchema.index({ targetAudience: 1 });
bannerSchema.index({ expiresAt: 1 });

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
