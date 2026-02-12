import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Crown, Bell } from 'lucide-react';
import logo from '../../../assets/Majdoor Sathi.png';

const LabourHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [labourName, setLabourName] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        // Function to update labour name from localStorage
        const updateLabourName = () => {
            try {
                const profile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
                console.log('Labour profile in header:', profile);
                if (profile.firstName) {
                    setLabourName(profile.firstName);
                } else {
                    setLabourName('');
                }
            } catch (error) {
                console.error('Error reading labour profile:', error);
                setLabourName('');
            }
        };

        // Initial load
        updateLabourName();

        // Listen for storage changes
        window.addEventListener('storage', updateLabourName);
        
        // Listen for custom profile update event
        window.addEventListener('profileUpdated', updateLabourName);

        // Cleanup
        return () => {
            window.removeEventListener('storage', updateLabourName);
            window.removeEventListener('profileUpdated', updateLabourName);
        };
    }, [location]);

    useEffect(() => {
        // Fetch notification count
        const fetchNotificationCount = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/notifications/unread-count?userType=LABOUR', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                if (data.success) {
                    setNotificationCount(data.data.count || 0);
                }
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };

        fetchNotificationCount();

        // Refresh count every 30 seconds
        const interval = setInterval(fetchNotificationCount, 30000);

        return () => clearInterval(interval);
    }, [location]);

    const handleNotifications = () => {
        navigate('/labour/notifications');
    };

    const handleSubscription = () => {
        navigate('/labour/subscription');
    };

    return (
        <div className="bg-white px-3 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
                {/* Left Side - Logo and Welcome Text (compact, no extra space) */}
                <div className="flex items-center gap-2">
                    {/* Logo - Exact size, no extra width */}
                    <img 
                        src={logo} 
                        alt="Majdoor Sathi" 
                        className="h-16 w-auto object-contain"
                    />
                    
                    {/* Welcome Text and Name - Right next to logo */}
                    <div>
                        <p className="text-xs text-gray-500 leading-tight whitespace-nowrap">Hey, Welcome 👋</p>
                        <h1 className="text-sm font-bold text-gray-900 leading-tight whitespace-nowrap">
                            {labourName || '\u00A0'}
                        </h1>
                    </div>
                </div>

                {/* Right Side - Bell Icon & Subscription Icon */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleNotifications}
                        className="bg-blue-500 hover:bg-blue-600 p-2.5 rounded-full transition-colors active:scale-95 relative"
                    >
                        <Bell className="w-5 h-5 text-white" />
                        {/* Notification Badge */}
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                {notificationCount > 99 ? '99+' : notificationCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleSubscription}
                        className="bg-gray-200 hover:bg-gray-300 p-2.5 rounded-full transition-colors active:scale-95"
                    >
                        <Crown className="w-5 h-5 text-gray-700" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LabourHeader;
