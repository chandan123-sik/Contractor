import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Crown, Bell } from 'lucide-react';

const ContractorHeader = () => {
    const navigate = useNavigate();
    const [contractorName, setContractorName] = useState('');

    useEffect(() => {
        // Function to update contractor name from localStorage
        const updateContractorName = () => {
            try {
                const profile = JSON.parse(localStorage.getItem('contractor_profile') || '{}');
                if (profile.firstName) {
                    setContractorName(profile.firstName);
                } else {
                    setContractorName('');
                }
            } catch (error) {
                console.error('Error reading contractor profile:', error);
                setContractorName('');
            }
        };

        // Initial load
        updateContractorName();

        // Listen for storage changes
        window.addEventListener('storage', updateContractorName);
        
        // Listen for custom profile update event
        window.addEventListener('profileUpdated', updateContractorName);

        // Cleanup
        return () => {
            window.removeEventListener('storage', updateContractorName);
            window.removeEventListener('profileUpdated', updateContractorName);
        };
    }, []);

    const handleNotifications = () => {
        navigate('/contractor/notifications');
    };

    const handleSubscription = () => {
        navigate('/contractor/subscription');
    };

    return (
        <div className="bg-white p-4 sticky top-0 z-50 border-b border-gray-100 min-h-[88px]">
            <div className="flex justify-between items-center h-14">
                {/* Left Side - Profile Icon and Welcome Text */}
                <div className="flex items-center gap-3">
                    {/* Profile Icon */}
                    <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">👤</span>
                    </div>
                    {/* Welcome Text and Name */}
                    <div className="min-w-[100px]">
                        <p className="text-sm text-gray-500 leading-tight">Hey, Welcome 👋</p>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight truncate max-w-[150px] min-h-[28px]">
                            {contractorName || '\u00A0'}
                        </h1>
                    </div>
                </div>

                {/* Right Side - Bell Icon & Subscription Icon */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                        onClick={handleNotifications}
                        className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full transition-colors active:scale-95 relative"
                    >
                        <Bell className="w-6 h-6 text-white" />
                        {/* Notification Badge */}
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                            0
                        </span>
                    </button>

                    <button
                        onClick={handleSubscription}
                        className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full transition-colors active:scale-95"
                    >
                        <Crown className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractorHeader;
