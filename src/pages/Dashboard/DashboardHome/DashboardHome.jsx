import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingShapes from '../../../shared/Loading/LoadingPage';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaUsers, FaCheckCircle, FaHourglassHalf, FaBookOpen } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const DashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // ✅ Fetch user role
    const { data: roleData, isLoading: roleLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data;
        },
    });
    const role = roleData?.role;

    // ✅ Admin queries
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users-count'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/users', { params: { page: 1, limit: 1 } });
            return res.data;
        },
        enabled: role === 'admin',
    });

    const { data: tutorsData, isLoading: tutorsLoading } = useQuery({
        queryKey: ['all-tutors'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tutors/all');
            return res.data;
        },
        enabled: role === 'admin' || role === 'tutor',
    });

    const { data: pendingTutorsData, isLoading: pendingLoading } = useQuery({
        queryKey: ['pending-tutors'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tutors?status=pending');
            return res.data;
        },
        enabled: role === 'admin',
    });

    const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
        queryKey: ['admin-sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/sessions');
            return res.data;
        },
        enabled: role === 'admin',
    });

    // ✅ Tutor-specific sessions
    const { data: tutorSessions = [], isLoading: tutorSessionsLoading } = useQuery({
        queryKey: ['tutor-sessions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions', { params: { tutorEmail: user.email } });
            return res.data;
        },
        enabled: role === 'tutor' && !!user?.email,
    });

    // ✅ Student-specific sessions
    const { data: studentSessions = [], isLoading: studentSessionsLoading } = useQuery({
        queryKey: ['student-sessions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions', { params: { studentEmail: user.email } });
            return res.data;
        },
        enabled: role === 'student' && !!user?.email,
    });

    if (roleLoading || usersLoading || tutorsLoading || pendingLoading || sessionsLoading || tutorSessionsLoading || studentSessionsLoading) {
        return <LoadingShapes />;
    }

    // ✅ Role Info
    const roleInfo = {
        admin: {
            icon: <FaUserShield className="text-5xl text-purple-600" />,
            title: '👑 Welcome to the Admin Dashboard',
            description: 'Manage users, approve tutors and sessions, and maintain the platform.',
        },
        tutor: {
            icon: <FaChalkboardTeacher className="text-5xl text-green-600" />,
            title: '📚 Welcome to the Tutor Dashboard',
            // description: 'Create and manage study sessions, upload materials, and assist students.',
        },
        student: {
            icon: <FaUserGraduate className="text-5xl text-blue-600" />,
            title: '🎓 Welcome to the Student Dashboard',
            description: 'Enroll in study sessions and track your booked sessions.',
        },
    };
    const current = roleInfo[role] || {};

    // ✅ Firebase user info
    const profileInfo = {
        name: user?.displayName || 'User',
        email: user?.email,
        createdAt: user?.metadata?.creationTime,
        lastLogin: user?.metadata?.lastSignInTime,
        photo: user?.photoURL || 'https://via.placeholder.com/150',
    };

    // ✅ Admin counts
    const totalUsers = usersData?.total || 0;
    const approvedTutors = tutorsData?.filter(t => t.status === 'approved').length || 0;
    const pendingTutors = pendingTutorsData?.length || 0;
    const totalSessions = sessionsData?.length || 0;

    // ✅ Tutor counts
    const mySessions = tutorSessions?.length || 0;

    // ✅ Student counts
    const enrolledSessions = studentSessions?.length || 0;

    return (
        <div className="mt-10 text-center space-y-5">
            <div className="flex justify-center">{current.icon}</div>
            <h1 className="text-3xl font-bold">{current.title}</h1>
            {/* <p className="text-gray-600 text-lg max-w-xl mx-auto">{current.description}</p>
            <p className="text-sm text-gray-400">
                Logged in as: <span className="font-semibold capitalize">{role}</span>
            </p> */}

            {/* Admin Stats */}
            {role === 'admin' && (
                <div className="mt-10 w-11/12 mx-auto space-y-8">
                    <div className="bg-primary/10 rounded-3xl p-6 md:p-10 shadow-lg border border-primary/30 flex flex-col md:flex-row gap-8">

                        {/* Avatar */}
                        <div className="flex-shrink-0 relative">
                            <img
                                src={profileInfo.photo}
                                alt="Admin Avatar"
                                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-primary shadow-lg object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-3 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-primary">{profileInfo.name}</h2>
                            <p className="text-gray-700"><strong>Email:</strong> {profileInfo.email}</p>
                            <p className="text-gray-700"><strong>Account Created:</strong> {new Date(profileInfo.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-700"><strong>Last Login:</strong> {new Date(profileInfo.lastLogin).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Admin Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        <Link to="/dashboard/view-users" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaUsers className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{totalUsers}</h2>
                                <p className="text-gray-700">Total Users</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/manage-users" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaCheckCircle className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{approvedTutors}</h2>
                                <p className="text-gray-700">Approved Tutors</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/pending-tutors" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaHourglassHalf className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{pendingTutors}</h2>
                                <p className="text-gray-700">Pending Tutors</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/admin-view-study-sessions" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaBookOpen className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{totalSessions}</h2>
                                <p className="text-gray-700">Total Study Sessions</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {/* Tutor Stats */}
            {role === 'tutor' && (
                <div className="mt-10 px-4 md:px-10 space-y-8">
                    <div className="mt-10 bg-primary/10 rounded-3xl p-6 md:p-10 shadow-lg border border-primary/30 flex flex-col md:flex-row gap-8">

                        {/* Avatar */}
                        <div className="flex-shrink-0 relative">
                            <img
                                src={tutorsData?.find(t => t.email === user.email)?.photo || 'https://via.placeholder.com/150'}
                                alt="Tutor Avatar"
                                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-primary shadow-lg object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-3 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-primary">{tutorsData?.find(t => t.email === user.email)?.name || 'Tutor Name'}</h2>
                            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                            <p className="text-gray-700"><strong>Speciality:</strong> {tutorsData?.find(t => t.email === user.email)?.speciality}</p>
                            <p className="text-gray-700"><strong>Experience:</strong> {tutorsData?.find(t => t.email === user.email)?.experience} years</p>

                            {/* Education */}
                            <div className="bg-white/50 p-4 rounded-xl shadow-sm border border-primary/20">
                                <h3 className="text-xl font-semibold text-primary mb-2">Education</h3>
                                <p><strong>Degree:</strong> {tutorsData?.find(t => t.email === user.email)?.education?.degree}</p>
                                <p><strong>Institution:</strong> {tutorsData?.find(t => t.email === user.email)?.education?.institution}</p>
                                <p><strong>Year:</strong> {tutorsData?.find(t => t.email === user.email)?.education?.year}</p>
                                <p><strong>GPA:</strong> {tutorsData?.find(t => t.email === user.email)?.education?.gpa}</p>
                            </div>

                            {/* Bio */}
                            <div className="bg-white/50 p-4 rounded-xl shadow-sm border border-primary/20">
                                <h3 className="text-xl font-semibold text-primary mb-2">Bio & Interests</h3>
                                <p className="text-gray-700 text-sm whitespace-pre-line">
                                    {tutorsData?.find(t => t.email === user.email)?.bio}
                                </p>
                            </div>

                            {/* LinkedIn */}
                            <a
                                href={tutorsData?.find(t => t.email === user.email)?.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2 text-primary font-semibold hover:underline"
                            >
                                Connect on LinkedIn
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                        <Link to="/dashboard/view-study-sessions" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaBookOpen className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{mySessions}</h2>
                                <p className="text-gray-700">My Study Sessions</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {/* Student Stats */}
            {role === 'student' && (
                <div className="mt-10 px-4 md:px-10 space-y-8">
                    <div className="bg-primary/10 rounded-3xl p-6 md:p-10 shadow-lg border border-primary/30 flex flex-col md:flex-row gap-8">

                        {/* Avatar */}
                        <div className="flex-shrink-0 relative">
                            <img
                                src={profileInfo.photo}
                                alt="Student Avatar"
                                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-primary shadow-lg object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-3 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-primary">{user.displayName || profileInfo.name}</h2>
                            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                            <p className="text-gray-700"><strong>Account Created:</strong> {new Date(profileInfo.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Student Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                        <Link to={'/dashboard/booked-sessions'}>
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaBookOpen className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{enrolledSessions}</h2>
                                <p className="text-gray-700">Booked Sessions</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
