import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';

const MyProjects = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    // Load jobs from localStorage
    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem('user_jobs') || '[]');
        setJobs(savedJobs);
    }, []);

    const handleViewDetails = (job) => {
        setSelectedJob(job);
    };

    const handleToggleJobStatus = (jobId) => {
        const updatedJobs = jobs.map(job => 
            job.id === jobId 
                ? { ...job, status: job.status === 'Open' ? 'Closed' : 'Open' } 
                : job
        );
        setJobs(updatedJobs);
        localStorage.setItem('user_jobs', JSON.stringify(updatedJobs));
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const handlePostJob = () => {
        navigate('/user/post-job');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader 
                title="My Projects" 
                backPath="/user/settings"
                rightButton={jobs.length > 0 && (
                    <button
                        onClick={handlePostJob}
                        className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full shadow-md transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 text-gray-900" />
                    </button>
                )}
            />
            
            <div className="p-4 pb-20">
                {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <button
                            onClick={handlePostJob}
                            className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6 hover:bg-yellow-200 transition-all active:scale-95"
                        >
                            <Plus className="w-16 h-16 text-yellow-600" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs posted yet</h3>
                        <p className="text-gray-500 text-center">Post your first job to see it here</p>
                    </div>
                ) : (
                    jobs.map((job, index) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            index={index}
                            onViewDetails={handleViewDetails}
                            onToggleJobStatus={handleToggleJobStatus}
                        />
                    ))
                )}
            </div>

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">User Name</label>
                                <p className="text-gray-900 font-medium">{selectedJob.userName}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">City / Location</label>
                                <p className="text-gray-900 font-medium">{selectedJob.city}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Address</label>
                                <p className="text-gray-900">{selectedJob.address}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                                <p className="text-gray-900 font-medium">{selectedJob.mobileNumber}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Job Title</label>
                                <p className="text-gray-900 font-medium">{selectedJob.jobTitle}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Job Description</label>
                                <p className="text-gray-900">{selectedJob.jobDescription}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Category</label>
                                <p className="text-gray-900 font-medium">{selectedJob.category}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Work Duration</label>
                                <p className="text-gray-900 font-medium">{selectedJob.workDuration}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Budget</label>
                                <p className="text-gray-900 font-medium">
                                    {selectedJob.budgetType === 'Negotiable' 
                                        ? 'Negotiable' 
                                        : `₹${selectedJob.budgetAmount}`}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <p className={`font-medium ${
                                    selectedJob.status === 'Open' 
                                        ? 'text-green-600' 
                                        : 'text-gray-600'
                                }`}>
                                    {selectedJob.status}
                                </p>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4">
                            <button
                                onClick={handleCloseModal}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProjects;
