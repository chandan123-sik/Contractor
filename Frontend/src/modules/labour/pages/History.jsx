import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, Calendar, Clock } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';

const History = () => {
    const navigate = useNavigate();
    const [userHistory, setUserHistory] = useState([]);
    const [contractorHistory, setContractorHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('user'); // 'user' or 'contractor'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'accepted', 'declined'

    useEffect(() => {
        // Load both user and contractor history from localStorage
        const userHist = JSON.parse(localStorage.getItem('labour_request_history') || '[]');
        const contractorHist = JSON.parse(localStorage.getItem('labour_contractor_history') || '[]');
        
        // Sort by newest first
        setUserHistory(userHist.sort((a, b) => b.id - a.id));
        setContractorHistory(contractorHist.sort((a, b) => b.id - a.id));
    }, []);

    // Get filtered history based on active tab and status filter
    const getFilteredHistory = () => {
        const currentHistory = activeTab === 'user' ? userHistory : contractorHistory;
        
        if (statusFilter === 'all') {
            return currentHistory;
        }
        
        return currentHistory.filter(req => req.status === statusFilter);
    };

    const filteredHistory = getFilteredHistory();

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-1">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Request History</h1>
                    <span className="ml-auto bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
                        {filteredHistory.length}
                    </span>
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => setActiveTab('user')}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                            activeTab === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        User Requests ({userHistory.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('contractor')}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                            activeTab === 'contractor'
                                ? 'bg-yellow-500 text-gray-900'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Contractor Requests ({contractorHistory.length})
                    </button>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            statusFilter === 'all'
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('accepted')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            statusFilter === 'accepted'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Accepted
                    </button>
                    <button
                        onClick={() => setStatusFilter('declined')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            statusFilter === 'declined'
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Declined
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-500 text-center">No history found</p>
                        <p className="text-gray-400 text-sm text-center mt-2">
                            {statusFilter === 'all' 
                                ? `No ${activeTab} requests yet`
                                : `No ${statusFilter} ${activeTab} requests`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((request) => (
                            <div 
                                key={request.id} 
                                className={`bg-white rounded-xl shadow-md p-4 border-2 ${
                                    request.status === 'accepted' 
                                        ? 'border-green-500' 
                                        : 'border-red-500'
                                }`}
                            >
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br rounded-full flex items-center justify-center shadow-md ${
                                        activeTab === 'user' 
                                            ? 'from-blue-400 to-blue-500' 
                                            : 'from-yellow-400 to-yellow-500'
                                    }`}>
                                        <span className={`text-2xl font-bold ${
                                            activeTab === 'user' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {activeTab === 'user'
                                                ? request.userName.charAt(0).toUpperCase()
                                                : request.contractorName.charAt(0).toUpperCase()
                                            }
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">
                                            {activeTab === 'user' ? request.userName : request.contractorName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Requested for: {request.labourSkill}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        request.status === 'accepted'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {request.status === 'accepted' ? 'Accepted' : 'Declined'}
                                    </span>
                                </div>

                                {/* Request Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">
                                            {activeTab === 'user' ? request.userLocation : request.contractorLocation}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">
                                            {activeTab === 'user' 
                                                ? (request.userPhone || 'Phone not available')
                                                : (request.contractorPhone || 'Phone not available')
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{request.requestDate}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{request.requestTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default History;
