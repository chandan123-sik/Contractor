import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ContractorBottomNav from '../components/ContractorBottomNav';
import ContractorPageHeader from '../components/ContractorPageHeader';
import SettingsMenu from '../components/SettingsMenu';

const Settings = () => {
    const navigate = useNavigate();
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleMenuClick = (path) => {
        if (path === '/contractor/feedback') {
            setShowFeedbackModal(true);
        } else if (path === '/mobile-login') {
            // Clear all localStorage data on logout
            localStorage.clear();
            // Use replace to prevent going back to settings
            navigate('/mobile-login', { replace: true });
        } else {
            navigate(path);
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
            <ContractorPageHeader title="Settings" backPath="/contractor/hire-workers" />

            <SettingsMenu onMenuClick={handleMenuClick} />

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

            <ContractorBottomNav />
        </div>
    );
};

export default Settings;
