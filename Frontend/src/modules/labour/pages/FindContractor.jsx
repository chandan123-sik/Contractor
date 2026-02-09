import { useEffect, useState } from 'react';
import { Bell, Crown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LabourBottomNav from '../components/LabourBottomNav';
import LabourContractorCard from '../components/LabourContractorCard';

const FindContractor = () => {
    const navigate = useNavigate();
    const [labourName, setLabourName] = useState('');
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
        if (profile.firstName) {
            setLabourName(profile.firstName);
        }

        // Load contractor cards from localStorage
        const savedCards = JSON.parse(localStorage.getItem('contractor_cards') || '[]');
        console.log('Loaded contractor cards:', savedCards); // Debug
        setCards(savedCards);
    }, []);

    const handleViewDetails = (card) => {
        setSelectedCard(card);
    };

    const handleApplyNow = (cardId) => {
        // This will be implemented later
        console.log('Apply Now clicked for contractor:', cardId);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    const handleCreateCard = () => {
        navigate('/labour/create-card');
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Welcome Back,</p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Namaste,
                        </h1>
                        <h2 className="text-2xl font-bold text-gray-900">{labourName || 'User'}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCreateCard}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-3 rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95"
                        >
                            <span className="text-sm">Create Card</span>
                            <Plus className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => navigate('/labour/notifications')}
                            className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-full shadow-md transition-all"
                        >
                            <Bell className="w-5 h-5 text-gray-900" />
                        </button>
                        <button 
                            onClick={() => navigate('/labour/subscription')}
                            className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-full shadow-md transition-all"
                        >
                            <Crown className="w-5 h-5 text-gray-900" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Contractors</h2>
                
                {cards.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">No contractors available at the moment</p>
                    </div>
                ) : (
                    cards.map(card => (
                        <LabourContractorCard
                            key={card.id}
                            card={card}
                            onViewDetails={handleViewDetails}
                            onApplyNow={handleApplyNow}
                        />
                    ))
                )}
            </div>

            {/* Contractor Details Modal */}
            {selectedCard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Contractor Details</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Contractor Name</label>
                                <p className="text-gray-900 font-medium">{selectedCard.contractorName}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                <p className="text-gray-900 font-medium">{selectedCard.phoneNumber}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">City</label>
                                <p className="text-gray-900 font-medium">{selectedCard.city}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Address</label>
                                <p className="text-gray-900">{selectedCard.address}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Business Type</label>
                                <p className="text-gray-900 font-medium">{selectedCard.businessType}</p>
                            </div>

                            {selectedCard.businessName && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Business Name</label>
                                    <p className="text-gray-900 font-medium">{selectedCard.businessName}</p>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-500">Labour Skill</label>
                                <p className="text-gray-900 font-medium">{selectedCard.labourSkill}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Experience</label>
                                <p className="text-gray-900 font-medium">{selectedCard.experience}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Work Duration</label>
                                <p className="text-gray-900 font-medium">{selectedCard.workDuration}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Budget</label>
                                <p className="text-gray-900 font-medium">
                                    {selectedCard.budgetType === 'Negotiable' 
                                        ? 'Negotiable' 
                                        : `₹${selectedCard.budgetAmount}`}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Profile Status</label>
                                <p className={`font-medium ${
                                    selectedCard.profileStatus === 'Active' 
                                        ? 'text-green-600' 
                                        : 'text-gray-600'
                                }`}>
                                    {selectedCard.profileStatus === 'Active' ? 'Open' : 'Closed'}
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

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default FindContractor;
