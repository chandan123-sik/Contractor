import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Crown, Bell } from 'lucide-react';

const UserHeader = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        // Function to update user name from localStorage
        const updateUserName = () => {
            try {
                const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
                if (profile.firstName) {
                    setUserName(profile.firstName);
                } else {
                    setUserName('User');
                }
            } catch (error) {
                console.error('Error reading user profile:', error);
                setUserName('User');
            }
        };

        // Initial load
        updateUserName();

        // Listen for storage changes
        window.addEventListener('storage', updateUserName);

        // Cleanup
        return () => {
            window.removeEventListener('storage', updateUserName);
        };
    }, []);

    const handleSubscription = () => {
        navigate('/user/subscription');
    };

    const handleNotifications = () => {
        navigate('/user/notifications');
    };

    return (
        <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
                {/* Left Side - Profile Icon and Welcome Text */}
                <div className="flex items-center gap-3">
                    {/* Profile Icon */}
                    <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                    </div>
                    {/* Welcome Text and Name */}
                    <div>
                        <p className="text-sm text-gray-500">Hey, Welcome 👋</p>
                        <h1 className="text-xl font-bold text-gray-900">
                            {userName}
                        </h1>
                    </div>
                </div>

                {/* Right Side - Bell Icon & Subscription Icon */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleNotifications}
                        className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full shadow-md transition-all active:scale-95 relative"
                    >
                        <Bell className="w-6 h-6 text-white" />
                        {/* Notification Badge */}
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                            0
                        </span>
                    </button>

                    <button
                        onClick={handleSubscription}
                        className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full shadow-md transition-all active:scale-95"
                    >
                        <Crown className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserHeader;
