import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
        index: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderType'
    },
    senderType: {
        type: String,
        required: true,
        enum: ['User', 'Labour', 'Contractor']
    },
    senderName: {
        type: String,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverType'
    },
    receiverType: {
        type: String,
        required: true,
        enum: ['User', 'Labour', 'Contractor']
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for faster queries
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
