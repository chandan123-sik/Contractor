const BillingCycleToggle = ({ billingCycle, onChange }) => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => onChange('monthly')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                        billingCycle === 'monthly'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => onChange('yearly')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                        billingCycle === 'yearly'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Yearly
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        Save 17%
                    </span>
                </button>
            </div>
        </div>
    );
};

export default BillingCycleToggle;
