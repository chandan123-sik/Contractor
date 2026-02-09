import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import UserBottomNav from '../components/UserBottomNav';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

const Notifications = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <PageHeader title="Notifications" backPath="/user/hire-workers" />

            <EmptyState
                icon={Bell}
                title="No Notifications Yet"
                description="You'll see notifications here when you receive updates about your projects and requests."
            />

            <UserBottomNav />
        </div>
    );
};

export default Notifications;
