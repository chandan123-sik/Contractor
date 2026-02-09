import { useNavigate } from 'react-router-dom';
import ContractorPageHeader from '../components/ContractorPageHeader';
import PersonalDetailsForm from '../components/PersonalDetailsForm';

const PersonalDetails = () => {
    const navigate = useNavigate();

    const handleSave = () => {
        navigate('/contractor/settings');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            <ContractorPageHeader title="Personal details" backPath="/contractor/settings" sticky />

            <PersonalDetailsForm onSave={handleSave} />
        </div>
    );
};

export default PersonalDetails;
