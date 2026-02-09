import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import InfoBox from '../../user/components/InfoBox';

const LegalVerificationSection = () => {
    const [aadharNumber, setAadharNumber] = useState('');

    useEffect(() => {
        const contractorProfile = JSON.parse(localStorage.getItem('contractor_profile') || '{}');
        setAadharNumber(contractorProfile.aadharNumber || '');
    }, []);

    return (
        <div className="p-4">
            <InfoBox
                variant="info"
                message="Verified users get more visibility and trust. Your documents are stored securely."
            />

            <div className="mb-6 mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Aadhaar Number (12 Digit)
                </label>
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 font-medium tracking-wide">
                        {aadharNumber || 'Not provided'}
                    </span>
                </div>
            </div>

            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl text-gray-400">+</span>
                    </div>
                    <p className="text-gray-500 font-medium">Upload Document Photos</p>
                </div>
            </div>

            <button
                className="w-full py-4 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg transition-all shadow-md active:scale-[0.98]"
            >
                Submit for Verification
            </button>
        </div>
    );
};

export default LegalVerificationSection;
