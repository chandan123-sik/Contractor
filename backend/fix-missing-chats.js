/**
 * Script to fix missing chats for accepted contractor job applications
 * Run this once to link chats to existing accepted applications
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';
import User from './modules/user/models/User.model.js';
import Labour from './modules/labour/models/Labour.model.js';
import { createChatFromRequest } from './controllers/chat.controller.js';

dotenv.config();

const fixMissingChats = async () => {
    try {
        console.log('🔧 Starting to fix missing chats for accepted applications...\n');

        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all contractor jobs with accepted applications
        const jobs = await ContractorJob.find({ isActive: true })
            .populate({
                path: 'applications.labour',
                populate: {
                    path: 'user',
                    select: 'firstName lastName mobileNumber profilePhoto'
                }
            })
            .populate('user', 'firstName lastName mobileNumber profilePhoto');

        console.log(`📊 Found ${jobs.length} contractor jobs\n`);

        let fixedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const job of jobs) {
            for (const application of job.applications) {
                // Check if application is accepted but has no chatId
                if (application.status === 'Accepted' && !application.chatId) {
                    console.log(`\n🔍 Found accepted application without chat:`);
                    console.log(`   Job ID: ${job._id}`);
                    console.log(`   Application ID: ${application._id}`);
                    console.log(`   Labour: ${application.labour?.user?.firstName} ${application.labour?.user?.lastName}`);
                    console.log(`   Contractor: ${job.user?.firstName} ${job.user?.lastName}`);

                    try {
                        // Validate data
                        if (!job.user) {
                            console.log('   ❌ Contractor user not found, skipping...');
                            skippedCount++;
                            continue;
                        }

                        if (!application.labour || !application.labour.user) {
                            console.log('   ❌ Labour user not found, skipping...');
                            skippedCount++;
                            continue;
                        }

                        // Prepare chat data
                        const chatData = {
                            participant1: {
                                userId: job.user._id,
                                userType: 'Contractor',
                                name: `${job.user.firstName} ${job.user.lastName}`,
                                profilePhoto: job.user.profilePhoto || '',
                                mobileNumber: job.user.mobileNumber
                            },
                            participant2: {
                                userId: application.labour.user._id,
                                userType: 'Labour',
                                name: `${application.labour.user.firstName} ${application.labour.user.lastName}`,
                                profilePhoto: application.labour.user.profilePhoto || '',
                                mobileNumber: application.labour.user.mobileNumber
                            },
                            relatedRequest: {
                                requestId: application._id,
                                requestType: 'ContractorJobApplication'
                            }
                        };

                        // Create or find existing chat
                        const chat = await createChatFromRequest(chatData);

                        // Link chat to application
                        application.chatId = chat._id;
                        await job.save();

                        console.log(`   ✅ Chat created/linked: ${chat._id}`);
                        fixedCount++;

                    } catch (error) {
                        console.log(`   ❌ Error creating chat: ${error.message}`);
                        errorCount++;
                    }
                }
            }
        }

        console.log('\n\n📊 Summary:');
        console.log(`   ✅ Fixed: ${fixedCount} applications`);
        console.log(`   ⏭️  Skipped: ${skippedCount} applications`);
        console.log(`   ❌ Errors: ${errorCount} applications`);
        console.log('\n✅ Script completed!\n');

        process.exit(0);

    } catch (error) {
        console.error('❌ Script failed:', error);
        process.exit(1);
    }
};

// Run the script
fixMissingChats();
