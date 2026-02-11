import mongoose from 'mongoose';

const cmsContentSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true,
        enum: ['aboutUs', 'contactUs', 'terms', 'privacy']
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    }
}, {
    timestamps: true
});

const CMSContent = mongoose.model('CMSContent', cmsContentSchema);

export default CMSContent;
