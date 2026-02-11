import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, Calendar, Clock } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';

const ContractorRequest = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Load requests from localStorage and sort by newest first
        const savedRequests = JSON.parse(localStorage.getItem('labour_contractor_requests') || '[]');
        const sortedRequests = savedRequests.sort((a, b) => b.id - a.id);
        setRequests(sortedRequests);
    }, []);

    const handleAccept = (requestId) => {
        // Find the request
        const request = requests.find(r => r.id === requestId);
        
        if (request) {
            // Add to history
            const history = JSON.parse(localStorage.getItem('labour_contractor_history') || '[]');
            history.push({ ...request, status: 'accepted', acceptedAt: new Date().toISOString() });
            localStorage.setItem('labour_contractor_history', JSON.stringify(history));

            // Update hired workers state in contractor panel
            const hiredState = JSON.parse(localStorage.getItem('contractor_hired_workers_state') || '{}');
            hiredState[request.labourId] = 'approved';
            localStorage.setItem('contractor_hired_workers_state', JSON.stringify(hiredState));

            // Remove from current requests
            const filteredRequests = requests.filter(req => req.id !== requestId);
            setRequests(filteredRequests);
            localStorage.setItem('labour_contractor_requests', JSON.stringify(filteredRequests));
        }
    };

    const handleDecline = (requestId) => {
        // Find the request
        const request = requests.find(r => r.id === requestId);
        
        if (request) {
            // Add to history with declined status
            const history = JSON.parse(localStorage.getItem('labour_contractor_history') || '[]');
            history.push({ ...request, status: 'declined', declinedAt: new Date().toISOString() });
            localStorage.setItem('labour_contractor_history', JSON.stringify(history));

            // Update hired workers state in contractor panel
            const hiredState = JSON.parse(localStorage.getItem('contractor_hired_workers_state') || '{}');
            hiredState[request.labourId] = 'declined';
            localStorage.setItem('contractor_hired_workers_state', JSON.stringify(hiredState));

            // Remove request from current requests
            const filteredRequests = requests.filter(req => req.id !== requestId);
            setRequests(filteredRequests);
            localStorage.setItem('labour_contractor_requests', JSON.stringify(filteredRequests));
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Contractor Requests</h1>
                <span className="ml-auto bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-full text-sm">
                    {requests.length}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-500 text-center">No contractor requests yet</p>
                        <p className="text-gray-400 text-sm text-center mt-2">
                            Requests from contractors will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div key={request.id} className="bg-white rounded-xl shadow-md p-4">
                                {/* Contractor Info Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {request.contractorName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{request.contractorName}</h3>
                                        <p className="text-sm text-gray-600">Requested for: {request.labourSkill}</p>
                                    </div>
                                </div>

                                {/* Request Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">{request.contractorLocation}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">{request.contractorPhone || 'Phone not available'}</span>
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

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default ContractorRequest;
