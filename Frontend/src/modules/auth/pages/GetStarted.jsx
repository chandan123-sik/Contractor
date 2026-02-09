import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Briefcase, MapPin } from 'lucide-react';

const GetStarted = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
            {/* Background Image Section with Overlay */}
            <div className="flex-1 relative">
                <img
                    src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop"
                    alt="Professional Worker"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
            </div>

            {/* Enhanced Bottom Section */}
            <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 p-8 pt-10 pb-12 rounded-t-[2.5rem] -mt-12 relative z-10 shadow-2xl">
                {/* Decorative Element */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full"></div>
                
                <div className="flex flex-col items-center text-center">
                    {/* Main Heading */}
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight tracking-tight">
                        Your All-in-One Hiring Solution
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-white/95 text-base mb-8 px-2 max-w-md leading-relaxed font-medium">
                        Find and hire the best talent for your work from anywhere in India.
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Users className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-semibold">Verified Workers</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Briefcase className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-semibold">Quick Hiring</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <MapPin className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-semibold">Pan India</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={() => navigate('/mobile-login')}
                        className="w-full max-w-md bg-white text-gray-900 font-bold py-4 px-6 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        <span className="text-lg">Get Started</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>

                    {/* Additional Info */}
                    <p className="text-white/80 text-xs mt-6 font-medium">
                        Join thousands of satisfied employers
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
