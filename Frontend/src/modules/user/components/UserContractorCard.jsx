import { MapPin, Briefcase, Phone, Calendar, IndianRupee } from 'lucide-react';

const UserContractorCard = ({ card, onViewDetails, onApplyNow, index = 0 }) => {
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
                    card.profileStatus === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                }`}>
                    {card.profileStatus === 'Active' ? 'Open' : 'Closed'}
                </span>
            </div>

            {/* Primary Work */}
            <div className="mb-3">
                <p className="text-sm text-gray-500">Primary Work:</p>
                <p className="text-lg font-bold text-gray-900">{card.labourSkill}</p>
            </div>

            {/* Experience and Work Duration */}
            <div className="flex gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>Exp: {card.experience}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{card.workDuration}</span>
                </div>
            </div>

            {/* Budget and Phone */}
            <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-yellow-600 font-medium">
                    <IndianRupee className="w-4 h-4" />
                    <span>
                        {card.budgetType === 'Negotiable' 
                            ? 'Negotiable' 
                            : `₹${card.budgetAmount}`}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{card.phoneNumber}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => onViewDetails(card)}
                    className="btn-secondary flex-1"
                >
                    View Details
                </button>
                <button
                    onClick={() => onApplyNow(card.id)}
                    className="btn-primary flex-1"
                >
                    Hire Contractor
                </button>
            </div>
        </div>
    );
};

export default UserContractorCard;
