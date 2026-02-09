import { useNavigate } from 'react-router-dom';
import ContractorPageHeader from '../components/ContractorPageHeader';
import ContactUsContent from '../components/ContactUsContent';

const ContactUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <ContractorPageHeader title="Contact us" backPath="/contractor/settings" sticky />

            <ContactUsContent />
        </div>
    );
};

export default ContactUs;
