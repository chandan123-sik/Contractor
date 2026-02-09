import { forwardRef } from 'react';

/**
 * Premium Card Component - Reusable card with animations
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {number} props.index - Card index for stagger animation
 */
const PremiumCard = forwardRef(({ children, className = '', onClick, index = 0 }, ref) => {
    return (
        <div
            ref={ref}
            onClick={onClick}
            className={`premium-card card-fade-in ${className} ${onClick ? 'cursor-pointer' : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {children}
        </div>
    );
});

PremiumCard.displayName = 'PremiumCard';

export default PremiumCard;
