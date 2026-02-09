import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import UserBottomNav from '../components/UserBottomNav';
import UserHeader from '../components/UserHeader';
import UserContractorCard from '../components/UserContractorCard';

const FindContractor = () => {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Load contractor cards from localStorage
    useEffect(() => {
        const savedCards = JSON.parse(localStorage.getItem('contractor_cards') || '[]');
        console.log('Loaded contractor cards:', savedCards); // Debug
        // Show all contractors (both Active and Closed)
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Contractors</h2>
                
                {cards.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">No contractors available at the moment</p>
                    </div>
                ) : (
                    cards.map(card => (
                        <UserContractorCard
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
                                <p className="text-green-600 font-medium">
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
            <UserBottomNav />
        </div>
    );
};

export default FindContractor;
