import UserBottomNav from '../components/UserBottomNav';
import UserHeader from '../components/UserHeader';

const ContractorRequest = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <UserHeader />

            {/* Main Content Area */}
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contractor Request</h2>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-gray-600">Contractor Request content will be displayed here</p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <UserBottomNav />
        </div>
    );
};

export default ContractorRequest;
