/**
 * Script to fix missing chats for accepted User job applications
 * Run this once to link chats to existing accepted applications
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './modules/user/models/Job.model.js';
import User from './modules/user/models/User.model.js';
import Labour from './modules/labour/models/Labour.model.js';
import Contractor from './modules/contractor/models/Contractor.model.js';
import { createChatFromRequest } from './controllers/chat.controller.js';

dotenv.config();

const fixUserJobChats = async () => {
    try {
        console.log('🔧 Starting to fix missing chats for User job applications...\n');

        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all jobs with accepted applications without chatId
        const jobs = await Job.find({ isActive: true })
            .populate('user', 'firstName lastName mobileNumber profilePhoto');

        console.log(`📊 Found ${jobs.length} jobs\n`);

        let fixedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const job of jobs) {
            for (const application of job.applications) {
                // Check if application is accepted but has no chatId
                if (application.status === 'Accepted' && !application.chatId) {
                    console.log(`\n🔍 Found accepted application without chat:`);
                    console.log(`   Job ID: ${job._id}`);
                    console.log(`   Job Title: ${job.jobTitle}`);
                    console.log(`   Application ID: ${application._id}`);
                    console.log(`   Applicant Type: ${application.applicantType}`);
                    console.log(`   Applicant Name: ${application.applicantName}`);

                    try {
                        // Validate job user
                        if (!job.user) {
                            console.log('   ❌ Job user not found, skipping...');
                            skippedCount++;
                            continue;
                        }

                        // Get applicant user based on type
                        let applicantUser = null;

                        if (application.applicantType === 'Labour') {
                            // application.applicant contains User ID, not Labour ID
                            const labour = await Labour.findOne({ user: application.applicant }).populate('user');
                            if (labour && labour.user) {
                                applicantUser = labour.user;
                            } else {
                                // Fallback: try to get User directly
                                applicantUser = await User.findById(application.applicant);
                            }
                        } else if (application.applicantType === 'Contractor') {
                            // application.applicant contains User ID, not Contractor ID
                            const contractor = await Contractor.findOne({ user: application.applicant }).populate('user');
                            if (contractor && contractor.user) {
                                applicantUser = contractor.user;
                            } else {
                                // Fallback: try to get User directly
                                applicantUser = await User.findById(application.applicant);
                            }
                        }

                        if (!applicantUser) {
                            console.log('   ❌ Applicant user not found, skipping...');
                            skippedCount++;
                            continue;
                        }

                        // Prepare chat data
                        const chatData = {
                            participant1: {
                                userId: job.user._id,
                                userType: 'User',
                                name: `${job.user.firstName} ${job.user.lastName}`,
                                profilePhoto: job.user.profilePhoto || '',
                                mobileNumber: job.user.mobileNumber
                            },
                            participant2: {
                                userId: applicantUser._id,
                                userType: application.applicantType,
                                name: `${applicantUser.firstName} ${applicantUser.lastName}`,
                                profilePhoto: applicantUser.profilePhoto || '',
                                mobileNumber: applicantUser.mobileNumber
                            },
                            relatedRequest: {
                                requestId: application._id,
                                requestType: 'JobApplication'
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
fixUserJobChats();
