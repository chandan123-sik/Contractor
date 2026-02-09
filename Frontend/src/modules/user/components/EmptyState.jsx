const EmptyState = ({ icon: Icon, title, description, iconBgColor = 'bg-yellow-100', iconColor = 'text-yellow-600' }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-20 px-6">
            <div className={`${iconBgColor} p-8 rounded-full mb-6`}>
                <Icon className={`w-16 h-16 ${iconColor}`} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 text-center">{description}</p>
        </div>
    );
};

export default EmptyState;
