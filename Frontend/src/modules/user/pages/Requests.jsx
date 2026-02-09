import { useNavigate } from 'react-router-dom';
import { Briefcase, Users } from 'lucide-react';
import UserBottomNav from '../components/UserBottomNav';
import UserHeader from '../components/UserHeader';
import RequestOptionCard from '../components/RequestOptionCard';

const Requests = () => {
    const navigate = useNavigate();

    const requestOptions = [
        {
            title: 'Contractor Request',
            icon: Briefcase,
            path: '/user/contractor-request',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Workers Request',
            icon: Users,
            path: '/user/workers-request',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        }
    ];

    const handleOptionClick = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <UserHeader />

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
                            onClick={() => handleOptionClick(option.path)}
                        />
                    ))}
                </div>
            </div>

            <UserBottomNav />
        </div>
    );
};

export default Requests;
