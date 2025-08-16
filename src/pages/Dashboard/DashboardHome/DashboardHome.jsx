import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingShapes from '../../../shared/Loading/LoadingPage';
import {
    FaUserShield,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaUsers,
    FaCheckCircle,
    FaHourglassHalf,
    FaBookOpen
} from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';

const DashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // ✅ Fetch role
    const { data: roleData, isLoading: roleLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data;
        },
    });

    const role = roleData?.role;

    // ✅ Admin Queries
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ['admin-users-count'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/users', {
                params: { page: 1, limit: 1 }
            });
            return res.data;
        },
        enabled: role === 'admin'
    });

    const { data: tutorsData, isLoading: tutorsLoading } = useQuery({
        queryKey: ['all-tutors'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tutors/all');
            return res.data;
        },
        enabled: role === 'admin' || role === 'tutor'
    });

    const { data: pendingTutorsData, isLoading: pendingLoading } = useQuery({
        queryKey: ['pending-tutors'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tutors?status=pending');
            return res.data;
        },
        enabled: role === 'admin'
    });

    const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
        queryKey: ['admin-sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/sessions');
            return res.data;
        },
        enabled: role === 'admin'
    });

    // ✅ Tutor-specific sessions
    const { data: tutorSessions = [], isLoading: tutorSessionsLoading } = useQuery({
        queryKey: ['tutor-sessions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions', {
                params: { tutorEmail: user.email }
            });
            return res.data;
        },
        enabled: role === 'tutor' && !!user?.email,
    });

    // ✅ Student-specific sessions
    const { data: studentSessions = [], isLoading: studentSessionsLoading } = useQuery({
        queryKey: ['student-sessions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions', {
                params: { studentEmail: user.email }
            });
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
            description: 'Create and manage study sessions, upload materials, and assist students.',
        },
        student: {
            icon: <FaUserGraduate className="text-5xl text-blue-600" />,
            title: '🎓 Welcome to the Student Dashboard',
            description: 'Enroll in study sessions, download materials, and leave feedback.',
        },
    };

    const current = roleInfo[role] || {};

    // ✅ Firebase user info
    const profileInfo = {
        name: user?.displayName || 'User',
        email: user?.email,
        createdAt: user?.metadata?.creationTime,
        lastLogin: user?.metadata?.lastSignInTime,
        photo: user?.photoURL || 'https://via.placeholder.com/150'
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
            <p className="text-gray-600 text-lg max-w-xl mx-auto">{current.description}</p>
            <p className="text-sm text-gray-400">
                Logged in as: <span className="font-semibold capitalize">{role}</span>
            </p>



            {/* Admin Stats */}
            {role === 'admin' && (
                <div>
                    {/* Profile Info */}
                    <div className="mt-10 px-4 md:px-10">
                        <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
                            <div className="flex-shrink-0">
                                <img
                                    src={profileInfo.photo}
                                    alt="Avatar"
                                    className="w-36 h-36 rounded-2xl object-cover shadow-md border"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-3">
                                <h2 className="text-2xl font-bold text-gray-800">{profileInfo.name}</h2>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Email:</span> {profileInfo.email}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Account Created:</span>{" "}
                                    {new Date(profileInfo.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Last Login:</span>{" "}
                                    {new Date(profileInfo.lastLogin).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/dashboard/view-users" className="block">
                            <div className="bg-purple-50 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaUsers className="text-4xl text-purple-600 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{totalUsers}</h2>
                                <p className="text-gray-600">Total Users</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/manage-users" className="block">
                            <div className="bg-green-50 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaCheckCircle className="text-4xl text-green-600 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{approvedTutors}</h2>
                                <p className="text-gray-600">Approved Tutors</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/pending-tutors" className="block">
                            <div className="bg-yellow-50 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaHourglassHalf className="text-4xl text-yellow-600 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{pendingTutors}</h2>
                                <p className="text-gray-600">Pending Tutors</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/admin-view-study-sessions" className="block">
                            <div className="bg-blue-50 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaBookOpen className="text-4xl text-blue-600 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{totalSessions}</h2>
                                <p className="text-gray-600">Total Study Sessions</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {/* Tutor Profile Info */}
            {role === 'tutor' && (
                <div className="mt-10 px-4 md:px-10 space-y-8">

                    {/* Full Tutor Profile */}
                    <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
                        <div className="flex-shrink-0">
                            <img
                                src={tutorsData?.find(t => t.email === user.email)?.photo || profileInfo.photo}
                                alt="Tutor Avatar"
                                className="w-36 h-36 rounded-2xl object-cover shadow-md border"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <h2 className="text-2xl font-bold text-gray-800">{user.displayName || tutorsData?.find(t => t.email === user.email)?.name}</h2>
                            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                            <p className="text-gray-600"><strong>Experience:</strong> {tutorsData?.find(t => t.email === user.email)?.experience} years</p>
                            <p className="text-gray-600"><strong>Speciality:</strong> {tutorsData?.find(t => t.email === user.email)?.speciality}</p>
                            <p className="text-gray-600"><strong>Degree:</strong> {tutorsData?.find(t => t.email === user.email)?.education?.degree}</p>
                            <p className="text-gray-600"><strong>Institution:</strong> {tutorsData?.find(t => t.email === user.email)?.education?.institution}</p>
                            <p className="text-gray-600"><strong>Passing Year:</strong> {tutorsData?.find(t => t.email === user.email)?.education?.year}</p>
                            <p className="text-gray-600"><strong>GPA:</strong> {tutorsData?.find(t => t.email === user.email)?.education?.gpa}</p>
                            <p className="text-gray-600"><strong>Bio:</strong> {tutorsData?.find(t => t.email === user.email)?.bio}</p>
                            {tutorsData?.find(t => t.email === user.email)?.linkedin && (
                                <p>
                                    <strong>LinkedIn:</strong>{' '}
                                    <a
                                        href={tutorsData.find(t => t.email === user.email).linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="link link-primary"
                                    >
                                        View Profile
                                    </a>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tutor Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <Link to="/dashboard/my-sessions" className="block">
                            <div className="bg-green-50 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaBookOpen className="text-4xl text-green-600 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{mySessions}</h2>
                                <p className="text-gray-600">My Study Sessions</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}


            {/* Student Stats */}
            {role === 'student' && (
                <div className="mt-10 px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/dashboard/enrolled-sessions" className="block">
                        <div className="bg-blue-50 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                            <FaBookOpen className="text-4xl text-blue-600 mx-auto mb-2" />
                            <h2 className="text-2xl font-bold">{enrolledSessions}</h2>
                            <p className="text-gray-600">Enrolled Sessions</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
