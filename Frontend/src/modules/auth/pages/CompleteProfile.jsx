import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Camera, User, Hammer, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const CompleteProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dob: '',
        aadharNumber: '',
        city: '',
        state: '',
        address: '',
        userType: 'User', // Default
        profileImage: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result }));
                toast.success('Photo added successfully');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleContinue = () => {
        // Photo validation removed as per request

        if (!formData.firstName.trim()) {
            toast.error('First name is required');
            return;
        }

        localStorage.setItem('user_type', formData.userType);
        if (!formData.lastName.trim()) {
            toast.error('Last name is required');
            return;
        }

        if (!formData.gender) {
            toast.error('Gender is required');
            return;
        }

        if (!formData.dob) {
            toast.error('Date of birth is required');
            return;
        }

        if (formData.userType === 'User') {
            // Get mobile number from localStorage
            const mobileNumber = localStorage.getItem('mobile_number') || '';
            
            // Save to localStorage for persistence with phone number
            const userProfile = { ...formData, phoneNumber: mobileNumber };
            localStorage.setItem('user_profile', JSON.stringify(userProfile));
            console.log('User profile saved:', userProfile);
            navigate('/user/home', { state: { profile: userProfile } });
        } else if (formData.userType === 'Contractor') {
            // Get mobile number from localStorage
            const mobileNumber = localStorage.getItem('mobile_number') || '';
            
            // Save to localStorage for persistence
            const existingProfile = JSON.parse(localStorage.getItem('contractor_profile') || '{}');
            const contractorProfile = { 
                ...existingProfile, 
                ...formData,
                mobileNumber: mobileNumber 
            };
            localStorage.setItem('contractor_profile', JSON.stringify(contractorProfile));
            console.log('Contractor profile saved:', contractorProfile);
            navigate('/contractor/business-details');
        } else if (formData.userType === 'Labour') {
            // Get mobile number from localStorage
            const mobileNumber = localStorage.getItem('mobile_number') || '';
            
            // Save to localStorage for persistence
            const existingProfile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
            const labourProfile = {
                ...existingProfile,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                photo: formData.profileImage,
                gender: formData.gender,
                dob: formData.dob,
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                city: formData.city,
                state: formData.state,
                address: formData.address,
                aadharNumber: formData.aadharNumber,
                mobileNumber: mobileNumber
            };
            localStorage.setItem('labour_profile', JSON.stringify(labourProfile));
            console.log('Labour profile saved:', labourProfile);
            navigate('/labour/details');
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col p-4 overflow-hidden">
            <h1 className="text-lg font-bold text-gray-900 mb-4 text-center">Complete profile</h1>

            {/* Photo Placeholder */}
            <div className="flex justify-center items-center gap-4 mb-4">
                <div className="relative">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        {formData.profileImage ? (
                            <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-8 h-8 text-gray-500" />
                        )}
                    </div>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <button
                        onClick={handlePhotoClick}
                        className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        {formData.profileImage ? 'Change photo' : 'Add photo'}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {/* Name Fields */}
                <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">First name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Ex: John"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Middle name</label>
                        <input
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            placeholder="Ex: Kumar"
                            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Last name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Ex: Doe"
                            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all ${formData.gender ? 'text-gray-700' : 'text-gray-400'}`}
                        >
                            <option value="" disabled hidden>Select Gender</option>
                            <option value="Male" className="text-gray-700">Male</option>
                            <option value="Female" className="text-gray-700">Female</option>
                            <option value="Other" className="text-gray-700">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Date of birth <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className={`w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all ${formData.dob ? 'text-gray-700' : 'text-gray-400'}`}
                        />
                    </div>
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Enter state"
                            className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        rows="2"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>

                {/* Aadhar Card Number */}
                <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Aadhar Card Number</label>
                    <input
                        type="text"
                        name="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={handleChange}
                        placeholder="Ex: 1234 5678 9012"
                        maxLength="12"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* User Type Selection */}
                <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm mb-2">
                    <label className="block text-xs font-bold text-gray-900 mb-2">User Type <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                        <div
                            onClick={() => setFormData(prev => ({ ...prev, userType: 'User' }))}
                            className={`flex items-center p-2 rounded-lg border transition-all cursor-pointer ${formData.userType === 'User' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-50 hover:bg-gray-50'}`}
                        >
                            <User className="w-4 h-4 mr-2 text-gray-600" />
                            <span className="text-xs font-medium">User</span>
                        </div>

                        <div
                            onClick={() => setFormData(prev => ({ ...prev, userType: 'Labour' }))}
                            className={`flex items-center p-2 rounded-lg border transition-all cursor-pointer ${formData.userType === 'Labour' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-50 hover:bg-gray-50'}`}
                        >
                            <Hammer className="w-4 h-4 mr-2 text-yellow-600" />
                            <span className="text-xs font-medium">Labour</span>
                        </div>

                        <div
                            onClick={() => setFormData(prev => ({ ...prev, userType: 'Contractor' }))}
                            className={`flex items-center p-2 rounded-lg border transition-all cursor-pointer ${formData.userType === 'Contractor' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-50 hover:bg-gray-50'}`}
                        >
                            <Briefcase className="w-4 h-4 mr-2 text-gray-600" />
                            <span className="text-xs font-medium">Contractor</span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleContinue}
                className="w-full py-3.5 rounded-full bg-[#fbbf24] hover:bg-yellow-500 text-gray-900 font-bold text-base transition-all shadow-md active:scale-[0.98] mt-4"
            >
                Continue
            </button>
        </div>
    );
};

export default CompleteProfile;
