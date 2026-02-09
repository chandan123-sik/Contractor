import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import UserBottomNav from '../components/UserBottomNav';
import UserHeader from '../components/UserHeader';

const HireWorkers = () => {
    const [labourCards, setLabourCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const savedCards = JSON.parse(localStorage.getItem('labour_cards') || '[]');
        setLabourCards(savedCards);
    }, []);

    const handleViewDetails = (card) => {
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <UserHeader />

            {/* Search Bar */}
            <div className="bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <button className="p-2 bg-gray-100 rounded-lg">
                        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Workers</h2>
                
                {labourCards.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">No workers available at the moment</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {labourCards.map(card => (
                            <div key={card.id} className="bg-white rounded-lg shadow-sm p-4">
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {card.fullName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
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
                                        className="flex-1 bg-white border-2 border-blue-500 text-blue-500 font-medium py-2 rounded-lg"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="flex-1 bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg"
                                    >
                                        Hire Worker
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedCard && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Worker Details</h2>
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

            {/* Bottom Navigation */}
            <UserBottomNav />
        </div>
    );
};

export default HireWorkers;
