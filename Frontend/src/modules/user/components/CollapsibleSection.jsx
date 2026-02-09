import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-t border-gray-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
            </button>
            
            {isOpen && (
                <div className="px-6 pb-6 text-sm text-gray-700 space-y-3">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleSection;
