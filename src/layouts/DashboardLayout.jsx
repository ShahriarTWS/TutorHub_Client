import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import {
    FaUsers,
    FaUserPlus,
    FaClipboardList,
    FaBookOpen,
    FaFileUpload,
    FaBook,
    FaStickyNote,
    FaRegFileAlt,
    FaHome,
    FaBars,
    FaTimes,
} from 'react-icons/fa';
import LoadingPage from '../shared/Loading/LoadingPage';

const DashboardLayout = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const axiosSecure = useAxiosSecure();

    const { data: roleData, isLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data;
        },
    });

    const role = roleData?.role;

    const navClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${isActive ? 'bg-primary text-white' : 'hover:bg-primary/10 hover:text-primary'
        }`;

    const renderLinks = () => {
        if (role === 'admin') {
            return (
                <>
                    <NavLink to="/dashboard/view-users" className={navClass}>
                        <FaUsers className="w-5 h-5" />
                        View All Users
                    </NavLink>

                    <NavLink to="/dashboard/manage-users" className={navClass}>
                        <FaUsers className="w-5 h-5" />
                        Manage Tutors
                    </NavLink>

                    <NavLink to="/dashboard/pending-tutors" className={navClass}>
                        <FaUserPlus className="w-5 h-5" />
                        Pending Tutors
                    </NavLink>

                    <NavLink to="/dashboard/admin-view-study-sessions" className={navClass}>
                        <FaClipboardList className="w-5 h-5" />
                        View Study Sessions
                    </NavLink>

                    <NavLink to="/dashboard/admin-view-materials" className={navClass}>
                        <FaFileUpload className="w-5 h-5" />
                        View All Materials
                    </NavLink>

                </>

            );
        } else if (role === 'tutor') {
            return (
                <>
                    <NavLink to="/dashboard/view-study-sessions" className={navClass}>
                        <FaClipboardList className="w-5 h-5" />
                        My Study Sessions
                    </NavLink>
                    <NavLink to="/dashboard/create-study-session" className={navClass}>
                        <FaUserPlus className="w-5 h-5" />
                        Create Study Session
                    </NavLink>
                    <NavLink to="/dashboard/upload-materials" className={navClass}>
                        <FaFileUpload className="w-5 h-5" />
                        Upload Materials
                    </NavLink>
                    <NavLink to="/dashboard/view-materials" className={navClass}>
                        <FaBookOpen className="w-5 h-5" />
                        My Materials
                    </NavLink>
                </>
            );
        } else {
            return (
                <>
                    <NavLink to="/dashboard/booked-sessions" className={navClass}>
                        <FaClipboardList className="w-5 h-5" />
                        My Booked Sessions
                    </NavLink>
                    <NavLink to="/dashboard/create-note" className={navClass}>
                        <FaStickyNote className="w-5 h-5" />
                        Create Note
                    </NavLink>
                    <NavLink to="/dashboard/manage-notes" className={navClass}>
                        <FaRegFileAlt className="w-5 h-5" />
                        Manage Notes
                    </NavLink>
                    <NavLink to="/dashboard/study-materials" className={navClass}>
                        <FaBook className="w-5 h-5" />
                        Study Materials
                    </NavLink>
                </>
            );
        }
    };

    if (isLoading) return <LoadingPage></LoadingPage>;

    return (
        <div className="min-h-screen flex bg-base-100 text-base-content">
            {/* Sidebar for desktop */}
            <aside
                className={`fixed md:static pt-12 md:pt-0 top-0 left-0 z-40 md:z-auto w-64 h-full md:h-auto bg-base-200 shadow-md transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className="flex flex-col justify-between h-full p-4">
                    <div>
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-8 px-2">
                            <img
                                src={user?.photoURL || '/default-avatar.png'}
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                            <div>
                                <h2 className="text-base font-semibold truncate">{user?.displayName || 'Dashboard'}</h2>
                                <p className="text-xs text-gray-600 capitalize">{role || 'Loading...'}</p>
                            </div>
                        </div>

                        {/* Links */}
                        <nav className="flex flex-col gap-2">{renderLinks()}</nav>
                    </div>

                    <Link
                        to="/"
                        className="btn btn-outline mt-6 flex items-center justify-center gap-2"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaHome className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>
            </aside>

            {/* Hamburger Button (mobile) */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>

            {/* Main Content */}
            <main className="flex-1 p-6  w-full overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
