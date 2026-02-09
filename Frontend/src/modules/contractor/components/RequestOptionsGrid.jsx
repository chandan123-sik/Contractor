import { Briefcase, Users } from 'lucide-react';
import RequestOptionCard from '../../user/components/RequestOptionCard';

const RequestOptionsGrid = ({ onOptionClick }) => {
    const requestOptions = [
        {
            title: 'User Request',
            icon: Briefcase,
            path: '/contractor/user-request',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Workers Request',
            icon: Users,
            path: '/contractor/workers-request',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        }
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Request Type</h2>
            
            <div className="space-y-4">
                {requestOptions.map((option) => (
                    <RequestOptionCard
                        key={option.path}
                        title={option.title}
                        icon={option.icon}
                        color={option.color}
                        bgColor={option.bgColor}
                        onClick={() => onOptionClick(option.path)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RequestOptionsGrid;
