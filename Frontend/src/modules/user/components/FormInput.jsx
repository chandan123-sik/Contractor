const FormInput = ({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    maxLength,
    required = false 
}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                required={required}
                className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
        </div>
    );
};

export default FormInput;
