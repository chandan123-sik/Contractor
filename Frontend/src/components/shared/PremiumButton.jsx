/**
 * Premium Button Components - Reusable buttons with animations
 */

export const PrimaryButton = ({ children, onClick, className = '', disabled = false, ...props }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn-primary ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const SecondaryButton = ({ children, onClick, className = '', disabled = false, ...props }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn-secondary ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export const IconButton = ({ children, onClick, className = '', ...props }) => {
    return (
        <button
            onClick={onClick}
            className={`btn-hover p-2 rounded-lg ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
