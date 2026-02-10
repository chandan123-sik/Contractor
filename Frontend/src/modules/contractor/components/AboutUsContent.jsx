import { useState, useEffect } from 'react';
import { Info, CheckCircle, Briefcase, Eye, Target } from 'lucide-react';

const AboutUsContent = () => {
    const [content, setContent] = useState({
        title: 'Welcome to Our Platform',
        description: 'This platform helps contractors connect with users and skilled labours, manage projects efficiently, and grow their business digitally.',
        vision: 'Empower contractors with digital tools to grow their business and reach more customers efficiently.',
        mission: 'Connect contractors, users, and labours on one trusted platform, making project management simple and efficient.'
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
        'Create and manage business profile',
        'Apply for user projects',
        'Hire labours and manage teams',
        'Receive job requests from users',
        'Track project status and notifications'
    ];

    const benefits = [
        'Verified users and labours',
        'Easy project discovery',
        'Faster hiring process',
        'Local area visibility',
        'No middlemen'
    ];

    return (
        <div className="p-4 pb-8 space-y-6">
            {/* App Introduction */}
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

            {/* What Contractors Can Do */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">What Contractors Can Do</h2>
                </div>

                <div className="space-y-3">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">{feature}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why This Platform Is Useful */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-900">Why This Platform Is Useful for Contractors</h2>
                </div>
                <p className="text-gray-600 mb-4">
                    Key benefits that help you grow your business:
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

            {/* Vision & Mission */}
            <div className="space-y-4">
                {/* Vision */}
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

                {/* Mission */}
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

            {/* Footer Note */}
            <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">
                    Thank you for being part of our community. Together, we're building a better future for contractors.
                </p>
            </div>
        </div>
    );
};

export default AboutUsContent;
