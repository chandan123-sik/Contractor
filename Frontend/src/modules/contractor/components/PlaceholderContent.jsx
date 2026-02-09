const PlaceholderContent = ({ message }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

export default PlaceholderContent;
