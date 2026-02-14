import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem('access_token');

    if (!isAuthenticated) {
        // Redirect to get-started if not authenticated
        return <Navigate to="/get-started" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
