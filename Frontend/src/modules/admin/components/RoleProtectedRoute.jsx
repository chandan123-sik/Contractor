import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    const userRole = localStorage.getItem('adminRole');
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to unauthorized page or dashboard if role is not allowed
        // Ideally, this should go to a "403 Unauthorized" page, 
        // but for now, let's redirect to the main dashboard or show an alert/message.
        // However, if the user is ALREADY at the dashboard and receives this, it might cause a loop 
        // if the dashboard itself is protected (which it acts as a layout).

        // Strategy: 
        // If the user tries to access a specific module (e.g., /users), and they are not allowed,
        // redirect them to their allowed dashboard home.
        return <Navigate to="/admin/dashboard/home" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
