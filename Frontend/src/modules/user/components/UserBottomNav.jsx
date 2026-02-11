import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Search, FileText, Settings } from 'lucide-react';

const UserBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/user/home', label: 'Home', icon: Home },
        { path: '/user/hire-workers', label: 'Hire Workers', icon: Users },
        { path: '/user/find-contractor', label: 'Find Contractor', icon: Search },
        { path: '/user/requests', label: 'Requests', icon: FileText },
        { path: '/user/settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                                isActive ? 'text-yellow-500' : 'text-gray-500'
                            }`}
                        >
                            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-yellow-500' : 'text-gray-500'}`} />
                            <span className={`text-xs font-medium ${isActive ? 'text-yellow-500' : 'text-gray-600'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default UserBottomNav;
