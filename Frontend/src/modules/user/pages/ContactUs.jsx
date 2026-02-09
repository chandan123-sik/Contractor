import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ContactInfoItem from '../components/ContactInfoItem';
import ContactForm from '../components/ContactForm';
import InfoBox from '../components/InfoBox';
import CollapsibleSection from '../components/CollapsibleSection';

const ContactUs = () => {
    const navigate = useNavigate();
    const [initialFormData, setInitialFormData] = useState({});

    const [contactData, setContactData] = useState({
        email: 'support@yourapp.com',
        phone: '+91 1800-123-4567',
        workingHours: ['Monday - Saturday: 9:00 AM - 6:00 PM', 'Sunday: Closed'],
        address: ['Indore, Madhya Pradesh', 'India - 452001']
    });

    useEffect(() => {
        const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        const mobileNumber = localStorage.getItem('mobile_number') || '';

        const fullName = `${userProfile.firstName || ''} ${userProfile.middleName || ''} ${userProfile.lastName || ''}`.trim();

        setInitialFormData({
            fullName: fullName || '',
            contact: mobileNumber || '',
            message: ''
        });

        const savedCms = localStorage.getItem('cmsContent');
        if (savedCms) {
            const cms = JSON.parse(savedCms);
            setContactData({
                email: cms.contactUs.email || contactData.email,
                phone: cms.contactUs.phone || contactData.phone,
                workingHours: [cms.contactUs.workingHours || contactData.workingHours[0], 'Sunday: Closed'],
                address: [cms.contactUs.address || contactData.address[0]]
            });
        }
    }, []);

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Support',
            details: contactData.email,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: Phone,
            title: 'Helpline',
            details: contactData.phone,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: contactData.workingHours,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            icon: MapPin,
            title: 'Office Location',
            details: contactData.address,
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader title="Contact us" backPath="/user/settings" sticky />

            <div className="p-4 pb-8 space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h2>
                    <p className="text-gray-600 mb-6">
                        Have questions or need help? We're here to assist you. Reach out to us through any of the following channels:
                    </p>

                    <div className="space-y-4">
                        {contactInfo.map((info, index) => (
                            <ContactInfoItem key={index} {...info} />
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Send us a Message</h2>
                    <p className="text-gray-600 mb-6 text-sm">
                        Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                    <ContactForm initialData={initialFormData} />
                </div>

                <InfoBox
                    variant="info"
                    message="We typically respond within 24-48 hours during working days."
                />

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-900 p-6 pb-4">Policies</h2>

                    <CollapsibleSection title="Terms & Conditions">
                        <p className="font-semibold text-gray-900">1. Acceptance of Terms</p>
                        <p>By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.</p>

                        <p className="font-semibold text-gray-900 mt-4">2. Use of Platform</p>
                        <p>This platform is designed to connect users with skilled labours and verified contractors. Users must provide accurate information and use the platform responsibly.</p>

                        <p className="font-semibold text-gray-900 mt-4">3. User Responsibilities</p>
                        <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>

                        <p className="font-semibold text-gray-900 mt-4">4. Prohibited Activities</p>
                        <p>Users must not engage in any fraudulent activities, misrepresent information, or use the platform for any illegal purposes.</p>

                        <p className="font-semibold text-gray-900 mt-4">5. Payment Terms</p>
                        <p>All payments made through the platform are subject to our payment processing terms. Users agree to pay all applicable fees.</p>

                        <p className="font-semibold text-gray-900 mt-4">6. Termination</p>
                        <p>We reserve the right to terminate or suspend access to our platform immediately, without prior notice, for any breach of these Terms.</p>

                        <p className="font-semibold text-gray-900 mt-4">7. Changes to Terms</p>
                        <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.</p>
                    </CollapsibleSection>

                    <CollapsibleSection title="Privacy Policy">
                        <p className="font-semibold text-gray-900">1. Information We Collect</p>
                        <p>We collect personal information such as name, email, phone number, location, and other details you provide when using our platform.</p>

                        <p className="font-semibold text-gray-900 mt-4">2. How We Use Your Information</p>
                        <p>Your information is used to provide and improve our services, facilitate connections between users and workers, process payments, and communicate with you.</p>

                        <p className="font-semibold text-gray-900 mt-4">3. Information Sharing</p>
                        <p>We share your information with contractors and labours only when necessary to fulfill service requests. We do not sell your personal information to third parties.</p>

                        <p className="font-semibold text-gray-900 mt-4">4. Data Security</p>
                        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>

                        <p className="font-semibold text-gray-900 mt-4">5. Your Rights</p>
                        <p>You have the right to access, update, or delete your personal information. You can also opt-out of marketing communications at any time.</p>

                        <p className="font-semibold text-gray-900 mt-4">6. Cookies and Tracking</p>
                        <p>We use cookies and similar technologies to enhance your experience and analyze platform usage.</p>

                        <p className="font-semibold text-gray-900 mt-4">7. Changes to Privacy Policy</p>
                        <p>We may update this privacy policy from time to time. We will notify you of any significant changes.</p>

                        <p className="font-semibold text-gray-900 mt-4">8. Contact Us</p>
                        <p>If you have any questions about this privacy policy, please contact us at support@yourapp.com</p>
                    </CollapsibleSection>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
