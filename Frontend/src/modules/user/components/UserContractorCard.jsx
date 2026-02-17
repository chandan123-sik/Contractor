import { MapPin, Star, Phone, IndianRupee } from 'lucide-react';

const UserContractorCard = ({ card, onViewDetails, onApplyNow, index = 0, hiredStatus }) => {
    return (
        <div className="premium-card card-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            {/* Header with Contractor Info and Status Badge */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-2xl font-bold text-gray-900">
                            {card.contractorName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">{card.contractorName}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{card.city}</span>
                        </div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    card.availabilityStatus === 'Available' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                }`}>
                    {card.availabilityStatus === 'Available' ? 'Open' : 'Closed'}
                </span>
            </div>

            {/* Primary Work Category */}
            <div className="mb-3">
                <p className="text-sm text-gray-500">Primary Work:</p>
                <p className="text-lg font-bold text-gray-900">{card.primaryWorkCategory}</p>
            </div>

            {/* Experience and Business Type */}
            <div className="flex gap-4 mb-3 flex-wrap text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <span className="font-medium">Exp:</span>
                    <span>{card.experience}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-medium">📅</span>
                    <span>{card.businessType}</span>
                </div>
            </div>

            {/* Rating and Budget */}
            <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">{card.rating || 0}.0/5</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-yellow-600 font-medium">
                    <IndianRupee className="w-4 h-4" />
                    <span>₹{card.budgetAmount}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{card.contactNo}</span>
                </div>
            </div>

            {/* Action Buttons */}
            {hiredStatus === 'approved' ? (
                <div className="space-y-2">
                    <button
                        onClick={() => onViewDetails(card)}
                        className="w-full btn-secondary py-2.5"
                    >
                        View Details
                    </button>
                    <div className="flex gap-2">
                        <button
                            disabled
                            className="flex-1 bg-green-500 text-white cursor-default shadow-md font-semibold py-2 rounded-lg text-sm"
                        >
                            ✓ Approved
                        </button>
                        <button
                            onClick={() => alert('Chat feature coming soon!')}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all active:scale-95 text-sm"
                        >
                            💬 Chat
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-3">
                    <button
                        onClick={() => onViewDetails(card)}
                        className="btn-secondary flex-1 py-2.5"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onApplyNow(card.id)}
                        disabled={hiredStatus}
                        className={`flex-1 font-bold py-2.5 rounded-lg transition-all active:scale-95 ${
                            hiredStatus === 'declined'
                                ? 'bg-gray-500 text-white cursor-not-allowed'
                                : hiredStatus === 'pending'
                                ? 'bg-red-500 text-white cursor-not-allowed'
                                : 'btn-primary'
                        }`}
                    >
                        {hiredStatus === 'declined'
                            ? 'Not Approved'
                            : hiredStatus === 'pending'
                            ? 'Request Sent'
                            : 'Hire Contractor'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserContractorCard;
