import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingShapes from '../../../shared/Loading/LoadingPage';
import { FaUserShield, FaChalkboardTeacher, FaUserGraduate, FaUsers, FaCheckCircle, FaHourglassHalf, FaBookOpen, FaStickyNote, FaFileAlt } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);

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

    const [isOpen, setIsOpen] = useState(false); // single toggle for all sections

    const tutor = tutorsData?.find(t => t.email === user.email);


    // ✅ Student-specific sessions

    const { data: notes = [], isLoading, refetch } = useQuery({
        queryKey: ['notes', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notes/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const { data: materials = [], isLoading: materialsLoading } = useQuery({
        queryKey: ['materials', expandedId, user?.email],
        enabled: !!expandedId && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/materials/session/${expandedId}/student/${user.email}`);
            return res.data;
        },
    });

    // ✅ Student-specific sessions
    const { data: payments = [], isLoading: paymentsLoading } = useQuery({
        queryKey: ['payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/payments/user/${user.email}`)).data,
    });

    const { data: allSessions = [], } = useQuery({
        queryKey: ['sessions'],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get('/sessions')).data,
    });

    const sessionIdToTitle = {};
    allSessions.forEach(s => (sessionIdToTitle[s._id] = s.title));

    const filtered = payments.filter(p => {
        const title = sessionIdToTitle[p.sessionId] || '';
        return (
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            new Date(p.date).toLocaleDateString().includes(searchTerm)
        );
    });

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
    const totalTutorSessions = tutorSessions?.length || 0;
    // ✅ Approved sessions for tutor
    const approvedTutorSessions = tutorSessions?.filter(session => session.status === 'approved').length || 0;
    // ✅ Pending sessions for tutor
    const pendingTutorSessions = tutorSessions?.filter(session => session.status === 'pending').length || 0;

    // ✅ Student counts
    const enrolledSessions = studentSessions?.length || 0;

    // ✅ Chart Data
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const adminChartData = [
        { name: 'Total Users', count: totalUsers },
        { name: 'Approved Tutors', count: approvedTutors },
        { name: 'Pending Tutors', count: pendingTutors },
        { name: 'Total Sessions', count: totalSessions },
    ];

    const tutorChartData = [
        { name: 'Total Sessions', count: totalTutorSessions },
        { name: 'Approved Sessions', count: approvedTutorSessions },
        { name: 'Pending Sessions', count: pendingTutorSessions },
    ];


    const studentChartData = [{ name: 'Booked Sessions', count: enrolledSessions }];

    return (
        <div className="mt-10 w-11/12 mx-auto text-center space-y-5">
            {/* <div className="flex justify-center">{current.icon}</div> */}
            <h1 className="text-3xl font-bold">{current.title}</h1>

            {/* Admin Stats */}
            {role === 'admin' && (
                <div className="mt-10 w-full mx-auto space-y-8">
                    <div className="bg-primary/10 rounded-3xl p-6 md:p-10 shadow-lg border border-primary/30 flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <img
                                src={profileInfo.photo}
                                alt="Admin Avatar"
                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 border-primary shadow-lg object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-2 md:space-y-3 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-primary">{profileInfo.name}</h2>
                            <p className=" flex items-center gap-2 md:text-lg">Email: {profileInfo.email}</p>
                            <p className=" flex items-center gap-2 md:text-lg">🗓 Account Created: {new Date(profileInfo.createdAt).toLocaleDateString()}</p>
                            <p className=" flex items-center gap-2 md:text-lg">🗓 Last Login: {new Date(profileInfo.lastLogin).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Admin Charts */}
                    <div className="mt-10 w-full mx-auto space-y-10 md:flex md:flex-row md:space-x-8 md:space-y-0">
                        <div className="md:flex-1">
                            <h3 className="text-xl font-bold text-primary mb-4 text-left">Admin Bar Chart</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={adminChartData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#2563EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="md:flex-1">
                            <h3 className="text-xl font-bold text-primary mb-4 ">Admin Pie Chart</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={adminChartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {adminChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Admin Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
                        <Link to="/dashboard/view-users" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-4 sm:p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaUsers className="text-3xl sm:text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-xl sm:text-2xl font-bold">{totalUsers}</h2>
                                <p className=" text-sm sm:text-base">Total Users</p>
                            </div>
                        </Link>
                        <Link to="/dashboard/manage-users" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-4 sm:p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaCheckCircle className="text-3xl sm:text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-xl sm:text-2xl font-bold">{approvedTutors}</h2>
                                <p className=" text-sm sm:text-base">Approved Tutors</p>
                            </div>
                        </Link>
                        <Link to="/dashboard/pending-tutors" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-4 sm:p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaHourglassHalf className="text-3xl sm:text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-xl sm:text-2xl font-bold">{pendingTutors}</h2>
                                <p className=" text-sm sm:text-base">Pending Tutors</p>
                            </div>
                        </Link>
                        <Link to="/dashboard/admin-view-study-sessions" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-4 sm:p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaBookOpen className="text-3xl sm:text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-xl sm:text-2xl font-bold">{totalSessions}</h2>
                                <p className=" text-sm sm:text-base">Total Study Sessions</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {/* Tutor Stats */}
            {role === 'tutor' && (
                <div className="mt-10">
                    <div className="mx-auto bg-base-100 rounded-3xl shadow-lg border border-primary/30 overflow-hidden transition-all">

                        {/* Top Section: Avatar & Basic Info */}
                        <div className="bg-primary/10 flex flex-col md:flex-row items-center p-6 md:p-10 gap-6 ">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <img
                                    src={tutor?.photo || 'https://via.placeholder.com/150'}
                                    alt="Tutor Avatar"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary shadow-lg object-cover"
                                />
                            </div>

                            {/* Name, Role & Email */}
                            <div className="flex-1 space-y-2 text-left">
                                <h2 className="text-2xl md:text-3xl font-bold">{tutor?.name || 'Tutor Name'}</h2>
                                <p className="text-primary md:text-lg">Speciality: {tutor?.speciality || 'Tutor'}</p>
                                <p className="md:text-lg flex items-center gap-2">📧 {user.email}</p>
                            </div>
                        </div>

                        {/* Dropdown Button */}
                        <div className="p-6 md:p-8 border-t border-primary/20">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full text-left text-xl md:text-2xl font-semibold text-primary flex justify-between items-center"
                            >
                                {isOpen ? 'Hide Details ▲' : 'Show Details ▼'}
                            </button>
                        </div>

                        {/* Collapsible Content */}
                        {isOpen && (
                            <div className="bg-base-100 p-6 md:p-8 border-t border-primary/20 text-left space-y-6">

                                {/* Education & Experience */}
                                <div className="space-y-4 md:space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-xl md:text-2xl font-semibold text-primary flex items-center gap-2">🎓 Education</h3>
                                        <p className="text-sm md:text-base">
                                            - {tutor?.education?.degree}, {tutor?.education?.institution} ({tutor?.education?.year})
                                        </p>
                                        <p className="text-sm md:text-base">
                                            - GPA: {tutor?.education?.gpa}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl md:text-2xl font-semibold text-primary flex items-center gap-2">🧪 Experience</h3>
                                        <p className="text-sm md:text-base">- {tutor?.experience} years</p>
                                    </div>
                                </div>

                                {/* Bio & Interests */}
                                <div>
                                    <h3 className="text-xl md:text-2xl font-semibold text-primary flex items-center gap-2">📝 Bio & Interests</h3>
                                    <p className="text-sm md:text-base mt-2 whitespace-pre-line">
                                        {tutor?.bio || 'No bio available.'}
                                    </p>
                                </div>

                                {/* LinkedIn */}
                                {tutor?.linkedin && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🔗</span>
                                        <a
                                            href={tutor.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary font-semibold hover:underline"
                                        >
                                            Connect: LinkedIn
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>




                    <div className='md:flex mt-10 gap-6'>
                        {/* Bar Chart */}
                        <div className="md:flex-1">
                            <h3 className="text-xl font-bold text-primary mb-4 text-left">Tutor Bar Chart</h3>
                            {/* Bar Chart */}
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={tutorChartData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#2563EB" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Chart */}
                        <div className="md:flex-1">
                            <h3 className="text-xl font-bold text-primary mb-4 ">Tutor Pie Chart</h3>
                            {/* Pie Chart */}
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={tutorChartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {tutorChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>



                    {/* Tutor Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <Link to="/dashboard/view-study-sessions" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaBookOpen className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{totalTutorSessions}</h2>
                                <p>Total Sessions</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/view-study-sessions" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaCheckCircle className="text-4xl text-green-600 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{approvedTutorSessions}</h2>
                                <p>Approved Sessions</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/view-study-sessions" className="block">
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border hover:shadow-xl transition">
                                <FaHourglassHalf className="text-4xl text-yellow-600 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{pendingTutorSessions}</h2>
                                <p>Pending Sessions</p>
                            </div>
                        </Link>
                    </div>


                </div>
            )}

            {/* Student Stats */}
            {role === 'student' && (
                <div className="mt-10 space-y-8">
                    <div className=" mx-auto bg-base-100 rounded-3xl shadow-lg border border-primary/30 overflow-hidden">

                        {/* Top Section: Avatar & Basic Info */}
                        <div className="bg-primary/10 flex flex-col md:flex-row items-center md:items-start p-6 gap-6">

                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <img
                                    src={profileInfo.photo || 'https://via.placeholder.com/150'}
                                    alt="Student Avatar"
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary shadow-lg object-cover"
                                />
                            </div>

                            {/* Name & Role */}
                            <div className="flex-1 flex flex-col justify-center text-left space-y-2">
                                <h2 className="text-2xl md:text-3xl font-bold text-primary">
                                    {profileInfo.name || user.displayName || 'Student Name'}
                                </h2>
                                <p className="text-gray-700 md:text-lg font-medium">Student</p>
                                <p className="flex items-center gap-2 md:text-lg">📧 {user.email}</p>
                                <p className="flex items-center gap-2 md:text-lg">
                                    🗓 Account Created: {new Date(profileInfo.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Student Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                        <Link to={'/dashboard/booked-sessions'}>
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaBookOpen className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{filtered?.length}</h2>
                                <p className="">Booked Sessions</p>
                            </div>
                        </Link>

                        <Link to={'/dashboard/manage-notes'}>
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaStickyNote className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{notes?.length}</h2>
                                <p className="">Manage Notes</p>
                            </div>
                        </Link>

                        <Link to={'/dashboard/study-materials'}>
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaFileAlt className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{materials?.length}</h2>
                                <p className="">View Study Materials</p>
                            </div>
                        </Link>

                        <Link to={'/study-sessions'}>
                            <div className="bg-primary/20 shadow-md rounded-2xl p-6 text-center border border-primary hover:shadow-xl transition">
                                <FaChalkboardTeacher className="text-4xl text-primary mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">{enrolledSessions}</h2>
                                <p className="">View All Sessions</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHome;
