import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hammer, Shield, Phone, HelpCircle, LogOut, MessageSquare, X } from 'lucide-react';
import UserBottomNav from '../components/UserBottomNav';
import PageHeader from '../components/PageHeader';
import SettingsMenuItem from '../components/SettingsMenuItem';

const Settings = () => {
    const navigate = useNavigate();
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const menuItems = [
        { icon: User, label: 'Personal', path: '/user/personal-details', color: 'text-gray-700' },
        { icon: Hammer, label: 'My Projects', path: '/user/my-projects', color: 'text-gray-700' },
        { icon: Shield, label: 'Legal', path: '/user/legal', color: 'text-gray-700' },
        { icon: Phone, label: 'Contact us', path: '/user/contact-us', color: 'text-gray-700' },
        { icon: HelpCircle, label: 'About us', path: '/user/about-us', color: 'text-gray-700' },
        { icon: MessageSquare, label: 'Feedback', action: 'feedback', color: 'text-gray-700' },
        { icon: LogOut, label: 'Log out', path: '/mobile-login', color: 'text-red-500' }
    ];

    const handleMenuClick = (item) => {
        if (item.action === 'feedback') {
            setShowFeedbackModal(true);
        } else if (item.path) {
            navigate(item.path);
        }
    };

    const handleCloseFeedback = () => {
        setShowFeedbackModal(false);
        setRating(0);
        setFeedback('');
    };

    const handleSubmitFeedback = () => {
        // Will be implemented later
        console.log('Feedback submitted:', { rating, feedback });
        handleCloseFeedback();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <PageHeader title="Settings" backPath="/user/hire-workers" />

            <div className="mt-4">
                {menuItems.map((item, index) => {
                    const isLastTwo = index >= menuItems.length - 2;
                    
                    return (
                        <div key={item.label}>
                            <SettingsMenuItem
                                icon={item.icon}
                                label={item.label}
                                color={item.color}
                                onClick={() => handleMenuClick(item)}
                            />
                            {!isLastTwo && index < menuItems.length - 2 && (
                                <div className="border-b border-gray-100" />
                            )}
                            {index === menuItems.length - 2 && (
                                <div className="h-4 bg-gray-50" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
                    <div className="bg-white rounded-t-3xl w-full max-w-md animate-slide-up">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900">Feedback</h2>
                            <button
                                onClick={handleCloseFeedback}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-red-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Star Rating */}
                            <div className="flex justify-center gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <span className={`text-5xl ${
                                            star <= rating ? 'text-green-600' : 'text-gray-300'
                                        }`}>
                                            ★
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Feedback Text Area */}
                            <div>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Good service."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows={6}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitFeedback}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <UserBottomNav />
        </div>
    );
};

export default Settings;
