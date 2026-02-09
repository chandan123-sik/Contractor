import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorHeader from '../components/ContractorHeader';
import RequestPageTitle from '../components/RequestPageTitle';
import PlaceholderContent from '../components/PlaceholderContent';

const WorkersRequest = () => {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ContractorHeader />

            <div className="p-4">
                <RequestPageTitle title="Workers Request" />
                <PlaceholderContent message="Workers Request content will be displayed here" />
            </div>

            <ContractorBottomNav />
        </div>
    );
};

export default WorkersRequest;
