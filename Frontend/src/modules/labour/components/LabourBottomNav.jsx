import { useNavigate, useLocation } from 'react-router-dom';
import { Users, UserSearch, FileText, Settings } from 'lucide-react';

const LabourBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/labour/find-user', icon: UserSearch, label: 'Find User' },
        { path: '/labour/find-contractor', icon: Users, label: 'Find Contractor' },
        { path: '/labour/requests', icon: FileText, label: 'Requests' },
        { path: '/labour/settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="flex flex-col items-center gap-1 py-1 px-3 transition-colors"
                        >
                            <Icon 
                                className={`w-6 h-6 ${
                                    isActive ? 'text-yellow-500' : 'text-gray-400'
                                }`}
                            />
                            <span 
                                className={`text-xs font-medium ${
                                    isActive ? 'text-yellow-500' : 'text-gray-500'
                                }`}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default LabourBottomNav;
