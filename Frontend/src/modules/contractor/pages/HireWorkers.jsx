import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorHeader from '../components/ContractorHeader';

const HireWorkers = () => {
    const [labourCards, setLabourCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');

    const cities = ['Indore', 'Bhopal', 'Dewas', 'Ujjain', 'Jabalpur', 'Gwalior', 'Ratlam'];

    useEffect(() => {
        const savedCards = JSON.parse(localStorage.getItem('labour_cards') || '[]');
        setLabourCards(savedCards);
        setFilteredCards(savedCards);
    }, []);

    // Filter cards based on selected city and search query
    useEffect(() => {
        let filtered = labourCards;

        // Filter by city
        if (selectedCity) {
            filtered = filtered.filter(card => 
                card.city.toLowerCase() === selectedCity.toLowerCase()
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(card =>
                card.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.primarySkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.city.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredCards(filtered);
    }, [selectedCity, searchQuery, labourCards]);

    const handleViewDetails = (card) => {
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    const handleOpenFilter = () => {
        setShowFilterModal(true);
    };

    const handleCloseFilter = () => {
        setShowFilterModal(false);
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setShowFilterModal(false);
    };

    const handleClearFilter = () => {
        setSelectedCity('');
        setShowFilterModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ContractorHeader />

            {/* Search Bar */}
            <div className="bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search workers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <button 
                        onClick={handleOpenFilter}
                        className={`p-2 rounded-lg relative ${selectedCity ? 'bg-blue-500' : 'bg-gray-100'}`}
                    >
                        <SlidersHorizontal className={`w-5 h-5 ${selectedCity ? 'text-white' : 'text-gray-600'}`} />
                        {selectedCity && (
                            <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
                        )}
                    </button>
                </div>
                {/* Active Filter Badge */}
                {selectedCity && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-600">Filtered by:</span>
                        <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                            <span>{selectedCity}</span>
                            <button onClick={handleClearFilter} className="hover:bg-blue-200 rounded-full p-0.5">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Available Workers
                    {selectedCity && <span className="text-sm font-normal text-gray-600"> in {selectedCity}</span>}
                    <span className="text-sm font-normal text-gray-600"> ({filteredCards.length})</span>
                </h2>
                
                {filteredCards.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">
                            {selectedCity || searchQuery 
                                ? 'No workers found matching your criteria' 
                                : 'No workers available at the moment'}
                        </p>
                        {(selectedCity || searchQuery) && (
                            <button
                                onClick={() => {
                                    setSelectedCity('');
                                    setSearchQuery('');
                                }}
                                className="mt-3 text-blue-500 hover:text-blue-600 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCards.map((card, index) => (
                            <div key={card.id} className="premium-card card-fade-in">
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {card.fullName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900">{card.fullName}</h3>
                                        <p className="text-sm text-gray-600">🔧 {card.primarySkill}</p>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className={`text-lg transition-all ${star <= card.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs">Gender</p>
                                        <p className="font-medium text-gray-900">{card.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">City</p>
                                        <p className="font-medium text-gray-900">{card.city}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Mobile</p>
                                        <p className="font-medium text-gray-900">{card.mobileNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Experience</p>
                                        <p className="font-medium text-gray-900">{card.experience} years</p>
                                    </div>
                                </div>

                                {/* Availability Type */}
                                <div className="mb-3">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-all ${
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
                                        className="flex-1 btn-secondary"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="flex-1 btn-primary"
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

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                    <div className="bg-white rounded-t-3xl w-full max-w-md animate-slide-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Filter by City</h2>
                            <button
                                onClick={handleCloseFilter}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-2">
                                {/* All Cities Option */}
                                <button
                                    onClick={handleClearFilter}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                        !selectedCity 
                                            ? 'bg-blue-500 text-white font-medium' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    All Cities
                                </button>

                                {/* City Options */}
                                {cities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleCitySelect(city)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                                            selectedCity === city 
                                                ? 'bg-blue-500 text-white font-medium' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t">
                            <button
                                onClick={handleCloseFilter}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-all active:scale-95"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ContractorBottomNav />
        </div>
    );
};

export default HireWorkers;
