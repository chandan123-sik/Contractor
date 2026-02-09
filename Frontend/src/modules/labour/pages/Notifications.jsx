import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';

const Notifications = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm flex items-center gap-3">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
                <div className="w-40 h-40 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                    <Bell className="w-20 h-20 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">No Notifications Yet</h2>
                <p className="text-center text-gray-500 max-w-sm">
                    You'll see notifications here when you receive updates about your projects and requests.
                </p>
            </div>

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default Notifications;
