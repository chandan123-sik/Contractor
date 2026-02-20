import Chat from '../models/Chat.model.js';
import Message from '../models/Message.model.js';
import User from '../modules/user/models/User.model.js';
import Labour from '../modules/labour/models/Labour.model.js';
import Contractor from '../modules/contractor/models/Contractor.model.js';

// @desc    Create chat from hire request (called automatically on accept)
// @route   Internal function
// @access  Private
export const createChatFromRequest = async (requestData) => {
    try {
        const isDev = process.env.NODE_ENV === 'development';
        
        if (isDev) {
            console.log('\n🟢 ===== CREATE CHAT FROM REQUEST =====');
            console.log('📦 Request Data:', JSON.stringify(requestData, null, 2));
        }

        const {
            participant1,
            participant2,
            relatedRequest
        } = requestData;

        const userId1 = participant1.userId.toString();
        const userId2 = participant2.userId.toString();

        if (isDev) {
            console.log('👥 Checking for existing chat between:');
            console.log('   Participant 1:', userId1, `(${participant1.userType})`);
            console.log('   Participant 2:', userId2, `(${participant2.userType})`);
        }

        // ✅ FIRST: Check if chat exists between these two participants (most important check)
        let existingChat = await Chat.findOne({
            $and: [
                { 'participants.userId': userId1 },
                { 'participants.userId': userId2 }
            ],
            isActive: true
        });

        if (existingChat) {
            if (isDev) {
                console.log('✅ FOUND existing chat between these participants:', existingChat._id);
                console.log('   Reusing existing chat instead of creating new one');
            }
            
            // Update relatedRequest to link this new interaction to existing chat
            if (!existingChat.relatedRequest || existingChat.relatedRequest.requestId.toString() !== relatedRequest.requestId.toString()) {
                if (isDev) console.log('   Updating relatedRequest reference to new interaction');
                existingChat.relatedRequest = relatedRequest;
                await existingChat.save();
            }
            
            if (isDev) console.log('===========================\n');
            return existingChat;
        }

        // SECOND: Check by specific request ID (in case participants check failed)
        existingChat = await Chat.findOne({
            'relatedRequest.requestId': relatedRequest.requestId
        });

        if (existingChat) {
            if (isDev) {
                console.log('⚠️ Chat already exists for this specific request:', existingChat._id);
                console.log('===========================\n');
            }
            return existingChat;
        }

        // No existing chat found - create new one
        if (isDev) console.log('📝 No existing chat found, creating new chat...');
        
        const chat = await Chat.create({
            participants: [participant1, participant2],
            relatedRequest,
            isActive: true,
            unreadCount: {
                [userId1]: 0,
                [userId2]: 0
            }
        });

        if (isDev) {
            console.log('✅ New chat created successfully:', chat._id);
            console.log('===========================\n');
        }

        return chat;
    } catch (error) {
        console.error('❌ CREATE CHAT ERROR:', error.message);
        if (process.env.NODE_ENV === 'development') {
            console.error('Stack:', error.stack);
            console.log('===========================\n');
        }
        throw error;
    }
};

// @desc    Get all chats for logged-in user
// @route   GET /api/chat/chats
// @access  Private
export const getUserChats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all chats where user is a participant
        const chats = await Chat.find({
            'participants.userId': userId,
            isActive: true
        }).sort({ 'lastMessage.timestamp': -1, createdAt: -1 });

        // Format chats for frontend
        const formattedChats = chats.map(chat => {
            // Find the other participant
            const otherParticipant = chat.participants.find(
                p => p.userId.toString() !== userId.toString()
            );

            return {
                _id: chat._id,
                otherParticipant: {
                    userId: otherParticipant.userId,
                    userType: otherParticipant.userType,
                    name: otherParticipant.name,
                    profilePhoto: otherParticipant.profilePhoto,
                    mobileNumber: otherParticipant.mobileNumber
                },
                lastMessage: chat.lastMessage.text || 'No messages yet',
                lastMessageTime: chat.lastMessage.timestamp || chat.createdAt,
                unreadCount: chat.unreadCount.get(userId.toString()) || 0,
                createdAt: chat.createdAt
            };
        });

        res.status(200).json({
            success: true,
            data: {
                chats: formattedChats,
                count: formattedChats.length
            }
        });
    } catch (error) {
        console.error('❌ GET USER CHATS ERROR:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to get chats',
            error: error.message
        });
    }
};

