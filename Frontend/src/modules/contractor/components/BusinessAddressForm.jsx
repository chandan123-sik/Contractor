const BusinessAddressForm = ({ formData, onChange }) => {
    return (
        <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Enter business address</h2>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        City
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={onChange}
                        placeholder="Enter city"
                        className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        State
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={onChange}
                        placeholder="Enter state"
                        className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
            </div>

            {/* Address Line 1 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    Address line 1
                </label>
                <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={onChange}
                    placeholder="Enter address line 1"
                    className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </div>

            {/* Landmark */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                    Landmark
                </label>
                <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={onChange}
                    placeholder="Enter landmark"
                    className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
            </div>
        </div>
    );
};

export default BusinessAddressForm;
