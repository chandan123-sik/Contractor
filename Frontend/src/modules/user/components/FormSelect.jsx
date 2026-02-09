const FormSelect = ({ label, name, value, onChange, options }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
                {label}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormSelect;
