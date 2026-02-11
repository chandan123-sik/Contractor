import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import ContractorPageHeader from '../components/ContractorPageHeader';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorProfileCard from '../components/ContractorProfileCard';

const MyProjectForUser = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [cards, setCards] = useState([]);
    const [rating, setRating] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [formData, setFormData] = useState({
        contractorName: '',
        businessType: 'Individual',
        city: '',
        primaryWorkCategory: '',
        experience: '',
        contactNo: '',
        budgetAmount: ''
    });

    const workCategories = [
        'Construction',
        'Interior',
        'Painting',
        'Plumbing',
        'Electrical',
        'Carpentry',
        'Masonry',
        'Waterproofing',
        'Fabrication',
        'Renovation'
    ];

    useEffect(() => {
        // Load contractor cards FOR USER from localStorage
        const savedCards = JSON.parse(localStorage.getItem('contractor_cards_for_user') || '[]');
        setCards(savedCards);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRating = (star) => {
        setRating(star);
    };

    const handleCreateCard = () => {
        // Validation
        if (!formData.contractorName.trim()) {
            toast.error('Contractor name is required');
            return;
        }
        if (!formData.city.trim()) {
            toast.error('City/Location is required');
            return;
        }
        if (!formData.primaryWorkCategory) {
            toast.error('Primary work category is required');
            return;
        }
        if (!formData.experience.trim()) {
            toast.error('Experience is required');
            return;
        }
        if (!formData.contactNo.trim()) {
            toast.error('Contact number is required');
            return;
        }
        if (!formData.budgetAmount.trim()) {
            toast.error('Budget amount is required');
            return;
        }

        // Create new card
        const newCard = {
            ...formData,
            rating: rating,
            availabilityStatus: 'Available', // Default status
            id: Date.now(), // Unique ID
            createdAt: new Date().toISOString()
        };

        // Add to cards array
        const updatedCards = [...cards, newCard];
        setCards(updatedCards);
        localStorage.setItem('contractor_cards_for_user', JSON.stringify(updatedCards));
        
        // Reset form
        setFormData({
            contractorName: '',
            businessType: 'Individual',
            city: '',
            primaryWorkCategory: '',
            experience: '',
            contactNo: '',
            budgetAmount: ''
        });
        setRating(0);
        setShowForm(false);
        toast.success('Contractor card created successfully!');
    };

    const handleViewDetails = (card) => {
        setSelectedCard(card);
        setShowDetailsModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedCard(null);
    };

    const handleToggleAvailability = (cardId) => {
        const updatedCards = cards.map(card => {
            if (card.id === cardId) {
                const newStatus = card.availabilityStatus === 'Available' ? 'Busy' : 'Available';
                console.log(`🔄 Toggling card ${cardId} from ${card.availabilityStatus} to ${newStatus}`); // Debug
                return {
                    ...card,
                    availabilityStatus: newStatus
                };
            }
            return card;
        });
        
        setCards(updatedCards);
        localStorage.setItem('contractor_cards_for_user', JSON.stringify(updatedCards));
        console.log('💾 Saved updated cards to localStorage:', updatedCards); // Debug
        
        // Trigger a custom event to notify other tabs/windows
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ContractorPageHeader title="My Project for User" backPath="/contractor/settings" />

            <div className="p-4">
                {!showForm && cards.length === 0 ? (
                    // Empty State with + Icon
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-24 h-24 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
                        >
                            <Plus className="w-12 h-12 text-gray-900" />
                        </button>
                    </div>
                ) : showForm ? (
                    // Form View
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Create Contractor Card</h3>

                        {/* Basic Information */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="text-blue-500">ℹ️</span>
                                Basic Information
                            </h4>
                            <p className="text-xs text-gray-500 mb-3">(User will only view this)</p>

                            {/* Contractor Name */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contractor Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="contractorName"
                                    value={formData.contractorName}
                                    onChange={handleChange}
                                    placeholder="Individual name or Company name"
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Business Type */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Business Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none"
                                >
                                    <option value="Individual">Individual</option>
                                    <option value="Company">Company</option>
                                    <option value="Firm">Firm</option>
                                </select>
                            </div>

                            {/* City/Location */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    City / Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city or location"
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Work & Skills Info */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <span className="text-green-500">🛠️</span>
                                Work & Skills Info
                            </h4>
                            <p className="text-xs text-gray-500 mb-3">(User will understand what work contractor does)</p>

                            {/* Primary Work Category */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Primary Work Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="primaryWorkCategory"
                                    value={formData.primaryWorkCategory}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {workCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Experience */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Experience <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="Example: 5+ Years"
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Rating */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                                    Rating
                                </label>
                                <div className="flex justify-center gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${
                                                    star <= rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'fill-gray-200 text-gray-200'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-gray-600">
                                    {rating > 0 ? `${rating}.0 / 5` : 'Tap stars to rate'}
                                </p>
                            </div>

                            {/* Contact Number */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact No <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                    maxLength="10"
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Budget Amount */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Budget Amount (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="budgetAmount"
                                    value={formData.budgetAmount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Create Button */}
                        <button
                            onClick={handleCreateCard}
                            className="w-full py-4 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg transition-all shadow-md active:scale-[0.98]"
                        >
                            Create
                        </button>
                    </div>
                ) : (
                    // Cards List View
                    <div>
                        {/* Floating + Button */}
                        <button
                            onClick={() => setShowForm(true)}
                            className="fixed bottom-24 right-6 w-14 h-14 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 z-10"
                        >
                            <Plus className="w-7 h-7 text-gray-900" />
                        </button>

                        {/* Cards Grid */}
                        {cards.map((card) => (
                            <ContractorProfileCard 
                                key={card.id}
                                data={card} 
                                onViewDetails={() => handleViewDetails(card)}
                                onToggleAvailability={handleToggleAvailability}
                            />
                        ))}
                    </div>
                )}

                {/* Details Modal */}
                {showDetailsModal && selectedCard && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Contractor Details</h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Plus className="w-6 h-6 text-gray-600 rotate-45" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-4 space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Contractor Name</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedCard.contractorName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Business Type</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedCard.businessType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">City / Location</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedCard.city}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Primary Work Category</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedCard.primaryWorkCategory}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Experience</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedCard.experience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Availability Status</p>
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                                        selectedCard.availabilityStatus === 'Available'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {selectedCard.availabilityStatus}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Rating</p>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-base font-semibold text-gray-900">{selectedCard.rating || 0}.0 / 5</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                                    <p className="text-base font-semibold text-gray-900">{selectedCard.contactNo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ContractorBottomNav />
        </div>
    );
};

export default MyProjectForUser;
