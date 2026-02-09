import { MapPin, Briefcase, Phone, Calendar, IndianRupee } from 'lucide-react';

const ContractorProfileCard = ({ card, onViewDetails, onToggleStatus }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            {/* Header with Contractor Info and Status Badge */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
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
                    className="flex-1 bg-white border-2 border-blue-500 text-blue-500 font-medium py-2 rounded-lg hover:bg-blue-50 transition-all"
                >
                    View Details
                </button>
                {card.profileStatus === 'Active' ? (
                    <button
                        onClick={() => onToggleStatus(card.id)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg transition-all active:scale-95"
                    >
                        Close Job
                    </button>
                ) : (
                    <button
                        onClick={() => onToggleStatus(card.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all active:scale-95"
                    >
                        Open Job
                    </button>
                )}
            </div>
        </div>
    );
};

export default ContractorProfileCard;
