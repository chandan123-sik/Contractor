import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import UserBottomNav from '../components/UserBottomNav';
import UserHeader from '../components/UserHeader';

const HireWorkers = () => {
    const location = useLocation();
    const [labourCards, setLabourCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [hiredWorkers, setHiredWorkers] = useState({});

    const cities = ['Indore', 'Bhopal', 'Dewas', 'Ujjain', 'Jabalpur', 'Gwalior', 'Ratlam'];

    // Dummy cards - reduced to 10
    const dummyCards = [
        // Electrician
        { id: 'e1', fullName: 'Rajesh Kumar', primarySkill: 'Electrician', rating: 4, gender: 'Male', city: 'Indore', mobileNumber: '9876543210', experience: '5', availability: 'Full Time', address: 'Vijay Nagar, Indore', skills: 'Wiring, Panel Installation' },
        { id: 'e2', fullName: 'Amit Sharma', primarySkill: 'Electrician', rating: 5, gender: 'Male', city: 'Bhopal', mobileNumber: '9876543211', experience: '7', availability: 'Part Time', address: 'MP Nagar, Bhopal', skills: 'Electrical Repairs, Maintenance' },
        
        // Plumber
        { id: 'p1', fullName: 'Rahul Verma', primarySkill: 'Plumber', rating: 4, gender: 'Male', city: 'Indore', mobileNumber: '9876543213', experience: '6', availability: 'Full Time', address: 'Palasia, Indore', skills: 'Pipe Fitting, Leak Repair' },
        { id: 'p2', fullName: 'Mohan Singh', primarySkill: 'Plumber', rating: 5, gender: 'Male', city: 'Dewas', mobileNumber: '9876543214', experience: '8', availability: 'Full Time', address: 'Civil Lines, Dewas', skills: 'Bathroom Fitting, Water Tank' },
        
        // Carpenter
        { id: 'c1', fullName: 'Ramesh Yadav', primarySkill: 'Carpenter', rating: 5, gender: 'Male', city: 'Indore', mobileNumber: '9876543216', experience: '10', availability: 'Full Time', address: 'Rau, Indore', skills: 'Furniture Making, Door Fitting' },
        { id: 'c2', fullName: 'Dinesh Kumar', primarySkill: 'Carpenter', rating: 4, gender: 'Male', city: 'Jabalpur', mobileNumber: '9876543217', experience: '6', availability: 'Full Time', address: 'Napier Town, Jabalpur', skills: 'Wood Work, Cabinet Making' },
        
        // Painter
        { id: 'pa1', fullName: 'Anil Mishra', primarySkill: 'Painter', rating: 5, gender: 'Male', city: 'Indore', mobileNumber: '9876543219', experience: '7', availability: 'Full Time', address: 'Bhawarkua, Indore', skills: 'Wall Painting, Texture Work' },
        { id: 'pa2', fullName: 'Sanjay Tiwari', primarySkill: 'Painter', rating: 4, gender: 'Male', city: 'Bhopal', mobileNumber: '9876543220', experience: '5', availability: 'Full Time', address: 'Kolar Road, Bhopal', skills: 'Interior Painting, Exterior Work' },
        
        // Mason
        { id: 'ma1', fullName: 'Kalyan Singh', primarySkill: 'Mason', rating: 5, gender: 'Male', city: 'Indore', mobileNumber: '9876543243', experience: '15', availability: 'Full Time', address: 'Limbodi, Indore', skills: 'Construction, Masonry, Plastering' },
        
        // Cleaner
        { id: 'cl1', fullName: 'Sunita Devi', primarySkill: 'Cleaner', rating: 5, gender: 'Female', city: 'Indore', mobileNumber: '9876543237', experience: '6', availability: 'Full Time', address: 'Rajendra Nagar, Indore', skills: 'House Cleaning, Office Cleaning' }
    ];

    useEffect(() => {
        const savedCards = JSON.parse(localStorage.getItem('labour_cards') || '[]');
        // Combine saved cards with dummy cards
        const allCards = [...savedCards, ...dummyCards];
        setLabourCards(allCards);
        setFilteredCards(allCards);

        // Check if category was passed from home page
        if (location.state?.selectedCategory) {
            setSelectedCategory(location.state.selectedCategory);
        }

        // Load hired workers state
        const hired = JSON.parse(localStorage.getItem('hired_workers_state') || '{}');
        setHiredWorkers(hired);

        // Update user profile with phone number if missing
        const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        const mobileNumber = localStorage.getItem('mobile_number') || '';
        
        if (userProfile && Object.keys(userProfile).length > 0 && !userProfile.phoneNumber && mobileNumber) {
            userProfile.phoneNumber = mobileNumber;
            localStorage.setItem('user_profile', JSON.stringify(userProfile));
            console.log('Updated user profile with phone number:', userProfile);
        }
    }, [location.state]);

    // Filter cards based on selected city, category, and search query
    useEffect(() => {
        let filtered = labourCards;

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(card => 
                card.primarySkill.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

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
    }, [selectedCity, selectedCategory, searchQuery, labourCards]);

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

    const handleHireWorker = (card) => {
        // Get user profile
        const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        const mobileNumber = localStorage.getItem('mobile_number') || '';
        
        // Use phoneNumber from profile, or fallback to mobile_number from localStorage
        const userPhone = userProfile.phoneNumber || mobileNumber || '';
        
        // Create full name from firstName and lastName
        const userFullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'User';
        
        console.log('User Profile:', userProfile); // Debug
        console.log('Mobile Number from localStorage:', mobileNumber); // Debug
        console.log('Final User Phone:', userPhone); // Debug
        console.log('User Full Name:', userFullName); // Debug
        
        // Create request object
        const request = {
            id: Date.now(),
            labourId: card.id,
            labourName: card.fullName,
            labourSkill: card.primarySkill,
            labourPhone: card.mobileNumber,
            labourCity: card.city,
            userName: userFullName,
            userPhone: userPhone,
            userLocation: userProfile.city || 'N/A',
            requestDate: new Date().toLocaleDateString('en-IN'),
            requestTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'pending'
        };

        console.log('Request Object:', request); // Debug

        // Save request to labour panel requests
        const existingRequests = JSON.parse(localStorage.getItem('labour_user_requests') || '[]');
        existingRequests.push(request);
        localStorage.setItem('labour_user_requests', JSON.stringify(existingRequests));

        // Update hired workers state
        const updatedHired = { ...hiredWorkers, [card.id]: 'pending' };
        setHiredWorkers(updatedHired);
        localStorage.setItem('hired_workers_state', JSON.stringify(updatedHired));
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
            </div>

            {/* Main Content Area */}
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Available Workers
                    {selectedCategory && <span className="text-sm font-normal text-gray-600"> - {selectedCategory}</span>}
                    {selectedCity && <span className="text-sm font-normal text-gray-600"> in {selectedCity}</span>}
                    <span className="text-sm font-normal text-gray-600"> ({filteredCards.length})</span>
                </h2>

                {/* Active Filters */}
                {(selectedCategory || selectedCity) && (
                    <div className="mb-4 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-600">Active filters:</span>
                        {selectedCategory && (
                            <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                <span>{selectedCategory}</span>
                                <button onClick={() => setSelectedCategory('')} className="hover:bg-blue-200 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        {selectedCity && (
                            <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                <span>{selectedCity}</span>
                                <button onClick={handleClearFilter} className="hover:bg-blue-200 rounded-full p-0.5">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {filteredCards.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <p className="text-gray-600">
                            {selectedCity || searchQuery || selectedCategory
                                ? 'No workers found matching your criteria' 
                                : 'No workers available at the moment'}
                        </p>
                        {(selectedCity || searchQuery || selectedCategory) && (
                            <button
                                onClick={() => {
                                    setSelectedCity('');
                                    setSearchQuery('');
                                    setSelectedCategory('');
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
                                        onClick={() => handleHireWorker(card)}
                                        disabled={hiredWorkers[card.id]}
                                        className={`flex-1 font-bold py-3 rounded-lg transition-all active:scale-95 ${
                                            hiredWorkers[card.id] === 'approved'
                                                ? 'bg-green-500 text-white cursor-not-allowed'
                                                : hiredWorkers[card.id] === 'declined'
                                                ? 'bg-gray-500 text-white cursor-not-allowed'
                                                : hiredWorkers[card.id] === 'pending'
                                                ? 'bg-red-500 text-white cursor-not-allowed'
                                                : 'btn-primary'
                                        }`}
                                    >
                                        {hiredWorkers[card.id] === 'approved'
                                            ? 'Approved'
                                            : hiredWorkers[card.id] === 'declined'
                                            ? 'Not Approved'
                                            : hiredWorkers[card.id] === 'pending'
                                            ? 'Request Sent'
                                            : 'Hire Worker'}
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

            {/* Bottom Navigation */}
            <UserBottomNav />
        </div>
    );
};

export default HireWorkers;
