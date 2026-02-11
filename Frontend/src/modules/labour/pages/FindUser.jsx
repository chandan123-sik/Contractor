import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LabourBottomNav from '../components/LabourBottomNav';
import LabourJobCard from '../components/LabourJobCard';
import LabourHeader from '../components/LabourHeader';

const FindUser = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [appliedJobs, setAppliedJobs] = useState([]);

    const cities = ['Indore', 'Bhopal', 'Dewas', 'Ujjain', 'Jabalpur', 'Gwalior', 'Ratlam'];

    useEffect(() => {
        // Load jobs from localStorage (user created jobs)
        const savedJobs = JSON.parse(localStorage.getItem('user_jobs') || '[]');
        console.log('All saved jobs:', savedJobs);
        setJobs(savedJobs);
        setFilteredJobs(savedJobs);
        
        // Load applied jobs for this labour
        const labourAppliedJobs = JSON.parse(localStorage.getItem('labour_applied_jobs') || '[]');
        setAppliedJobs(labourAppliedJobs);
    }, []);

    // Filter jobs based on selected city and search query
    useEffect(() => {
        let filtered = jobs;

        // Filter by city
        if (selectedCity) {
            filtered = filtered.filter(job => 
                job.city.toLowerCase() === selectedCity.toLowerCase()
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(job =>
                job.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredJobs(filtered);
    }, [selectedCity, searchQuery, jobs]);

    const handleViewDetails = (job) => {
        setSelectedJob(job);
    };

    const handleApplyNow = (jobId) => {
        // Get labour profile data
        const labourProfile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
        
        if (!labourProfile.firstName || !labourProfile.lastName) {
            toast.error('Please complete your profile first', {
                duration: 3000,
                position: 'top-center',
            });
            return;
        }
        
        // Find the job
        const job = jobs.find(j => j.id === jobId);
        if (!job) return;
        
        // Get mobile number - try from profile first, then from localStorage
        const mobileNumber = labourProfile.mobileNumber || localStorage.getItem('mobile_number') || 'Not specified';
        
        // Create unique request ID
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create request object
        const request = {
            id: requestId,
            jobId: jobId,
            jobTitle: job.jobTitle,
            workerName: `${labourProfile.firstName} ${labourProfile.lastName}`,
            location: labourProfile.city || 'Not specified',
            phoneNumber: mobileNumber,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            type: 'worker'
        };
        
        // Save to worker_requests for user to see
        const existingRequests = JSON.parse(localStorage.getItem('worker_requests') || '[]');
        existingRequests.push(request);
        localStorage.setItem('worker_requests', JSON.stringify(existingRequests));
        
        // Track applied jobs for this labour with request ID mapping
        const updatedAppliedJobs = [...appliedJobs, jobId];
        setAppliedJobs(updatedAppliedJobs);
        localStorage.setItem('labour_applied_jobs', JSON.stringify(updatedAppliedJobs));
        
        // Store request ID mapping for this labour
        const requestMapping = JSON.parse(localStorage.getItem('labour_request_mapping') || '{}');
        requestMapping[jobId] = requestId;
        localStorage.setItem('labour_request_mapping', JSON.stringify(requestMapping));
        
        toast.success('Request sent successfully!', {
            duration: 3000,
            position: 'top-center',
        });
        
        console.log('Apply Now clicked for job:', jobId);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const handleOpenFilter = () => {
        setShowFilterModal(true);
    };

    const handleCloseFilter = () => {
        setShowFilterModal(false);
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setShowFilterModal(false);
    };

    const handleClearFilter = () => {
        setSelectedCity('');
        setShowFilterModal(false);
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <LabourHeader />

            {/* Search Bar */}
            <div className="bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <button 
                        onClick={handleOpenFilter}
                        className={`p-2 rounded-lg relative ${selectedCity ? 'bg-blue-500' : 'bg-gray-100'}`}
                    >
                        <SlidersHorizontal className={`w-5 h-5 ${selectedCity ? 'text-white' : 'text-gray-600'}`} />
                        {selectedCity && (
                            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
                        )}
                    </button>
                </div>
                {/* Active Filter Badge */}
                {selectedCity && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-600">Filtered by:</span>
                        <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            <span>{selectedCity}</span>
                            <button onClick={handleClearFilter} className="hover:bg-blue-200 rounded-full p-0.5">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Available Jobs
                    {selectedCity && <span className="text-sm font-normal text-gray-600"> in {selectedCity}</span>}
                    <span className="text-sm font-normal text-gray-600"> ({filteredJobs.length})</span>
                </h2>
                
                {filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">
                            {selectedCity || searchQuery 
                                ? 'No jobs found matching your criteria' 
                                : 'No jobs available at the moment'}
                        </p>
                        {(selectedCity || searchQuery) && (
                            <button
                                onClick={() => {
                                    setSelectedCity('');
                                    setSearchQuery('');
                                }}
                                className="mt-3 text-blue-500 hover:text-blue-600 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    filteredJobs.map((job, index) => (
                        <LabourJobCard
                            key={job.id}
                            job={job}
                            index={index}
                            appliedJobs={appliedJobs}
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

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                    <div className="bg-white rounded-t-3xl w-full max-w-md animate-slide-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Filter by City</h2>
                            <button
                                onClick={handleCloseFilter}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-2">
                                {/* All Cities Option */}
                                <button
                                    onClick={handleClearFilter}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                        !selectedCity 
                                            ? 'bg-blue-500 text-white font-medium' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All Cities
                                </button>

                                {/* City Options */}
                                {cities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleCitySelect(city)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                            selectedCity === city 
                                                ? 'bg-blue-500 text-white font-medium' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t">
                            <button
                                onClick={handleCloseFilter}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-all active:scale-95"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default FindUser;
