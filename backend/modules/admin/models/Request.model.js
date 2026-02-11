import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['User', 'Labour', 'Contractor']
    },
    senderType: {
        type: String,
        required: true,
        enum: ['User', 'Labour', 'Contractor']
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['User', 'Labour', 'Contractor']
    },
    receiverType: {
        type: String,
        required: true,
        enum: ['User', 'Labour', 'Contractor']
    },
    requestType: {
        type: String,
        required: true,
        enum: ['HIRE', 'INQUIRY', 'JOIN_TEAM']
    },
    requestContext: {
        type: String,
        required: true,
        enum: ['Audio', 'Text', 'HIRE']
    },
    content: {
        type: String,
        default: null
    },
    audioUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    }
}, {
    timestamps: true
});

// Indexes for faster queries
requestSchema.index({ senderId: 1, senderType: 1 });
requestSchema.index({ receiverId: 1, receiverType: 1 });
requestSchema.index({ status: 1 });

const Request = mongoose.model('Request', requestSchema);

export default Request;
