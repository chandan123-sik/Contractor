import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Info, Users, Briefcase, Hammer, CheckCircle, Target, Eye } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FeatureCard from '../components/FeatureCard';

const AboutUs = () => {
    const navigate = useNavigate();

    const [content, setContent] = useState({
        title: 'Welcome to Our Platform',
        description: 'This platform connects users with skilled labours and verified contractors for construction and home service needs. We make it easy to find the right people for your projects and help workers find meaningful employment opportunities.',
        vision: 'To create employment opportunities with easy hiring, making it simple for everyone to find work or hire the right talent for their needs.',
        mission: 'Connecting the right people with the right work by providing a trusted, transparent, and efficient platform for users, contractors, and labours.'
    });

    useEffect(() => {
        const savedCms = localStorage.getItem('cmsContent');
        if (savedCms) {
            const cms = JSON.parse(savedCms);
            setContent({
                title: cms.aboutUs.title || content.title,
                description: cms.aboutUs.description || content.description,
                vision: cms.aboutUs.vision || content.vision,
                mission: cms.aboutUs.mission || content.mission
            });
        }
    }, []);

    const features = [
        {
            icon: Users,
            title: 'For Users',
            description: 'Post jobs and hire skilled workers for your construction and home service needs',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            icon: Briefcase,
            title: 'For Contractors',
            description: 'Manage teams, apply for projects, and grow your business',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            icon: Hammer,
            title: 'For Labours',
            description: 'Easily find work opportunities and connect with employers',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    const benefits = [
        'Verified profiles for trust and safety',
        'Easy and quick hiring process',
        'Transparent communication between all parties',
        'Availability of local workers and contractors',
        'Secure platform for all transactions',
        'Real-time updates and notifications'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader title="About us" backPath="/user/settings" sticky />

            <div className="p-4 pb-8 space-y-6">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="bg-yellow-400 p-2 rounded-full">
                            <Info className="w-6 h-6 text-gray-900" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mt-1">{content.title}</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {content.description}
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">What We Do</h2>
                    <p className="text-gray-600 mb-6">
                        Our platform serves three types of users, each with unique features designed to meet their specific needs:
                    </p>

                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-bold text-gray-900">Why Choose Us</h2>
                    </div>
                    <p className="text-gray-600 mb-4">
                        We provide a reliable and efficient platform that benefits everyone:
                    </p>

                    <div className="space-y-3">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-700">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-50 p-2 rounded-full">
                                <Eye className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            {content.vision}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-purple-50 p-2 rounded-full">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            {content.mission}
                        </p>
                    </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">
                        Thank you for being part of our community. Together, we're building a better future for everyone.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
