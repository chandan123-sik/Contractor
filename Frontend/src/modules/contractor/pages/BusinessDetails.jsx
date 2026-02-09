import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ContractorPageHeader from '../components/ContractorPageHeader';
import BusinessDetailForm from '../components/BusinessDetailForm';
import BusinessAddressForm from '../components/BusinessAddressForm';

const BusinessDetails = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        businessType: 'Proprietorship',
        businessName: '',
        city: '',
        state: '',
        addressLine1: '',
        landmark: ''
    });

    useEffect(() => {
        // Load existing business details from localStorage
        const contractorProfile = JSON.parse(localStorage.getItem('contractor_profile') || '{}');
        if (contractorProfile.businessDetails) {
            setFormData(contractorProfile.businessDetails);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.businessName.trim()) {
            toast.error('Please enter business name');
            return false;
        }
        if (!formData.addressLine1.trim()) {
            toast.error('Please enter address line 1');
            return false;
        }
        return true;
    };

    const handleSaveBusinessDetails = () => {
        if (!validateForm()) return;

        const contractorProfile = JSON.parse(localStorage.getItem('contractor_profile') || '{}');
        const updatedProfile = {
            ...contractorProfile,
            businessDetails: formData
        };
        localStorage.setItem('contractor_profile', JSON.stringify(updatedProfile));

        toast.success('Business details updated successfully');
        
        // Check if coming from settings or onboarding
        const isFromSettings = contractorProfile.businessDetails !== undefined;
        if (isFromSettings) {
            navigate('/contractor/settings');
        } else {
            navigate('/contractor/hire-workers');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            <ContractorPageHeader title="Business details" sticky />

            <div className="p-4 space-y-6">
                <BusinessDetailForm formData={formData} onChange={handleChange} />
                <BusinessAddressForm formData={formData} onChange={handleChange} />

                <button
                    onClick={handleSaveBusinessDetails}
                    className="w-full py-4 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg transition-all shadow-md active:scale-[0.98]"
                >
                    Save business details
                </button>
            </div>
        </div>
    );
};

export default BusinessDetails;
