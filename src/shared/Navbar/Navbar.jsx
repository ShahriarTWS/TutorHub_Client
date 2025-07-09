import React, { useEffect, useState } from 'react';
import LearnTogetherLogo from '../LearnTogetherLogo/LearnTogetherLogo';
import { Link, NavLink } from 'react-router'; // Use react-router-dom here
import {
    FaHome,
    FaChalkboardTeacher,
    FaBookOpen,
    FaSignOutAlt,
    FaTachometerAlt,
    FaUserCircle,
    FaSun,
    FaMoon,
} from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logOut } = useAuth();

    const handleLogout = () => {
        logOut()
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            });
        console.log('Logging out...');
    };

    const navLinks = (
        <>
            <li>
                <NavLink to="/" className="flex items-center text-base gap-2">
                    <FaHome className="inline lg:hidden" />
                    <span>Home</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/tutor" className="flex items-center text-base gap-2">
                    <FaChalkboardTeacher className="inline lg:hidden" />
                    <span>Tutor</span>
                </NavLink>
            </li>
            <li>
                <NavLink to="/study-sessions" className="flex items-center text-base gap-2">
                    <FaBookOpen className="inline lg:hidden" />
                    <span>Study Sessions</span>
                </NavLink>
            </li>
        </>
    );

    const [theme, setTheme] = useState('light');
    const [manualTheme, setManualTheme] = useState(false); // track if user toggled theme manually

    // Initialize theme on mount and add system theme listener
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
            setManualTheme(true);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const defaultTheme = prefersDark ? 'dark' : 'light';
            setTheme(defaultTheme);
            document.documentElement.setAttribute('data-theme', defaultTheme);
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const systemThemeChangeHandler = (e) => {
            if (!manualTheme) {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        };

        mediaQuery.addEventListener('change', systemThemeChangeHandler);

        return () => {
            mediaQuery.removeEventListener('change', systemThemeChangeHandler);
        };
    }, [manualTheme]);

    // Theme toggle handler
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setManualTheme(true);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div>
            <div className="navbar md:w-10/12 w-11/12 mx-auto p-3 rounded-2xl bg-base-200/80 backdrop-blur-md ">

                <div className="navbar-start">
                    {/* Mobile device */}
                    <LearnTogetherLogo />
                </div>

                {/* large device */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-base">{navLinks}</ul>
                </div>

                {/* Right side (profile or login + theme toggle) */}
                <div className="navbar-end flex items-center gap-3">
                    {/* Theme toggle button */}
                    <button
                        onClick={toggleTheme}
                        className="btn btn-ghost btn-circle"
                        aria-label="Toggle Dark Mode"
                        title="Toggle Dark Mode"
                    >
                        {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
                    </button>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={user.photoURL} alt="User Profile" />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="mt-3 z-50 p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                            >
                                <li className="mb-1 text-center font-bold flex items-center justify-center gap-1">
                                    <FaUserCircle /> {user.displayName}
                                </li>

                                {/* Mobile navLinks inside dropdown */}
                                <div className="lg:hidden">{navLinks}</div>

                                <li>
                                    <Link to="/dashboard" className="flex items-center text-base gap-2">
                                        <FaTachometerAlt className="inline lg:hidden" />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center text-base gap-2">
                                        <FaSignOutAlt className="inline lg:hidden" />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
