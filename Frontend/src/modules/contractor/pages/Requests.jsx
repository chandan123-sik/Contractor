import { useNavigate } from 'react-router-dom';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorHeader from '../components/ContractorHeader';
import RequestOptionsGrid from '../components/RequestOptionsGrid';

const Requests = () => {
    const navigate = useNavigate();

    const handleOptionClick = (path) => {
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <ContractorHeader />

            <RequestOptionsGrid onOptionClick={handleOptionClick} />

            <ContractorBottomNav />
        </div>
    );
};

export default Requests;
