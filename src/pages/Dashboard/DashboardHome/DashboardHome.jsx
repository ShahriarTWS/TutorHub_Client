import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingShapes from '../../../shared/Loading/LoadingPage';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

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

    if (isLoading) return <LoadingShapes />;

    const role = roleData?.role;

    const roleInfo = {
        admin: {
            icon: <FaUserShield className="text-5xl text-purple-600" />,
            title: '👑 Welcome to the Admin Dashboard',
            description: 'Manage users, approve tutors and sessions, and maintain the platform.',
        },
        tutor: {
            icon: <FaChalkboardTeacher className="text-5xl text-green-600" />,
            title: '📚 Welcome to the Tutor Dashboard',
            description: 'Create and manage study sessions, upload materials, and assist students.',
        },
        student: {
            icon: <FaUserGraduate className="text-5xl text-blue-600" />,
            title: '🎓 Welcome to the Student Dashboard',
            description: 'Enroll in study sessions, download materials, and leave feedback.',
        },
    };

    const current = roleInfo[role] || {};

    return (
        <div className="mt-10 text-center space-y-5">
            <div className="flex justify-center">{current.icon}</div>
            <h1 className="text-3xl font-bold">{current.title}</h1>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">{current.description}</p>
            <p className="text-sm text-gray-400">Logged in as: <span className="font-semibold capitalize">{role}</span></p>
        </div>
    );
};

export default DashboardHome;
