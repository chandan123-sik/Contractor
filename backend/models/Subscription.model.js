import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    autoRenew: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
