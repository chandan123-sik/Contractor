import { useEffect, useState } from 'react';
import { Bell, Crown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ChevronRight } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';

const Requests = () => {
    const navigate = useNavigate();
    const [labourName, setLabourName] = useState('');

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
        if (profile.firstName) {
            setLabourName(profile.firstName);
        }
    }, []);

    const handleCreateCard = () => {
        navigate('/labour/create-card');
    };

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
                            onClick={handleCreateCard}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-3 rounded-full flex items-center gap-2 shadow-md transition-all active:scale-95"
                        >
                            <span className="text-sm">Create Card</span>
                            <Plus className="w-5 h-5" />
                        </button>
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
