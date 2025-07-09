import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import useAuth from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

// React Icons import
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
} from 'react-icons/fa';

const DashboardLayout = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const axiosSecure = useAxiosSecure();

    const { data: roleData, isLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data; // { role: 'admin' | 'tutor' | 'student' }
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
                    <NavLink to="/dashboard/manage-users" className={navClass}>
                        <FaUsers className="w-5 h-5" />
                        Manage Users
                    </NavLink>
                    <NavLink to="/dashboard/view-study-sessions" className={navClass}>
                        <FaClipboardList className="w-5 h-5" />
                        View All Study Sessions
                    </NavLink>
                    <NavLink to="/dashboard/view-materials" className={navClass}>
                        <FaFileUpload className="w-5 h-5" />
                        View All Materials
                    </NavLink>
                </>
            );
        } else if (role === 'tutor') {
            return (
                <>
                    <NavLink to="/dashboard/create-study-session" className={navClass}>
                        <FaUserPlus className="w-5 h-5" />
                        Create Study Session
                    </NavLink>
                    <NavLink to="/dashboard/view-study-sessions" className={navClass}>
                        <FaClipboardList className="w-5 h-5" />
                        My Study Sessions
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
            // student
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

    if (isLoading) {
        return <div className="text-center py-20">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen flex bg-base-100 text-base-content">
            {/* Sidebar */}
            <aside className="w-64 bg-base-200 p-5 flex flex-col justify-between">
                <div>
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-8 px-4">
                        <img
                            src={user?.photoURL || '/default-avatar.png'}
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                        <div>
                            <h2 className="text-lg font-semibold truncate">{user?.displayName || 'Dashboard'}</h2>
                            <p className="text-sm text-gray-600 capitalize">{role || 'Loading...'}</p>
                        </div>
                    </div>

                    {/* Role-based Nav */}
                    <nav className="flex flex-col gap-2">{renderLinks()}</nav>
                </div>

                {/* Footer Button */}
                <Link
                    to="/"
                    className="btn btn-outline mt-6 flex items-center justify-center gap-2"
                >
                    <FaHome className="w-5 h-5" />
                    Back to Home
                </Link>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
