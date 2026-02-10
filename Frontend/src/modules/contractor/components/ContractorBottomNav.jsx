import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Search, FileText, Settings } from 'lucide-react';

const ContractorBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/contractor/home', label: 'Home', icon: Home },
        { path: '/contractor/hire-workers', label: 'Hire Workers', icon: Users },
        { path: '/contractor/find-user', label: 'Find User', icon: Search },
        { path: '/contractor/requests', label: 'Requests', icon: FileText },
        { path: '/contractor/settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
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

export default ContractorBottomNav;
