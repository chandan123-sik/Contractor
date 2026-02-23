import { useNavigate } from 'react-router-dom';
import ContractorPageHeader from '../components/ContractorPageHeader';
import PersonalDetailsForm from '../components/PersonalDetailsForm';

const PersonalDetails = () => {
    const navigate = useNavigate();

    const handleSave = () => {
        navigate('/contractor/settings');
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <ContractorPageHeader title="Personal details" backPath="/contractor/settings" sticky />

            <div className="flex-1 overflow-y-auto">
                <PersonalDetailsForm onSave={handleSave} />
            </div>
        </div>
    );
};

export default PersonalDetails;
