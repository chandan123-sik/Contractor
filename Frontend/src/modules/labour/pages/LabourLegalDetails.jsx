import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Upload } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';
import toast from 'react-hot-toast';

const LabourLegalDetails = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [aadharNumber, setAadharNumber] = useState('');
    const [documentPhotos, setDocumentPhotos] = useState([]);

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
        if (profile.aadharNumber) {
            setAadharNumber(profile.aadharNumber);
        }
    }, []);

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
                setDocumentPhotos(prev => [...prev, ...photos]);
                toast.success('Document photos added successfully');
            });
        }
    };

    const handleSubmit = () => {
        if (!aadharNumber) {
            toast.error('Aadhaar number not found');
            return;
        }

        if (documentPhotos.length === 0) {
            toast.error('Please upload at least one document photo');
            return;
        }

        toast.success('Submitted for verification successfully!');
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <div className="bg-white px-4 py-4 shadow-sm flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-1">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Legal Verification</h1>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-700 leading-relaxed">
                        Verified users get more visibility and trust. Your documents are stored securely.
                    </p>
                </div>

                {/* Aadhaar Number */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Aadhaar Number (12 Digit)
                    </label>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700 font-medium">
                            {aadharNumber || 'Not provided'}
                        </span>
                    </div>
                </div>

                {/* Upload Document Photos */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Upload Document Photos
                    </label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        multiple
                    />
                    
                    <div className="grid grid-cols-3 gap-3">
                        {documentPhotos.map((photo, index) => (
                            <div key={index} className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                                <img src={photo} alt={`Document ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <button
                            onClick={handlePhotoUpload}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-yellow-400 hover:bg-yellow-50 transition-all"
                        >
                            <Upload className="w-8 h-8 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500 font-medium">Add</span>
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full py-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-base transition-all shadow-md active:scale-[0.98]"
                >
                    Submit for Verification
                </button>
            </div>
            
            <LabourBottomNav />
        </div>
    );
};

export default LabourLegalDetails;
