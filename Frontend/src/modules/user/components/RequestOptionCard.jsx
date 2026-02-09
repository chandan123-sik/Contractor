const RequestOptionCard = ({ title, icon: Icon, color, bgColor, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
        >
            <div className={`${bgColor} p-4 rounded-full`}>
                <Icon className={`w-8 h-8 ${color}`} />
            </div>
            <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </button>
    );
};

export default RequestOptionCard;
