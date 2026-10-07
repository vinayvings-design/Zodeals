import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem('token') ? true : false;
    const userRole = localStorage.getItem('role');

    if (!isLoggedIn) {
        return <Navigate 
            to="/" 
            replace 
            state={{ from: location.pathname, message: 'You must be logged in to access this page.' }} 
        />;
    }

    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
        return <Navigate 
            to="/"
            replace 
            state={{ from: location.pathname, message: 'You do not have the required permissions to view this page.' }} 
        />;
    }

    return <Outlet />;
};

export default ProtectedRoute;