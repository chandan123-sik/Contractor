import { useEffect, useState } from 'react';
import { Bell, Crown, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LabourBottomNav from '../components/LabourBottomNav';

const LabourDashboard = () => {
    const navigate = useNavigate();
    const [labourName, setLabourName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Function to update labour name from localStorage
        const updateLabourName = () => {
            try {
                const profile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
                if (profile.firstName) {
                    setLabourName(profile.firstName);
                } else {
                    setLabourName('User');
                }
            } catch (error) {
                console.error('Error reading labour profile:', error);
                setLabourName('User');
            }
        };

        // Initial load
        updateLabourName();

        // Listen for storage changes
        window.addEventListener('storage', updateLabourName);

        // Cleanup
        return () => {
            window.removeEventListener('storage', updateLabourName);
        };
    }, []);

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Profile Icon */}
                        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                        </div>
                        {/* Welcome Text and Name */}
                        <div>
                            <p className="text-sm text-gray-500">Hey, Welcome 👋</p>
                            <h1 className="text-xl font-bold text-gray-900">
                                {labourName || 'User'}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate('/labour/notifications')}
                            className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full shadow-md transition-all relative"
                        >
                            <Bell className="w-5 h-5 text-white" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                0
                            </span>
                        </button>
                        <button 
                            onClick={() => navigate('/labour/subscription')}
                            className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full shadow-md transition-all"
                        >
                            <Crown className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                        />
                    </div>
                    <button className="p-2 bg-gray-100 rounded-lg">
                        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-center">
                        Hire Workers content will be displayed here
                    </p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default LabourDashboard;
