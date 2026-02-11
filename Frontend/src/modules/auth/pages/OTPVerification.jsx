import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const phoneNumber = location.state?.phoneNumber || '5000000033'; // Default fallback
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(59);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleKeyPress = (num) => {
        if (otp.length < 4) {
            setOtp(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        setOtp(prev => prev.slice(0, -1));
    };

    const handleEnter = async () => {
        if (otp.length === 4) {
            try {
                // Call login API
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        mobileNumber: phoneNumber
                    })
                });

                const data = await response.json();

                if (data.success) {
                    // Store tokens
                    localStorage.setItem('access_token', data.data.accessToken);
                    localStorage.setItem('refresh_token', data.data.refreshToken);
                    localStorage.setItem('mobile_number', phoneNumber);
                    localStorage.setItem('user_id', data.data.user._id);
                    localStorage.setItem('user_type', data.data.user.userType);

                    console.log('Login successful:', data.data.user);

                    // Always go to complete profile page after OTP verification
                    // User will fill their details and choose user type there
                    navigate('/complete-profile');
                } else {
                    console.error('Login failed:', data.message);
                    navigate('/complete-profile');
                }
            } catch (error) {
                console.error('Login error:', error);
                // Fallback to old flow
                localStorage.setItem('mobile_number', phoneNumber);
                navigate('/complete-profile');
            }
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <span className="ml-2 text-gray-700 font-medium text-sm">Verify mobile number</span>
            </div>

            <div className="flex-1 px-6 flex flex-col">
                <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                        Enter code sent to your number
                    </h1>
                    <p className="text-gray-500 text-sm">
                        We sent it to the number +91 {phoneNumber}
                    </p>
                </div>

                {/* OTP Display */}
                <div className="flex justify-center mb-4">
                    <span className="text-2xl text-gray-400 tracking-[0.5em] font-medium">
                        {otp.padEnd(4, '*').split('').map((char, index) => (
                            <span key={index} className={index < otp.length ? 'text-gray-900' : 'text-gray-300'}>
                                {index < otp.length ? char : '*'}
                            </span>
                        ))}
                    </span>
                </div>

                <div className="flex-1"></div>

                {/* Spacer */}
                <div className="flex-1"></div>


                {/* Keypad */}
                <div className="grid grid-cols-3 gap-y-2 mb-4 text-center">
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

                {/* Timer text */}
                <p className="text-center text-gray-400 text-xs mb-4">
                    Resend code in 00:{timer.toString().padStart(2, '0')}
                </p>

                {/* Enter Button */}
                <div className="mb-6">
                    <button
                        onClick={handleEnter}
                        disabled={otp.length !== 4}
                        className={`w-full py-3.5 rounded-full text-gray-900 font-bold text-base transition-colors
              ${otp.length === 4 ? 'bg-[#fbbf24] hover:bg-yellow-500 shadow-md' : 'bg-yellow-100 text-gray-400 cursor-not-allowed'}
            `}
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