// @desc    Get specific chat by ID
// @route   GET /api/chat/chats/:chatId
// @access  Private
export const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        console.log('\n🔵 ===== GET CHAT BY ID =====');
        console.log('Chat ID:', chatId);
        console.log('User ID:', userId);

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        // Verify user is a participant
        const isParticipant = chat.participants.some(
            p => p.userId.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this chat'
            });
        }

        // Find the other participant
        const otherParticipant = chat.participants.find(
            p => p.userId.toString() !== userId.toString()
        );

        console.log('✅ Chat found');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                chat: {
                    _id: chat._id,
                    otherParticipant,
                    participants: chat.participants,
                    createdAt: chat.createdAt
                }
            }
        });
    } catch (error) {
        console.error('❌ GET CHAT BY ID ERROR:', error.message);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Failed to get chat',
            error: error.message
        });
    }
};

// @desc    Get messages for a chat
// @route   GET /api/chat/chats/:chatId/messages
// @access  Private
export const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;
        const { page = 1, limit = 50 } = req.query;

        console.log('\n🔵 ===== GET CHAT MESSAGES =====');
        console.log('Chat ID:', chatId);
        console.log('User ID:', userId);

        // Verify chat exists and user is participant
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        const isParticipant = chat.participants.some(
            p => p.userId.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this chat'
            });
        }

        // Get messages with pagination
        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Message.countDocuments({ chatId });

        console.log('✅ Found', messages.length, 'messages');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            data: {
                messages,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('❌ GET CHAT MESSAGES ERROR:', error.message);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Failed to get messages',
            error: error.message
        });
    }
};

// @desc    Send message
// @route   POST /api/chat/chats/:chatId/messages
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;
        const { content, messageType = 'text', imageUrl = '' } = req.body;

        console.log('\n🟢 ===== SEND MESSAGE =====');
        console.log('Chat ID:', chatId);
        console.log('Sender ID:', userId);
        console.log('Content:', content);

        // Verify chat exists and user is participant
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        const sender = chat.participants.find(
            p => p.userId.toString() === userId.toString()
        );

        if (!sender) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to send messages in this chat'
            });
        }

        const receiver = chat.participants.find(
            p => p.userId.toString() !== userId.toString()
        );

        // Create message
        const message = await Message.create({
            chatId,
            senderId: sender.userId,
            senderType: sender.userType,
            senderName: sender.name,
            receiverId: receiver.userId,
            receiverType: receiver.userType,
            messageType,
            content,
            imageUrl,
            isRead: false
        });

        // Update chat's lastMessage
        chat.lastMessage = {
            text: content,
            senderId: sender.userId,
            timestamp: new Date()
        };

        // Increment unread count for receiver
        const receiverUnreadCount = chat.unreadCount.get(receiver.userId.toString()) || 0;
        chat.unreadCount.set(receiver.userId.toString(), receiverUnreadCount + 1);

        await chat.save();

        console.log('✅ Message sent successfully');
        console.log('===========================\n');

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: { message }
        });
    } catch (error) {
        console.error('❌ SEND MESSAGE ERROR:', error.message);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// @desc    Mark messages as read
// @route   PATCH /api/chat/chats/:chatId/read
// @access  Private
export const markMessagesAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        console.log('\n🟡 ===== MARK MESSAGES AS READ =====');
        console.log('Chat ID:', chatId);
        console.log('User ID:', userId);

        // Verify chat exists and user is participant
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        const isParticipant = chat.participants.some(
            p => p.userId.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this chat'
            });
        }

        // Mark all unread messages as read
        await Message.updateMany(
            {
                chatId,
                receiverId: userId,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        // Reset unread count for this user
        chat.unreadCount.set(userId.toString(), 0);
        await chat.save();

        console.log('✅ Messages marked as read');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });
    } catch (error) {
        console.error('❌ MARK MESSAGES AS READ ERROR:', error.message);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Failed to mark messages as read',
            error: error.message
        });
    }
};

// @desc    Delete chat (soft delete)
// @route   DELETE /api/chat/chats/:chatId
// @access  Private
export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        console.log('\n🔴 ===== DELETE CHAT =====');
        console.log('Chat ID:', chatId);
        console.log('User ID:', userId);

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found'
            });
        }

        const isParticipant = chat.participants.some(
            p => p.userId.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this chat'
            });
        }

        // Soft delete
        chat.isActive = false;
        await chat.save();

        console.log('✅ Chat deleted');
        console.log('===========================\n');

        res.status(200).json({
            success: true,
            message: 'Chat deleted successfully'
        });
    } catch (error) {
        console.error('❌ DELETE CHAT ERROR:', error.message);
        console.log('===========================\n');
        res.status(500).json({
            success: false,
            message: 'Failed to delete chat',
            error: error.message
        });
    }
};
