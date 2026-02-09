import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContractorPageHeader from '../components/ContractorPageHeader';
import ContractorProfileCard from '../components/ContractorProfileCard';

const MyProjects = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    // Load contractor cards from localStorage
    useEffect(() => {
        const savedCards = JSON.parse(localStorage.getItem('contractor_cards') || '[]');
        setCards(savedCards);
    }, []);

    const handleViewDetails = (card) => {
        setSelectedCard(card);
    };

    const handleToggleStatus = (cardId) => {
        const updatedCards = cards.map(card => 
            card.id === cardId 
                ? { ...card, profileStatus: card.profileStatus === 'Active' ? 'Closed' : 'Active' } 
                : card
        );
        setCards(updatedCards);
        localStorage.setItem('contractor_cards', JSON.stringify(updatedCards));
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ContractorPageHeader title="My Projects" backPath="/contractor/settings" />
            
            <div className="p-4 pb-20">
                {cards.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">No contractor cards created yet</p>
                    </div>
                ) : (
                    cards.map(card => (
                        <ContractorProfileCard
                            key={card.id}
                            card={card}
                            onViewDetails={handleViewDetails}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))
                )}
            </div>

            {/* Card Details Modal */}
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
        </div>
    );
};

export default MyProjects;
