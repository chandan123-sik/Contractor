import { MapPin, Phone, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const ContractorRequestCard = ({ request, onAccept, onDecline, index = 0, showButtons = true, showStatus = false }) => {
    return (
        <div className="premium-card card-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            {/* Header with Contractor Info */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xl font-bold text-white">
                        {request.contractorName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{request.contractorName}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                    </div>
                </div>
                {/* Status Badge for History */}
                {showStatus && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        request.status === 'accepted' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                    }`}>
                        {request.status === 'accepted' ? (
                            <>
                                <CheckCircle className="w-3 h-3" />
                                <span>Accepted</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-3 h-3" />
                                <span>Declined</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Contact Information */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{request.phoneNumber}</span>
                </div>
                
                {/* Date and Time */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
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

            {/* Job Title */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Applied for</p>
                <p className="text-sm font-semibold text-gray-900">{request.jobTitle}</p>
            </div>

            {/* Action Buttons - Only show if showButtons is true */}
            {showButtons && (
                <div className="flex gap-3">
                    <button
                        onClick={() => onDecline(request.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition-all duration-200 ease-out hover:shadow-lg active:scale-95"
                    >
                        Decline
                    </button>
                    <button
                        onClick={() => onAccept(request.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition-all duration-200 ease-out hover:shadow-lg active:scale-95"
                    >
                        Accept
                    </button>
                </div>
            )}
        </div>
    );
};

export default ContractorRequestCard;
