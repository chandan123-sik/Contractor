import { useEffect, useState } from 'react';
import { Bell, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ChevronRight } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';

const Requests = () => {
    const navigate = useNavigate();
    const [labourName, setLabourName] = useState('');

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

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Request Type</h2>
                
                {/* User Request Card */}
                <button
                    onClick={() => navigate('/labour/user-request')}
                    className="w-full bg-white rounded-2xl p-6 mb-4 flex items-center justify-between hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                            <Briefcase className="w-8 h-8 text-blue-500" />
                        </div>
                        <span className="text-lg font-semibold text-gray-900">User Request</span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                </button>

                {/* Contractor Request Card */}
                <button
                    onClick={() => navigate('/labour/contractor-request')}
                    className="w-full bg-white rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-green-500" />
                        </div>
                        <span className="text-lg font-semibold text-gray-900">Contractor Request</span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                </button>
            </div>

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default Requests;
