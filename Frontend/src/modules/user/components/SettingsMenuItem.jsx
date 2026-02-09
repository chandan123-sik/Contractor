import { ChevronRight } from 'lucide-react';

const SettingsMenuItem = ({ icon: Icon, label, color, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <Icon className={`w-6 h-6 ${color}`} />
                <span className={`text-lg font-medium ${color}`}>
                    {label}
                </span>
            </div>
            <ChevronRight className={`w-5 h-5 ${color}`} />
        </button>
    );
};

export default SettingsMenuItem;
