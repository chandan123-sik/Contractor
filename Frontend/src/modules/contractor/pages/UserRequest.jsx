import { useState, useEffect } from 'react';
import { MapPin, Phone, Calendar, Clock } from 'lucide-react';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorHeader from '../components/ContractorHeader';
import RequestPageTitle from '../components/RequestPageTitle';

const UserRequest = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Load requests from localStorage and sort by newest first
        const savedRequests = JSON.parse(localStorage.getItem('contractor_user_requests') || '[]');
        const sortedRequests = savedRequests.sort((a, b) => b.id - a.id);
        setRequests(sortedRequests);
    }, []);

    const handleAccept = (requestId) => {
        // Find the request
        const request = requests.find(r => r.id === requestId);
        
        if (request) {
            // Add to history
            const history = JSON.parse(localStorage.getItem('contractor_request_history') || '[]');
            history.push({ ...request, status: 'accepted', acceptedAt: new Date().toISOString() });
            localStorage.setItem('contractor_request_history', JSON.stringify(history));

            // Update hired contractors state in user panel
            const hiredState = JSON.parse(localStorage.getItem('hired_contractors_state') || '{}');
            hiredState[request.contractorId] = 'approved';
            localStorage.setItem('hired_contractors_state', JSON.stringify(hiredState));

            // Remove from current requests
            const filteredRequests = requests.filter(req => req.id !== requestId);
            setRequests(filteredRequests);
            localStorage.setItem('contractor_user_requests', JSON.stringify(filteredRequests));
        }
    };

    const handleDecline = (requestId) => {
        // Find the request
        const request = requests.find(r => r.id === requestId);
        
        if (request) {
            // Add to history with declined status
            const history = JSON.parse(localStorage.getItem('contractor_request_history') || '[]');
            history.push({ ...request, status: 'declined', declinedAt: new Date().toISOString() });
            localStorage.setItem('contractor_request_history', JSON.stringify(history));

            // Update hired contractors state in user panel
            const hiredState = JSON.parse(localStorage.getItem('hired_contractors_state') || '{}');
            hiredState[request.contractorId] = 'declined';
            localStorage.setItem('hired_contractors_state', JSON.stringify(hiredState));

            // Remove request from current requests
            const filteredRequests = requests.filter(req => req.id !== requestId);
            setRequests(filteredRequests);
            localStorage.setItem('contractor_user_requests', JSON.stringify(filteredRequests));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ContractorHeader />

            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <RequestPageTitle title="User Requests" />
                    <span className="bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
                        {requests.length}
                    </span>
                </div>

                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-500 text-center">No user requests yet</p>
                        <p className="text-gray-400 text-sm text-center mt-2">
                            Requests from users will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div key={request.id} className="bg-white rounded-xl shadow-md p-4">
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
                                </div>

                                {/* Request Details */}
                                <div className="space-y-2 mb-4">
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

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAccept(request.id)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all active:scale-95"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecline(request.id)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all active:scale-95"
                                    >
                                        Decline
                                    </button>
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

export default UserRequest;
