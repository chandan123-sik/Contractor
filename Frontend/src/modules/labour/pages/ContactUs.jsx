import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, Clock } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        message: ''
    });

    const [contactInfo, setContactInfo] = useState({
        email: 'support@yourapp.com',
        phone: '+91 9XXXXXXXXX',
        workingHours: 'Monday to Saturday',
        time: '10 AM – 6 PM'
    });

    useEffect(() => {
        // Auto-fill name from profile
        const profile = JSON.parse(localStorage.getItem('labour_profile') || '{}');
        if (profile.firstName) {
            setFormData(prev => ({
                ...prev,
                fullName: `${profile.firstName} ${profile.lastName || ''}`.trim()
            }));
        }

        const savedCms = localStorage.getItem('cmsContent');
        if (savedCms) {
            const cms = JSON.parse(savedCms);
            setContactInfo({
                email: cms.contactUs.email || contactInfo.email,
                phone: cms.contactUs.phone || contactInfo.phone,
                workingHours: cms.contactUs.workingHours || contactInfo.workingHours,
                time: '' // Combined in workingHours from admin side
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.phoneNumber.trim()) {
            toast.error('Please enter your phone number');
            return;
        }

        if (!formData.message.trim()) {
            toast.error('Please enter your message');
            return;
        }

        // Show success message
        toast.success('Thanks for contacting us. Our support team will get back to you soon.');

        // Reset form
        setFormData(prev => ({
            ...prev,
            phoneNumber: '',
            message: ''
        }));
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {/* Contact Details */}
                <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h2>

                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">Support Email</p>
                                <p className="text-sm text-gray-600">{contactInfo.email}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">Support Phone</p>
                                <p className="text-sm text-gray-600">{contactInfo.phone}</p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 mb-1">Working Hours</p>
                                <p className="text-sm text-gray-600">{contactInfo.workingHours}</p>
                                {contactInfo.time && <p className="text-sm text-gray-600">{contactInfo.time}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Send us a Message</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                readOnly
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                maxLength="10"
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us how we can help you..."
                                rows="5"
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-base transition-all shadow-md active:scale-[0.98]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default ContactUs;
