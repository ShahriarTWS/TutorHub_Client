import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, GithubIcon } from 'lucide-react';
import { NavLink } from 'react-router'; // ✅ Fixed import
import { FaBookOpen, FaChalkboardTeacher, FaHome, FaTachometerAlt } from 'react-icons/fa';

const Footer = () => {
    const navLinks = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center gap-2 py-1 transition-colors ${
                            isActive ? 'text-primary font-semibold' : 'hover:text-primary'
                        }`
                    }
                >
                    <FaHome className="text-lg" />
                    <span>Home</span>
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/tutors"
                    className={({ isActive }) =>
                        `flex items-center gap-2 py-1 transition-colors ${
                            isActive ? 'text-primary font-semibold' : 'hover:text-primary'
                        }`
                    }
                >
                    <FaChalkboardTeacher className="text-lg" />
                    <span>Tutors</span>
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/study-sessions"
                    className={({ isActive }) =>
                        `flex items-center gap-2 py-1 transition-colors ${
                            isActive ? 'text-primary font-semibold' : 'hover:text-primary'
                        }`
                    }
                >
                    <FaBookOpen className="text-lg" />
                    <span>Study Sessions</span>
                </NavLink>
            </li>

            <li>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-2 py-1 transition-colors ${
                            isActive ? 'text-primary font-semibold' : 'hover:text-primary'
                        }`
                    }
                >
                    <FaTachometerAlt className="text-lg" />
                    <span>Dashboard</span>
                </NavLink>
            </li>
        </>
    );

    return (
        <footer className="bg-base-200 text-base-content">
            <div className="md:w-10/12 w-11/12 mx-auto py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

                {/* Brand Info */}
                <div>
                    <h2 className="text-5xl font-bold text-primary mb-4">TutorHub</h2>
                    <p className="text-sm  leading-relaxed mb-4">
                        Your collaborative education partner —<br /> where students and tutors meet, learn, and grow together.
                    </p>
                    <div className="space-y-2 text-sm ">
                        <div className="flex items-center gap-2">
                            <Mail size={16} /> support@tutorhub.com
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} /> +880 123 456 789
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} /> Rajshahi, Bangladesh
                        </div>
                    </div>
                </div>

                {/* Quick Navigation */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Quick Links</h3>
                    <ul className="space-y-2 text-sm">{navLinks}</ul>
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-primary">Follow Us</h3>
                    <div className="flex gap-4 ">
                        <a href="https://www.facebook.com/snjoy.420" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
                        <a href="https://github.com/ShahriarTWS" className="hover:text-primary transition-colors"><GithubIcon size={20} /></a>
                        <a href="https://www.linkedin.com/in/snjoy420" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
                    </div>
                    <p className="text-xs  mt-4">
                        Join us for updates, tips, and events.
                    </p>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-base-300 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} <span className="text-primary font-semibold">TutorHub</span>. Crafted with 💙 for collaborative learning.
            </div>
        </footer>
    );
};

export default Footer;
