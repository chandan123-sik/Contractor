import { useState, useEffect } from 'react';
import { Mail, Phone, Clock } from 'lucide-react';
import ContactInfoItem from '../../user/components/ContactInfoItem';

const ContactUsContent = () => {
    const [contactData, setContactData] = useState({
        email: 'support@yourapp.com',
        phone: '+91 9XXXXXXXXX',
        workingHours: ['Monday - Saturday: 10:00 AM - 6:00 PM', 'Sunday: Closed']
    });

    useEffect(() => {
        const savedCms = localStorage.getItem('cmsContent');
        if (savedCms) {
            const cms = JSON.parse(savedCms);
            setContactData({
                email: cms.contactUs.email || contactData.email,
                phone: cms.contactUs.phone || contactData.phone,
                workingHours: [cms.contactUs.workingHours || contactData.workingHours[0], 'Sunday: Closed']
            });
        }
    }, []);

    const contactInfo = [
        {
            icon: Mail,
            title: 'Support Email',
            details: contactData.email,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            icon: Phone,
            title: 'Support Phone',
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
        }
    ];

    return (
        <div className="p-4 pb-8 space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Get Support</h2>
                <p className="text-gray-600 mb-6">
                    Need help with your account, projects, or payments? We're here to assist you. Reach out to us through any of the following channels:
                </p>

                <div className="space-y-4">
                    {contactInfo.map((info, index) => (
                        <ContactInfoItem key={index} {...info} />
                    ))}
                </div>
            </div>

            {/* Help Topics */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">We Can Help You With</h2>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Technical or usage issues</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Account, projects, or payment queries</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Suggestions and feedback</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">Business profile assistance</p>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-700 text-center">
                    We typically respond within 24-48 hours during working days.
                </p>
            </div>
        </div>
    );
};

export default ContactUsContent;
