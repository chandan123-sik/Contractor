import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, ChevronRight } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';
import LabourHeader from '../components/LabourHeader';

const Requests = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <LabourHeader />

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
