const InfoBox = ({ icon: Icon, message, variant = 'info' }) => {
    const variants = {
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            text: 'text-blue-700',
            iconColor: 'text-blue-500'
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-100',
            text: 'text-green-700',
            iconColor: 'text-green-500'
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-100',
            text: 'text-yellow-700',
            iconColor: 'text-yellow-500'
        }
    };

    const style = variants[variant];

    return (
        <div className={`${style.bg} border ${style.border} rounded-xl p-4 flex gap-3`}>
            {Icon && <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />}
            <p className={`text-sm ${style.text}`}>{message}</p>
        </div>
    );
};

export default InfoBox;
