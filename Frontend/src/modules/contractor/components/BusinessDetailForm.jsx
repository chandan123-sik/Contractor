const BusinessDetailForm = ({ formData, onChange }) => {
    const businessTypes = ['Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP'];

    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Enter business detail</h2>

            {/* Business Type */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    Business type
                </label>
                <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={onChange}
                    className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                    {businessTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
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
