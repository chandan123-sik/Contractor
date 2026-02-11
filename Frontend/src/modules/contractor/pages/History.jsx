import { useState, useEffect } from 'react';
import { MapPin, Phone, Calendar, Clock, X } from 'lucide-react';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorPageHeader from '../components/ContractorPageHeader';

const History = () => {
    const [history, setHistory] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'accepted', 'declined'

    useEffect(() => {
        // Load history from localStorage
        const savedHistory = JSON.parse(localStorage.getItem('contractor_request_history') || '[]');
        // Sort by newest first
        const sortedHistory = savedHistory.sort((a, b) => b.id - a.id);
        setHistory(sortedHistory);
    }, []);

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
                    <h2 className="text-xl font-bold text-gray-900">User Requests</h2>
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

                {filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-500 text-center">No history found</p>
                        <p className="text-gray-400 text-sm text-center mt-2">
                            {statusFilter === 'all' 
                                ? 'No user requests yet'
                                : `No ${statusFilter} user requests`
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
                                {/* User Info Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-2xl font-bold text-white">
                                            {request.userName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{request.userName}</h3>
                                        <p className="text-sm text-gray-600">Requested for: {request.contractorSkill}</p>
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
                                        <span className="text-sm">{request.userLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">{request.userPhone || 'Phone not available'}</span>
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

            <ContractorBottomNav />
        </div>
    );
};

export default History;
