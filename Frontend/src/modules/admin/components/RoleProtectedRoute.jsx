import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    const adminToken = localStorage.getItem('adminToken');
    const userRole = localStorage.getItem('adminRole');
    const location = useLocation();

    // Validate token exists and is not empty
    if (!isAuthenticated || !adminToken || adminToken === 'null' || adminToken === 'undefined') {
        console.log('🚫 RoleProtectedRoute: No valid authentication found');
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Validate role if required
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log('🚫 RoleProtectedRoute: Role not allowed:', userRole);
        return <Navigate to="/admin/dashboard/home" replace />;
    }

    console.log('✅ RoleProtectedRoute: Access granted for role:', userRole);
    return children;
};

export default RoleProtectedRoute;
