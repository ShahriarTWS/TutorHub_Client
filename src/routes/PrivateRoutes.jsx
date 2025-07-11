import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import LoadingPage from '../shared/Loading/LoadingPage';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingPage></LoadingPage>
    }

    if (!user) {
        return <Navigate state={{ from: location.pathname }} to={'/login'} ></Navigate >
    }

    return children;
};

export default PrivateRoutes;