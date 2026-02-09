import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContractorPageHeader from '../components/ContractorPageHeader';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        contractorName: '',
        phoneNumber: '',
        city: '',
        address: '',
        businessType: '',
        businessName: '',
        labourSkill: '',
        experience: '',
        workDuration: '',
        budgetType: 'Fixed Amount',
        budgetAmount: '',
        rating: 0,
        profileStatus: 'Active'
    });

    // Auto-fill contractor information
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('contractor_profile') || '{}');
        console.log('Contractor Profile:', profile); // Debug
        setFormData(prev => ({
            ...prev,
            contractorName: profile.firstName || profile.name || 'Contractor',
            phoneNumber: profile.phoneNumber || profile.mobile || profile.phone || '',
            city: profile.city || '',
            address: profile.address || ''
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.city || !formData.address || !formData.businessType || !formData.labourSkill || !formData.experience) {
            alert('Please fill all required fields');
            return;
        }

        if (!formData.workDuration) {
            alert('Please fill work information fields');
            return;
        }

        if (formData.budgetType === 'Fixed Amount' && !formData.budgetAmount) {
            alert('Please enter budget amount');
            return;
        }

        // Create contractor card
        const newCard = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        const existingCards = JSON.parse(localStorage.getItem('contractor_cards') || '[]');
        existingCards.push(newCard);
        localStorage.setItem('contractor_cards', JSON.stringify(existingCards));

        // Navigate to My Projects
        navigate('/contractor/my-projects');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ContractorPageHeader title="Create Contractor Card" backPath="/contractor/hire-workers" />
            
            <div className="p-4 pb-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contractor Information */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contractor Information</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contractor Name *
                            </label>
                            <input
                                type="text"
                                name="contractorName"
                                value={formData.contractorName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="Company or Individual Name"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="Enter phone number"
                                maxLength={10}
                                pattern="[0-9]{10}"
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
                                placeholder="Enter full address"
                                rows={3}
                                required
                            />
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Type *
                            </label>
                            <select
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                required
                            >
                                <option value="">Select Business Type</option>
                                <option value="Individual Contractor">Individual Contractor</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>

                        {formData.businessType === 'Business' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    placeholder="Enter business name"
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Labour Skill *
                            </label>
                            <select
                                name="labourSkill"
                                value={formData.labourSkill}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                required
                            >
                                <option value="">Select Skill</option>
                                <option value="Construction">Construction</option>
                                <option value="Interior">Interior</option>
                                <option value="Painting">Painting</option>
                                <option value="Plumbing">Plumbing</option>
                                <option value="Electrical">Electrical</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience Required (Years) *
                            </label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                placeholder="e.g., 3 Years, 10+ Years"
                                required
                            />
                        </div>
                    </div>

                    {/* Work Information */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Work Duration / Type *
                            </label>
                            <select
                                name="workDuration"
                                value={formData.workDuration}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                required
                            >
                                <option value="">Select Duration</option>
                                <option value="One Day">One Day</option>
                                <option value="Multiple Days">Multiple Days</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Budget Type *
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="budgetType"
                                        value="Fixed Amount"
                                        checked={formData.budgetType === 'Fixed Amount'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Fixed Amount</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="budgetType"
                                        value="Negotiable"
                                        checked={formData.budgetType === 'Negotiable'}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Negotiable</span>
                                </label>
                            </div>
                        </div>

                        {formData.budgetType === 'Fixed Amount' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Budget Amount (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="budgetAmount"
                                    value={formData.budgetAmount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                        )}
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
        </div>
    );
};

export default PostJob;
