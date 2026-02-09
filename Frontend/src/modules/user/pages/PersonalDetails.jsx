import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextarea from '../components/FormTextarea';

const PersonalDetails = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        state: '',
        city: '',
        address: '',
        profileImage: null
    });

    useEffect(() => {
        const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        
        setFormData({
            firstName: userProfile.firstName || '',
            middleName: userProfile.middleName || '',
            lastName: userProfile.lastName || '',
            gender: userProfile.gender || '',
            state: userProfile.state || '',
            city: userProfile.city || '',
            address: userProfile.address || '',
            profileImage: userProfile.profileImage || null
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (imageData) => {
        setFormData(prev => ({ ...prev, profileImage: imageData }));
    };

    const handleSaveChanges = () => {
        const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        const updatedProfile = {
            ...userProfile,
            ...formData
        };
        localStorage.setItem('user_profile', JSON.stringify(updatedProfile));

        toast.success('Personal details updated successfully');
        navigate('/user/settings');
    };

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            <PageHeader title="Personal details" backPath="/user/settings" sticky />

            <div className="p-4">
                <ProfilePhotoUpload 
                    profileImage={formData.profileImage}
                    onImageChange={handleImageChange}
                />

                <h2 className="text-lg font-bold text-gray-900 mb-4">Enter personal detail</h2>

                <FormInput
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                />

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Middle name
                        </label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            placeholder="Enter middle name"
                            className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Last name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                    </div>
                </div>

                <FormSelect
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={genderOptions}
                />

                <FormInput
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                />

                <FormInput
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                />

                <FormTextarea
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    rows={3}
                />

                <button
                    onClick={handleSaveChanges}
                    className="w-full py-4 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg transition-all shadow-md active:scale-[0.98]"
                >
                    Save changes
                </button>
            </div>
        </div>
    );
};

export default PersonalDetails;
