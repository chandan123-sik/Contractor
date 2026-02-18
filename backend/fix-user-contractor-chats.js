/**
 * Script to fix missing chats for accepted User-Contractor hire requests
 * Run this once to link chats to existing accepted hire requests
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContractorHireRequest from './modules/contractor/models/ContractorHireRequest.model.js';
import User from './modules/user/models/User.model.js';
import Contractor from './modules/contractor/models/Contractor.model.js';
import { createChatFromRequest } from './controllers/chat.controller.js';

dotenv.config();

const fixUserContractorChats = async () => {
    try {
        console.log('🔧 Starting to fix missing chats for User-Contractor hire requests...\n');

        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all accepted hire requests without chatId
        const hireRequests = await ContractorHireRequest.find({
            status: 'accepted',
            chatId: null
        })
        .populate({
            path: 'contractorId',
            populate: {
                path: 'user',
                select: 'firstName lastName mobileNumber profilePhoto'
            }
        })
        .populate('requesterId', 'firstName lastName mobileNumber profilePhoto');

        console.log(`📊 Found ${hireRequests.length} accepted hire requests without chat\n`);

        let fixedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const hireRequest of hireRequests) {
            console.log(`\n🔍 Processing hire request:`);
            console.log(`   Request ID: ${hireRequest._id}`);
            console.log(`   Contractor: ${hireRequest.contractorName}`);
            console.log(`   Requester: ${hireRequest.requesterName}`);

            try {
                // Validate data
                if (!hireRequest.contractorId || !hireRequest.contractorId.user) {
                    console.log('   ❌ Contractor user not found, skipping...');
                    skippedCount++;
                    continue;
                }

                if (!hireRequest.requesterId) {
                    console.log('   ❌ Requester user not found, skipping...');
                    skippedCount++;
                    continue;
                }

                const contractorUser = hireRequest.contractorId.user;
                const requesterUser = hireRequest.requesterId;

                // Prepare chat data
                const chatData = {
                    participant1: {
                        userId: contractorUser._id,
                        userType: 'Contractor',
                        name: `${contractorUser.firstName} ${contractorUser.lastName}`,
                        profilePhoto: contractorUser.profilePhoto || '',
                        mobileNumber: contractorUser.mobileNumber
                    },
                    participant2: {
                        userId: requesterUser._id,
                        userType: 'User',
                        name: `${requesterUser.firstName} ${requesterUser.lastName}`,
                        profilePhoto: requesterUser.profilePhoto || '',
                        mobileNumber: requesterUser.mobileNumber
                    },
                    relatedRequest: {
                        requestId: hireRequest._id,
                        requestType: 'ContractorHireRequest'
                    }
                };

                // Create or find existing chat
                const chat = await createChatFromRequest(chatData);

                // Link chat to hire request
                hireRequest.chatId = chat._id;
                await hireRequest.save();

                console.log(`   ✅ Chat created/linked: ${chat._id}`);
                fixedCount++;

            } catch (error) {
                console.log(`   ❌ Error creating chat: ${error.message}`);
                errorCount++;
            }
        }

        console.log('\n\n📊 Summary:');
        console.log(`   ✅ Fixed: ${fixedCount} hire requests`);
        console.log(`   ⏭️  Skipped: ${skippedCount} hire requests`);
        console.log(`   ❌ Errors: ${errorCount} hire requests`);
        console.log('\n✅ Script completed!\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Script failed:', error);
        process.exit(1);
    }
};

// Run the script
fixUserContractorChats();
