import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import UserBottomNav from '../components/UserBottomNav';
import UserHeader from '../components/UserHeader';
import WorkerRequestCard from '../components/WorkerRequestCard';
import { Users } from 'lucide-react';
import { jobAPI } from '../../../services/api';

const WorkersRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            // Get all user's jobs
            const jobsResponse = await jobAPI.getUserJobs();
            
            if (jobsResponse.success && jobsResponse.data.jobs) {
                // Collect all applications from all jobs
                const allApplications = [];
                
                for (const job of jobsResponse.data.jobs) {
                    if (job.applications && job.applications.length > 0) {
                        // Transform applications to match component expectations
                        job.applications.forEach(app => {
                            allApplications.push({
                                id: app._id,
                                jobId: job._id,
                                jobTitle: job.jobTitle,
                                workerName: app.applicantName,
                                location: app.location,
                                phoneNumber: app.phoneNumber,
                                date: new Date(app.appliedAt).toLocaleDateString('en-IN', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    year: 'numeric' 
                                }),
                                time: new Date(app.appliedAt).toLocaleTimeString('en-IN', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                }),
                                type: app.applicantType.toLowerCase(),
                                status: app.status
                            });
                        });
                    }
                }
                
                // Filter only pending applications
                const pendingApplications = allApplications.filter(app => app.status === 'Pending');
                setRequests(pendingApplications);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            toast.error('Failed to load applications', {
                duration: 3000,
                position: 'top-center',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        try {
            const response = await jobAPI.updateApplicationStatus(request.jobId, requestId, 'Accepted');
            
            if (response.success) {
                // Remove from pending requests
                const updatedRequests = requests.filter(r => r.id !== requestId);
                setRequests(updatedRequests);
                
                toast.success('Application accepted!', {
                    duration: 3000,
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Failed to accept application:', error);
            toast.error('Failed to accept application', {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    const handleDecline = async (requestId) => {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        try {
            const response = await jobAPI.updateApplicationStatus(request.jobId, requestId, 'Rejected');
            
            if (response.success) {
                // Remove from pending requests
                const updatedRequests = requests.filter(r => r.id !== requestId);
                setRequests(updatedRequests);
                
                toast.error('Application rejected', {
                    duration: 3000,
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error('Failed to reject application:', error);
            toast.error('Failed to reject application', {
                duration: 3000,
                position: 'top-center',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <UserHeader />

            {/* Main Content Area */}
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Worker Requests
                    <span className="text-sm font-normal text-gray-600 ml-2">({requests.length})</span>
                </h2>
                
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-600">Loading applications...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium mb-1">No Worker Requests</p>
                        <p className="text-sm text-gray-500">Requests from workers will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request, index) => (
                            <WorkerRequestCard
                                key={request.id}
                                request={request}
                                index={index}
                                onAccept={handleAccept}
                                onDecline={handleDecline}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <UserBottomNav />
        </div>
    );
};

export default WorkersRequest;
