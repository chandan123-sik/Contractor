import { MapPin, Briefcase, Calendar, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const LabourJobCard = ({ job, onViewDetails, onApplyNow, appliedJobs = [], index = 0 }) => {
    const [applicationStatus, setApplicationStatus] = useState(null);
    const isApplied = appliedJobs.includes(job.id);
    
    useEffect(() => {
        // Check if this job has been accepted/declined
        const jobApplications = JSON.parse(localStorage.getItem('job_applications') || '{}');
        const labourAppliedJobs = JSON.parse(localStorage.getItem('labour_applied_jobs') || '[]');
        
        if (jobApplications[job.id] && labourAppliedJobs.includes(job.id)) {
            // Get the request ID for this labour's application
            const requestMapping = JSON.parse(localStorage.getItem('labour_request_mapping') || '{}');
            const requestId = requestMapping[job.id];
            
            if (requestId && jobApplications[job.id] && jobApplications[job.id][requestId]) {
                setApplicationStatus(jobApplications[job.id][requestId]);
            }
        }
    }, [job.id]);
    
    const handleApplyClick = () => {
        if (job.status !== 'Open') {
            // Show toast message for closed job
            toast.error('This job is closed, you cannot apply.', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }
        
        if (isApplied) {
            toast.info('You have already applied for this job.', {
                duration: 2000,
                position: 'top-center',
            });
            return;
        }
        
        onApplyNow(job.id);
    };

    return (
        <div className="premium-card card-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            {/* Header with User Info and Status */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-lg font-bold text-gray-900">
                            {job.userName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{job.userName}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{job.city}</span>
                        </div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    job.status === 'Open' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                }`}>
                    {job.status}
                </span>
            </div>

            {/* Job Title */}
            <h2 className="text-lg font-bold text-gray-900 mb-2">{job.jobTitle}</h2>

            {/* Job Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.jobDescription}</p>

            {/* Job Details */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.category}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{job.workDuration}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-600 font-medium">
                    <IndianRupee className="w-4 h-4" />
                    <span>
                        {job.budgetType === 'Negotiable' 
                            ? 'Negotiable' 
                            : `₹${job.budgetAmount}`}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => onViewDetails(job)}
                    className="flex-1 btn-secondary"
                >
                    View Details
                </button>
                <button
                    onClick={handleApplyClick}
                    disabled={job.status !== 'Open' || isApplied}
                    className={`flex-1 font-bold py-2 rounded-lg transition-all duration-200 ease-out ${
                        applicationStatus === 'accepted'
                            ? 'bg-green-500 text-white cursor-default'
                            : applicationStatus === 'declined'
                                ? 'bg-gray-500 text-white cursor-default'
                                : isApplied
                                    ? 'bg-red-500 text-white cursor-default'
                                    : job.status === 'Open' 
                                        ? 'btn-primary' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {applicationStatus === 'accepted' 
                        ? 'Accepted' 
                        : applicationStatus === 'declined'
                            ? 'Not Accepted'
                            : isApplied 
                                ? 'Request Sent' 
                                : 'Apply Now'}
                </button>
            </div>
        </div>
    );
};

export default LabourJobCard;
