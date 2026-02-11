import { User, Briefcase, Hammer, Shield, Phone, HelpCircle, LogOut, MessageSquare, FolderKanban, History } from 'lucide-react';
import SettingsMenuItem from '../../user/components/SettingsMenuItem';

const SettingsMenu = ({ onMenuClick }) => {
    const menuItems = [
        { icon: User, label: 'Personal', path: '/contractor/personal-details', color: 'text-gray-700' },
        { icon: Briefcase, label: 'Business', path: '/contractor/business-details', color: 'text-gray-700' },
        { icon: Hammer, label: 'My Projects', path: '/contractor/my-projects', color: 'text-gray-700' },
        { icon: FolderKanban, label: 'My Project for User', path: '/contractor/my-project-for-user', color: 'text-gray-700' },
        { icon: History, label: 'History', path: '/contractor/history', color: 'text-gray-700' },
        { icon: Shield, label: 'Legal', path: '/contractor/legal', color: 'text-gray-700' },
        { icon: Phone, label: 'Contact us', path: '/contractor/contact-us', color: 'text-gray-700' },
        { icon: HelpCircle, label: 'About us', path: '/contractor/about-us', color: 'text-gray-700' },
        { icon: MessageSquare, label: 'Feedback and Reports', path: '/contractor/feedback', color: 'text-gray-700' },
        { icon: LogOut, label: 'Log out', path: '/mobile-login', color: 'text-red-500' }
    ];

    return (
        <div className="mt-4">
            {menuItems.map((item, index) => {
                const isLastItem = index === menuItems.length - 1;
                const isSecondLastItem = index === menuItems.length - 2;
                
                return (
                    <div key={item.label}>
                        <SettingsMenuItem
                            icon={item.icon}
                            label={item.label}
                            color={item.color}
                            onClick={() => onMenuClick(item.path)}
                        />
                        {!isLastItem && !isSecondLastItem && (
                            <div className="border-b border-gray-100" />
                        )}
                        {isSecondLastItem && (
                            <div className="h-4 bg-gray-50" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SettingsMenu;
