import { useEffect, useState } from 'react';
import { Bell, Crown, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LabourBottomNav from '../components/LabourBottomNav';

const LabourDashboard = () => {
    const navigate = useNavigate();
    const [labourName, setLabourName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
        if (profile.firstName) {
            setLabourName(profile.firstName);
        }
    }, []);

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Welcome Back,</p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Namaste,
                        </h1>
                        <h2 className="text-2xl font-bold text-gray-900">{labourName || 'User'}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate('/labour/notifications')}
                            className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-full shadow-md transition-all"
                        >
                            <Bell className="w-5 h-5 text-gray-900" />
                        </button>
                        <button 
                            onClick={() => navigate('/labour/subscription')}
                            className="bg-yellow-400 hover:bg-yellow-500 p-3 rounded-full shadow-md transition-all"
                        >
                            <Crown className="w-5 h-5 text-gray-900" />
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
