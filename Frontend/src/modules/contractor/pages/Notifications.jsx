import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import ContractorPageHeader from '../components/ContractorPageHeader';
import EmptyState from '../../user/components/EmptyState';

const Notifications = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <ContractorPageHeader title="Notifications" backPath="/contractor/hire-workers" />

            <EmptyState
                icon={Bell}
                title="No Notifications Yet"
                description="You'll see notifications here when you receive updates about your projects and requests."
            />
        </div>
    );
};

export default Notifications;
