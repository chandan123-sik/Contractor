const FeatureCard = ({ icon: Icon, title, description, color, bgColor }) => {
    return (
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className={`${bgColor} p-3 rounded-full flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
