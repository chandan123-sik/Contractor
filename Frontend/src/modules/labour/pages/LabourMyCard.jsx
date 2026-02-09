import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';

const LabourMyCard = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const savedCards = JSON.parse(localStorage.getItem('labour_cards') || '[]');
        setCards(savedCards);
    }, []);

    const handleToggleAvailability = (cardId) => {
        const updatedCards = cards.map(card => 
            card.id === cardId 
                ? { ...card, availabilityStatus: card.availabilityStatus === 'Available' ? 'Unavailable' : 'Available' } 
                : card
        );
        setCards(updatedCards);
        localStorage.setItem('labour_cards', JSON.stringify(updatedCards));
    };

    const handleViewDetails = (card) => {
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/labour/settings')} className="p-1">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">My Card</h1>
                </div>
                {cards.length > 0 && (
                    <button
                        onClick={() => navigate('/labour/create-card')}
                        className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full shadow-md transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5 text-gray-900" />
                    </button>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <button
                            onClick={() => navigate('/labour/create-card')}
                            className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-6 hover:bg-yellow-200 transition-all active:scale-95"
                        >
                            <Plus className="w-16 h-16 text-yellow-600" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No labour cards created yet</h3>
                        <p className="text-gray-500 text-center">Create your first card to see it here</p>
                    </div>
                ) : (
                    cards.map((card, index) => (
                        <div key={card.id} className="premium-card card-fade-in relative" style={{ animationDelay: `${index * 0.05}s` }}>
                            {/* Status Badge - Top Right Corner */}
                            <div className="absolute top-4 right-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    card.availabilityStatus === 'Available' 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-gray-400 text-white'
                                }`}>
                                    {card.availabilityStatus}
                                </span>
                            </div>

                            {/* Header */}
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {card.fullName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 pr-20">
                                    <h3 className="font-bold text-lg text-gray-900">{card.fullName}</h3>
                                    <p className="text-sm text-gray-600">🔧 {card.primarySkill}</p>
                                    <div className="flex gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className={`text-lg ${star <= card.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                <div>
                                    <p className="text-gray-500">Gender</p>
                                    <p className="font-medium">{card.gender}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">City</p>
                                    <p className="font-medium">{card.city}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Mobile</p>
                                    <p className="font-medium">{card.mobileNumber}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Experience</p>
                                    <p className="font-medium">{card.experience} years</p>
                                </div>
                            </div>

                            {/* Availability Type */}
                            <div className="mb-3">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    card.availability === 'Full Time' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {card.availability}
                                </span>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleViewDetails(card)}
                                    className="btn-secondary flex-1"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleToggleAvailability(card.id)}
                                    className={`flex-1 font-bold py-2 rounded-lg transition-all duration-200 ease-out hover:shadow-lg active:scale-95 ${
                                        card.availabilityStatus === 'Available'
                                            ? 'bg-gray-400 text-white hover:bg-gray-500'
                                            : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                                    }`}
                                >
                                    {card.availabilityStatus === 'Available' ? 'Unavailable' : 'Available'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Details Modal */}
            {selectedCard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Labour Details</h2>
                            <button onClick={handleCloseModal} className="text-2xl">×</button>
                        </div>
                        
                        <div className="p-4 space-y-3">
                            <div><label className="text-sm text-gray-500">Full Name</label><p className="font-medium">{selectedCard.fullName}</p></div>
                            <div><label className="text-sm text-gray-500">Primary Skill</label><p className="font-medium">{selectedCard.primarySkill}</p></div>
                            <div><label className="text-sm text-gray-500">Rating</label><p className="font-medium">{selectedCard.rating} ⭐</p></div>
                            <div><label className="text-sm text-gray-500">Gender</label><p className="font-medium">{selectedCard.gender}</p></div>
                            <div><label className="text-sm text-gray-500">Mobile</label><p className="font-medium">{selectedCard.mobileNumber}</p></div>
                            <div><label className="text-sm text-gray-500">City</label><p className="font-medium">{selectedCard.city}</p></div>
                            <div><label className="text-sm text-gray-500">Address</label><p className="font-medium">{selectedCard.address}</p></div>
                            <div><label className="text-sm text-gray-500">Skills</label><p className="font-medium">{selectedCard.skills}</p></div>
                            <div><label className="text-sm text-gray-500">Experience</label><p className="font-medium">{selectedCard.experience} years</p></div>
                            <div><label className="text-sm text-gray-500">Previous Work Location</label><p className="font-medium">{selectedCard.previousWorkLocation || 'N/A'}</p></div>
                            <div><label className="text-sm text-gray-500">Availability</label><p className="font-medium">{selectedCard.availability}</p></div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4">
                            <button onClick={handleCloseModal} className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <LabourBottomNav />
        </div>
    );
};

export default LabourMyCard;
