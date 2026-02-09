import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorHeader from '../components/ContractorHeader';
import ContractorJobCard from '../components/ContractorJobCard';

const FindUser = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Load jobs from localStorage (user created jobs)
    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem('user_jobs') || '[]');
        console.log('All saved jobs:', savedJobs);
        // Show all jobs to contractors (both Open and Closed for now)
        setJobs(savedJobs);
    }, []);

    const handleViewDetails = (job) => {
        setSelectedJob(job);
    };

    const handleApplyNow = (jobId) => {
        // This will be implemented later
        console.log('Apply Now clicked for job:', jobId);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ContractorHeader />

            {/* Search Bar */}
            <div className="bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <button className="p-2 bg-gray-100 rounded-lg">
                        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Jobs</h2>
                
                {jobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">No jobs available at the moment</p>
                    </div>
                ) : (
                    jobs.map(job => (
                        <ContractorJobCard
                            key={job.id}
                            job={job}
                            onViewDetails={handleViewDetails}
                            onApplyNow={handleApplyNow}
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
                                <p className="text-green-600 font-medium">{selectedJob.status}</p>
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

            <ContractorBottomNav />
        </div>
    );
};

export default FindUser;
