import { useState, useEffect } from 'react';
import { MapPin, Phone, Calendar, Clock, X, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorPageHeader from '../components/ContractorPageHeader';
import { contractorAPI } from '../../../services/api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'accepted', 'declined'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();

        // Auto-refresh every 10 seconds
        const interval = setInterval(() => {
            if (!document.hidden) {
                console.log('🔄 Auto-refreshing contractor history...');
                loadHistory();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const loadHistory = async () => {
        try {
            console.log('🔵 Loading contractor application history from database...');
            const response = await contractorAPI.getContractorApplicationHistory();
            
            if (response.success) {
                console.log('✅ History loaded:', response.data.history.length, 'items');
                setHistory(response.data.history);
            }
        } catch (error) {
            console.error('❌ Failed to load history:', error);
            // Fallback to localStorage
            const savedHistory = JSON.parse(localStorage.getItem('contractor_request_history') || '[]');
            const sortedHistory = savedHistory.sort((a, b) => b.id - a.id);
            setHistory(sortedHistory);
        } finally {
            setLoading(false);
        }
    };

    // Get filtered history based on status filter
    const getFilteredHistory = () => {
        if (statusFilter === 'all') {
            return history;
        }
        return history.filter(req => req.status === statusFilter);
    };

    const filteredHistory = getFilteredHistory();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ContractorPageHeader title="Request History" backPath="/contractor/settings" />

            <div className="p-4">
                {/* Header with count */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Worker Applications</h2>
                    <span className="bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
                        {filteredHistory.length}
                    </span>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex gap-2 mb-4">
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

                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-600">Loading history...</p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-center">No history found</p>
                        <p className="text-gray-400 text-sm text-center mt-2">
                            {statusFilter === 'all' 
                                ? 'No worker applications yet'
                                : `No ${statusFilter} worker applications`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredHistory.map((request, index) => (
                            <div 
                                key={request.id} 
                                className={`premium-card card-fade-in border-2 ${
                                    request.status === 'accepted' 
                                        ? 'border-green-500' 
                                        : 'border-red-500'
                                }`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {/* Worker Info Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-2xl font-bold text-white">
                                            {request.workerName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{request.workerName}</h3>
                                        <p className="text-sm text-gray-600">Applied for: {request.jobTitle}</p>
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
                                        <span className="text-sm">{request.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">{request.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{request.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{request.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ContractorBottomNav />
        </div>
    );
};

export default History;
