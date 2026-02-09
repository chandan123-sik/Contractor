import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Delete, X, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const MobileInput = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleKeyPress = (num) => {
        if (phoneNumber.length < 10) {
            setPhoneNumber(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        setPhoneNumber(prev => prev.slice(0, -1));
    };

    const handleContinue = () => {
        if (phoneNumber.length === 10) {
            navigate('/otp-verify', { state: { phoneNumber } });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
            </div>

            <div className="flex-1 px-6 flex flex-col">
                <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                        Enter your mobile number
                    </h1>
                    <p className="text-gray-500 text-sm">
                        We will send you a confirmation code
                    </p>
                </div>

                {/* Number Display */}
                <div className="flex items-center justify-center my-4">
                    <span className="text-3xl text-gray-400 mr-4">+91</span>
                    <span className="text-3xl text-gray-900 font-semibold tracking-wider min-h-[36px]">
                        {phoneNumber}
                    </span>
                </div>

                <div className="flex-1"></div>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-y-2 mb-6 text-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleKeyPress(num)}
                            className="text-2xl font-medium text-gray-900 py-3 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors"
                        >
                            {num}
                        </button>
                    ))}
                    <div className="col-span-1"></div>
                    <button
                        onClick={() => handleKeyPress(0)}
                        className="text-2xl font-medium text-gray-900 py-3 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors"
                    >
                        0
                    </button>
                    <button
                        onClick={handleBackspace}
                        className="flex items-center justify-center py-3 text-red-500 hover:bg-gray-100 rounded-lg active:bg-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-4">
                    <button
                        onClick={handleContinue}
                        disabled={phoneNumber.length !== 10}
                        className={`w-full py-3.5 rounded-full text-gray-900 font-bold text-base transition-colors
              ${phoneNumber.length === 10 ? 'bg-[#fbbf24] hover:bg-yellow-500 shadow-md' : 'bg-yellow-100 text-gray-400 cursor-not-allowed'}
            `}
                    >
                        Continue
                    </button>
                </div>

                {/* Footer Text */}
                <p className="text-center text-[10px] text-gray-400 mb-6 px-4 leading-tight">
                    By continuing, you agree to our <span className="text-blue-500">terms & conditions</span> and <span className="text-blue-500">privacy policy</span>
                </p>
            </div>
        </div>
    );
};

export default MobileInput;
