const ContactInfoItem = ({ icon: Icon, title, details, bgColor, iconColor }) => {
    return (
        <div className="flex items-start gap-4">
            <div className={`${bgColor} p-3 rounded-full flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                {Array.isArray(details) ? (
                    details.map((detail, index) => (
                        <p key={index} className="text-gray-700 text-sm">
                            {detail}
                        </p>
                    ))
                ) : (
                    <p className="text-gray-700 text-sm">{details}</p>
                )}
            </div>
        </div>
    );
};

export default ContactInfoItem;
