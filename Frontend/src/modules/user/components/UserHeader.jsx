import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, Crown, Bell } from 'lucide-react';

const UserHeader = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(() => {
        // Initialize from localStorage immediately to prevent flicker
        const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        return profile.firstName || 'User';
    });

    useEffect(() => {
        // Update if needed
        const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        if (profile.firstName && profile.firstName !== userName) {
            setUserName(profile.firstName);
        }
    }, [userName]);

    const handlePostJob = () => {
        navigate('/user/post-job');
    };

    const handleSubscription = () => {
        navigate('/user/subscription');
    };

    const handleNotifications = () => {
        navigate('/user/notifications');
    };

    return (
        <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center">
                {/* Left Side - Welcome Text */}
                <div>
                    <p className="text-sm text-gray-500">Welcome Back,</p>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Namaste, {userName}
                    </h1>
                </div>

                {/* Right Side - Post Job Button, Bell Icon & Subscription Icon */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePostJob}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                        <span className="text-sm">Post Job</span>
                        <Plus className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleNotifications}
                        className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-full shadow-md transition-all active:scale-95"
                    >
                        <Bell className="w-6 h-6 text-gray-900" />
                    </button>

                    <button
                        onClick={handleSubscription}
                        className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-full shadow-md transition-all active:scale-95"
                    >
                        <Crown className="w-6 h-6 text-gray-900" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserHeader;
