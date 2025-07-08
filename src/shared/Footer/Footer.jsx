import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router';

const RedesignedFooter = () => {
    return (
        <footer className="bg-base-200 border-t border-base-300 text-base-content">
            <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-primary mb-4">TutorHub</h2>
                    <p className="text-sm leading-relaxed mb-4">Your collaborative education partner — where students and tutors meet, learn, and grow together.</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Mail size={16} /> support@tutorhub.com
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} /> +880 123 456 789
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} /> Dhaka, Bangladesh
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-primary transition-all">Home</Link></li>
                        <li><Link to="/study-sessions" className="hover:text-primary transition-all">Study Sessions</Link></li>
                        <li><Link to="/tutor" className="hover:text-primary transition-all">Tutors</Link></li>
                        <li><Link to="/dashboard" className="hover:text-primary transition-all">Dashboard</Link></li>
                        <li><Link to="/services" className="hover:text-primary transition-all">Our Services</Link></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Connect with Us</h3>
                    <div className="flex gap-4 text-sm">
                        <a href="#" className="hover:text-primary"><Facebook size={20} /></a>
                        <a href="#" className="hover:text-primary"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-primary"><Linkedin size={20} /></a>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                        Follow us for updates, events, and learning tips!
                    </p>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                    <p className="text-sm mb-3">Get weekly updates on new study sessions, features, and more.</p>
                    <form className="relative w-full">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="input input-bordered w-full pr-10 text-sm"
                        />
                        <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-primary">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-base-300 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} TutorHub. Crafted with 💙 for collaborative learning.
            </div>
        </footer>
    );
};

export default RedesignedFooter;
