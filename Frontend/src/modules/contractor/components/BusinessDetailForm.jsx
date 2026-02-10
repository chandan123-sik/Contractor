import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const BusinessDetailForm = ({ formData, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const businessTypes = [
        'Proprietorship',
        'Partnership',
        'Private Limited',
        'Public Limited',
        'LLP',
        'Individual Contractor',
        'Construction Company',
        'Civil Contractor',
        'Interior Design Firm',
        'Renovation Contractor',
        'Electrical Contractor',
        'Plumbing Contractor',
        'Painting Contractor',
        'Waterproofing Contractor',
        'Flooring Contractor',
        'HVAC / AC Contractor',
        'Modular Kitchen Contractor',
        'Furniture & Woodwork Contractor',
        'False Ceiling Contractor',
        'Landscaping Contractor',
        'Solar Panel Contractor',
        'Fire Safety Contractor',
        'Maintenance & Repair Contractor',
        'Government Approved Contractor',
        'Turnkey Project Contractor'
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (type) => {
        onChange({ target: { name: 'businessType', value: type } });
        setIsOpen(false);
    };

    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Enter business detail</h2>

            {/* Business Type - Custom Dropdown */}
            <div className="mb-4" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    Business type
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-between"
                    >
                        <span>{formData.businessType || 'Select business type'}</span>
                        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                            {businessTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleSelect(type)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                                        formData.businessType === type ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-gray-900'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Business Name */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    Business name
                </label>
                <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={onChange}
                    placeholder="Enter business name"
                    className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </div>
        </div>
    );
};

export default BusinessDetailForm;
