import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ContractorJob from './modules/contractor/models/ContractorJob.model.js';
import Labour from './modules/labour/models/Labour.model.js';
import User from './modules/user/models/User.model.js';
import Contractor from './modules/contractor/models/Contractor.model.js';

dotenv.config();

const testLabourContractorRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected\n');

        // Find all labours with contractor job applications
        const allLabours = await Labour.find({}).populate('user');
        console.log('========================================');
        console.log('CHECKING ALL LABOURS FOR CONTRACTOR JOB APPLICATIONS');
        console.log('========================================\n');

        let laboursWithApplications = [];

        for (const labour of allLabours) {
            const contractorJobs = await ContractorJob.find({
                'applications.labour': labour._id
            })
            .populate('contractor', 'businessName mobileNumber city')
            .sort({ createdAt: -1 });

            if (contractorJobs.length > 0) {
                laboursWithApplications.push({
                    labour,
                    jobs: contractorJobs
                });

                console.log(`👤 Labour: ${labour.user?.firstName || 'N/A'} ${labour.user?.lastName || 'N/A'}`);
                console.log(`   ID: ${labour._id}`);
                console.log(`   User ID: ${labour.user?._id}`);
                console.log(`   Mobile: ${labour.user?.mobileNumber}`);
                console.log(`   Skill: ${labour.skillType}`);
                console.log(`   📨 Contractor Job Applications: ${contractorJobs.length}`);
                
                contractorJobs.forEach((job, idx) => {
                    const application = job.applications.find(
                        app => app.labour.toString() === labour._id.toString()
                    );
                    console.log(`   ${idx + 1}. ${job.jobTitle} - ${job.contractor?.businessName || 'N/A'} - ${application.status} (${new Date(application.appliedAt).toLocaleDateString()})`);
                });
                console.log('');
            }
        }

        console.log('========================================');
        console.log('SUMMARY');
        console.log('========================================');
        console.log(`Total Labours: ${allLabours.length}`);
        console.log(`Labours with Contractor Applications: ${laboursWithApplications.length}`);
        console.log(`Total Applications: ${laboursWithApplications.reduce((sum, l) => sum + l.jobs.length, 0)}`);

        // Test API simulation for first labour with applications
        if (laboursWithApplications.length > 0) {
            const testLabour = laboursWithApplications[0].labour;
            console.log('\n========================================');
            console.log('SIMULATING ADMIN API CALL');
            console.log('========================================\n');
            
            console.log('✅ Testing with labour:');
            console.log(`   ID: ${testLabour._id}`);
            console.log(`   Name: ${testLabour.user?.firstName || 'N/A'} ${testLabour.user?.lastName || 'N/A'}`);
            console.log(`   Mobile: ${testLabour.user?.mobileNumber}`);
            console.log(`   Skill: ${testLabour.skillType}\n`);

            console.log('📡 Simulating API: GET /api/admin/labours/:id/contractor-requests');
            console.log(`   Labour ID: ${testLabour._id}\n`);

            const contractorJobs = await ContractorJob.find({
                'applications.labour': testLabour._id
            })
            .populate('contractor', 'businessName mobileNumber city')
            .sort({ createdAt: -1 });

            const requests = contractorJobs.map(job => {
                const application = job.applications.find(
                    app => app.labour.toString() === testLabour._id.toString()
                );
                
                return {
                    _id: application._id,
                    jobId: job._id,
                    jobTitle: job.jobTitle,
                    jobDescription: job.jobDescription,
                    contractorName: job.contractor?.businessName || 'N/A',
                    contractorPhone: job.contractor?.mobileNumber || 'N/A',
                    contractorCity: job.contractor?.city || 'N/A',
                    labourSkill: job.labourSkill,
                    status: application.status,
                    appliedAt: application.appliedAt,
                    respondedAt: application.respondedAt,
                    message: application.message || '',
                    createdAt: job.createdAt,
                    updatedAt: job.updatedAt
                };
            });

            console.log('✅ Query Result:');
            console.log(`   Total Applications: ${requests.length}\n`);

            console.log('📋 Applications Details:\n');
            requests.forEach((req, idx) => {
                console.log(`${idx + 1}. Application ID: ${req._id}`);
                console.log(`   Job: ${req.jobTitle}`);
                console.log(`   Contractor: ${req.contractorName}`);
                console.log(`   Phone: ${req.contractorPhone}`);
                console.log(`   City: ${req.contractorCity}`);
                console.log(`   Skill: ${req.labourSkill}`);
                console.log(`   Status: ${req.status}`);
                console.log(`   Applied: ${req.appliedAt}\n`);
            });

            console.log('========================================');
            console.log('API RESPONSE SIMULATION');
            console.log('========================================\n');

            const apiResponse = {
                success: true,
                data: {
                    requests: requests,
                    total: requests.length
                }
            };

            console.log(JSON.stringify(apiResponse, null, 2));
        } else {
            console.log('\n⚠️  No labours found with contractor job applications');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await mongoose.connection.close();
    }
};

testLabourContractorRequests();
