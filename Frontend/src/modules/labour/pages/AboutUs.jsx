import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Briefcase, Search, Users, TrendingUp, Shield, Target, Eye, CheckCircle } from 'lucide-react';
import LabourBottomNav from '../components/LabourBottomNav';

const AboutUs = () => {
    const navigate = useNavigate();

    const [content, setContent] = useState({
        title: 'Welcome to Our Platform',
        description: 'This platform helps skilled labours find genuine work opportunities from verified users and contractors in their local area.',
        vision: 'Provide regular work opportunities and financial stability to skilled labours.',
        mission: 'Connect labours directly with users and contractors through a trusted digital platform.'
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
        'Create and manage their labour profile',
        'Add skills, experience, and previous work photos',
        'Find jobs posted by users',
        'Apply for contractor and user projects',
        'Receive work requests directly',
        'Increase visibility with premium plans'
    ];

    const benefits = [
        { icon: Shield, text: 'Verified users and contractors' },
        { icon: Search, text: 'Local area job opportunities' },
        { icon: Users, text: 'No middlemen or agents' },
        { icon: TrendingUp, text: 'Faster job matching' },
        { icon: CheckCircle, text: 'Fair and transparent hiring' }
    ];

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
                <h1 className="text-xl font-bold text-gray-900">About Us</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {/* App Introduction */}
                <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">{content.title}</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {content.description}
                    </p>
                </div>

                {/* What Labours Can Do */}
                <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">What Labours Can Do</h2>
                    <div className="space-y-3">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="text-gray-700 text-sm">{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why This Platform Is Useful */}
                <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Why This Platform Is Useful for Labours</h2>
                    <div className="space-y-4">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-gray-700 text-sm font-medium">{benefit.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Vision and Mission */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Eye className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Our Vision</h3>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed ml-13">
                            {content.vision}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Our Mission</h3>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed ml-13">
                            {content.mission}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <LabourBottomNav />
        </div>
    );
};

export default AboutUs;
