import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';
import toast from 'react-hot-toast';

const CreateLabourCard = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        primarySkill: '',
        rating: 0,
        gender: '',
        mobileNumber: '',
        city: '',
        address: '',
        skills: '',
        experience: '',
        previousWorkLocation: '',
        availability: 'Full Time',
        availabilityStatus: 'Available'
    });

    // Auto-fill from labour profile
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
        setFormData(prev => ({
            ...prev,
            fullName: profile.firstName || '',
            primarySkill: profile.skillType || '',
            rating: profile.rating || 0,
            gender: profile.gender || '',
            mobileNumber: profile.phoneNumber || profile.mobile || '',
            city: profile.city || '',
            address: profile.address || '',
            skills: profile.skillType || '',
            experience: profile.experience || '',
            previousWorkLocation: profile.previousWorkLocation || '',
            availability: profile.availability || 'Full Time'
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRating = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.primarySkill || !formData.gender || !formData.mobileNumber) {
            toast.error('Please fill all required fields');
            return;
        }

        // Create labour card
        const newCard = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        const existingCards = JSON.parse(localStorage.getItem('labour_cards') || '[]');
        existingCards.push(newCard);
        localStorage.setItem('labour_cards', JSON.stringify(existingCards));

        toast.success('Labour card created successfully!');
        navigate('/labour/my-card');
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 shadow-sm flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Create Labour Card</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Header Information</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Skill *
                            </label>
                            <select
                                name="primarySkill"
                                value={formData.primarySkill}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                required
                            >
                                <option value="">Select Skill</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Mason">Mason</option>
                                <option value="Carpenter">Carpenter</option>
                                <option value="Painter">Painter</option>
                                <option value="Welder">Welder</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                Self Rating
                            </label>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRating(star)}
                                        className={`text-3xl ${
                                            star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gender *
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="Enter mobile number"
                                maxLength={10}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="Enter city"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="Enter address (max 2 lines)"
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    {/* Work Information */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skills *
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="e.g., Plumber, Electrician"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience (Years) *
                            </label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="e.g., 5"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Previous Work Location
                            </label>
                            <input
                                type="text"
                                name="previousWorkLocation"
                                value={formData.previousWorkLocation}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="City, Area"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Availability *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, availability: 'Full Time' }))}
                                    className={`py-3 rounded-lg font-semibold text-sm transition-all ${
                                        formData.availability === 'Full Time'
                                            ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-400'
                                            : 'bg-white text-gray-600 border-2 border-gray-200'
                                    }`}
                                >
                                    Full Time
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, availability: 'Part Time' }))}
                                    className={`py-3 rounded-lg font-semibold text-sm transition-all ${
                                        formData.availability === 'Part Time'
                                            ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-400'
                                            : 'bg-white text-gray-600 border-2 border-gray-200'
                                    }`}
                                >
                                    Part Time
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg shadow-md transition-all active:scale-95"
                    >
                        Create Card
                    </button>
                </form>
            </div>
            
            <LabourBottomNav />
        </div>
    );
};

export default CreateLabourCard;
