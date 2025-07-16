// src/pages/Dashboard/DashboardHome.jsx
import React from 'react';

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingShapes from '../../../shared/Loading/LoadingPage';


const DashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: roleData, isLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data;
        },
    });

    if (isLoading) return <LoadingShapes></LoadingShapes>;

    const role = roleData?.role;

    return (
        <div className="mt-10 text-center space-y-3">
            <h1 className="text-3xl font-bold">
                {role === 'admin' && '👑 Welcome to the Admin Dashboard'}
                {role === 'tutor' && '📚 Welcome to the Tutor Dashboard'}
                {role === 'student' && '🎓 Welcome to the Student Dashboard'}
            </h1>
            <p className="text-gray-600 text-lg">
                You are logged in as <span className="font-semibold capitalize">{role}</span>.
            </p>
        </div>
    );
};

export default DashboardHome;
