import { useNavigate } from 'react-router-dom';
import ContractorPageHeader from '../components/ContractorPageHeader';
import LegalVerificationSection from '../components/LegalVerificationSection';

const Legal = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <ContractorPageHeader title="Legal Verification" backPath="/contractor/settings" />

            <LegalVerificationSection />
        </div>
    );
};

export default Legal;
