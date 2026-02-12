import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Upload, Star, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const LabourDetails = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        skillType: '',
        experience: '',
        workPhotos: [],
        previousWorkLocation: '',
        rating: 0,
        availability: 'Full Time'
    });

    const skillTypes = [
        'Mason / Mistri',
        'Helper / General Labour',
        'Carpenter',
        'Painter',
        'Plumber',
        'Electrician',
        'Tile Fitter',
        'Marble / Granite Worker',
        'Shuttering Carpenter',
        'Steel Fixer (Saria)',
        'POP / False Ceiling Worker',
        'Furniture Fitter',
        'Welder',
        'Fabricator',
        'AC Technician',
        'Refrigerator Technician',
        'Washing Machine Technician',
        'CCTV Technician',
        'Solar Panel Installer',
        'Waterproofing Worker',
        'Road Construction Worker',
        'Loader / Unloader',
        'Housekeeping / Cleaning Staff',
        'Security Guard',
        'Gardener / Landscaper'
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSkillDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillSelect = (skill) => {
        setFormData(prev => ({ ...prev, skillType: skill }));
        setIsSkillDropdownOpen(false);
    };

    const handlePhotoUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newPhotos = files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newPhotos).then(photos => {
                setFormData(prev => ({
                    ...prev,
                    workPhotos: [...prev.workPhotos, ...photos]
                }));
                toast.success('Photos added successfully');
            });
        }
    };

    const handleRating = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleContinue = async () => {
        if (!formData.skillType) {
            toast.error('Please select a skill type');
            return;
        }

        try {
            // Get user profile from localStorage
            const userProfile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
            const mobileNumber = localStorage.getItem('mobile_number');
            
            if (!mobileNumber) {
                toast.error('Mobile number not found. Please login again.');
                navigate('/auth/mobile');
                return;
            }

            // Prepare labour data for backend
            const labourData = {
                mobileNumber,
                firstName: userProfile.firstName || '',
                lastName: userProfile.lastName || '',
                gender: userProfile.gender || '',
                city: userProfile.city || '',
                state: userProfile.state || '',
                skillType: formData.skillType,
                experience: formData.experience || '',
                workPhotos: formData.workPhotos || [],
                previousWorkLocation: formData.previousWorkLocation || ''
            };

            // Save to backend
            const response = await fetch('http://localhost:5000/api/labour/create-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(labourData)
            });

            const data = await response.json();

            if (data.success) {
                // Save to localStorage for offline access
                const existingProfile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
                localStorage.setItem('labour_profile', JSON.stringify({
                    ...existingProfile,
                    ...formData
                }));

                // Dispatch event to update header
                window.dispatchEvent(new Event('profileUpdated'));

                toast.success('Profile completed successfully!');
                navigate('/labour/find-user');
            } else {
                toast.error(data.message || 'Failed to save profile');
            }
        } catch (error) {
            console.error('Error saving labour profile:', error);
            toast.error('Failed to save profile. Please try again.');
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col p-4 overflow-hidden">
            <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">Labour Details</h1>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {/* Skill Type - Custom Dropdown */}
                <div className="mb-4" ref={dropdownRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Skill Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsSkillDropdownOpen(!isSkillDropdownOpen)}
                            className={`w-full bg-white border-2 rounded-xl p-3 text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition-all flex items-center justify-between ${formData.skillType ? 'text-gray-700 border-yellow-400' : 'text-gray-400 border-gray-200'
                                }`}
                        >
                            <span>{formData.skillType || 'Select Skill Type'}</span>
                            <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isSkillDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSkillDropdownOpen && (
                            <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                                {skillTypes.map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => handleSkillSelect(skill)}
                                        className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 ${formData.skillType === skill ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-900'
                                            }`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Experience */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Experience (Years)
                    </label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g. 5"
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* Previous Work Photos */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Previous Work Photos
                    </label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        multiple
                    />
                    <div
                        onClick={handlePhotoUpload}
                        className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-all"
                    >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 font-medium">Add</span>
                    </div>
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-start gap-2">
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">TIP</span>
                        <span className="text-xs text-gray-600">Upload best photos of your past work</span>
                    </div>
                </div>

                {/* Previous Work Location */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Previous Work Location
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="previousWorkLocation"
                            value={formData.previousWorkLocation}
                            onChange={handleChange}
                            placeholder="City, Area"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Self Rating */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-2 text-center">
                        Self Rating
                    </label>
                    <div className="flex justify-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                onClick={() => handleRating(star)}
                                className={`w-10 h-10 cursor-pointer transition-all ${star <= formData.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-500">Tap stars to rate yourself</p>
                </div>

                {/* Availability */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Availability
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, availability: 'Full Time' }))}
                            className={`py-3 rounded-xl font-semibold text-sm transition-all ${formData.availability === 'Full Time'
                                ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-400'
                                : 'bg-white text-gray-600 border-2 border-gray-200'
                                }`}
                        >
                            Full Time
                        </button>
                        <button
                            onClick={() => setFormData(prev => ({ ...prev, availability: 'Part Time' }))}
                            className={`py-3 rounded-xl font-semibold text-sm transition-all ${formData.availability === 'Part Time'
                                ? 'bg-yellow-400 text-gray-900 border-2 border-yellow-400'
                                : 'bg-white text-gray-600 border-2 border-gray-200'
                                }`}
                        >
                            Part Time
                        </button>
                    </div>
                </div>
            </div>

            {/* Continue Button */}
            <button
                onClick={handleContinue}
                className="w-full py-3.5 rounded-full bg-[#fbbf24] hover:bg-yellow-500 text-gray-900 font-bold text-base transition-all shadow-md active:scale-[0.98] mt-4"
            >
                Continue
            </button>
        </div>
    );
};

export default LabourDetails;
