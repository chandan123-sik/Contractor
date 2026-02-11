import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import UserBottomNav from '../components/UserBottomNav';
import UserHeader from '../components/UserHeader';
import WorkerRequestCard from '../components/WorkerRequestCard';
import { Users } from 'lucide-react';

const WorkersRequest = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Load worker requests from localStorage
        const savedRequests = JSON.parse(localStorage.getItem('worker_requests') || '[]');
        setRequests(savedRequests);
    }, []);

    const handleAccept = (requestId) => {
        // Find the request
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        // Add to history with accepted status
        const historyItem = { ...request, status: 'accepted' };
        const history = JSON.parse(localStorage.getItem('request_history') || '[]');
        history.push(historyItem);
        localStorage.setItem('request_history', JSON.stringify(history));

        // Update job application status
        const jobApplications = JSON.parse(localStorage.getItem('job_applications') || '{}');
        jobApplications[request.jobId] = jobApplications[request.jobId] || {};
        jobApplications[request.jobId][request.id] = 'accepted';
        localStorage.setItem('job_applications', JSON.stringify(jobApplications));

        // Remove from worker_requests
        const updatedRequests = requests.filter(r => r.id !== requestId);
        setRequests(updatedRequests);
        localStorage.setItem('worker_requests', JSON.stringify(updatedRequests));

        toast.success('Worker request accepted!', {
            duration: 3000,
            position: 'top-center',
        });
    };

    const handleDecline = (requestId) => {
        // Find the request
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        // Add to history with declined status
        const historyItem = { ...request, status: 'declined' };
        const history = JSON.parse(localStorage.getItem('request_history') || '[]');
        history.push(historyItem);
        localStorage.setItem('request_history', JSON.stringify(history));

        // Update job application status
        const jobApplications = JSON.parse(localStorage.getItem('job_applications') || '{}');
        jobApplications[request.jobId] = jobApplications[request.jobId] || {};
        jobApplications[request.jobId][request.id] = 'declined';
        localStorage.setItem('job_applications', JSON.stringify(jobApplications));

        // Remove from worker_requests
        const updatedRequests = requests.filter(r => r.id !== requestId);
        setRequests(updatedRequests);
        localStorage.setItem('worker_requests', JSON.stringify(updatedRequests));

        toast.error('Worker request declined', {
            duration: 3000,
            position: 'top-center',
        });
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
                
                {requests.length === 0 ? (
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
