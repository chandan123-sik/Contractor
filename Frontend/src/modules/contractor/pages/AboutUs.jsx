import { useNavigate } from 'react-router-dom';
import ContractorPageHeader from '../components/ContractorPageHeader';
import AboutUsContent from '../components/AboutUsContent';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <ContractorPageHeader title="About us" backPath="/contractor/settings" sticky />

            <AboutUsContent />
        </div>
    );
};

export default AboutUs;
