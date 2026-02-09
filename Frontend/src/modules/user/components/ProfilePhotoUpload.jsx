import { useRef } from 'react';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePhotoUpload = ({ profileImage, onImageChange }) => {
    const fileInputRef = useRef(null);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange(reader.result);
                toast.success('Photo updated successfully');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex justify-center items-center gap-4 mb-6 bg-white p-6 rounded-xl">
            <div className="relative">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-12 h-12 text-gray-500" />
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
                    className="bg-white border border-gray-300 px-6 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Change photo
                </button>
            </div>
        </div>
    );
};

export default ProfilePhotoUpload;
