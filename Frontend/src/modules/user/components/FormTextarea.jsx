const FormTextarea = ({ label, name, value, onChange, placeholder, rows = 3 }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
                {label}
            </label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full bg-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
        </div>
    );
};

export default FormTextarea;
