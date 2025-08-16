import React from 'react';
import bimg from '../../../assets/banner/bimg.jpg';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

const Banner = () => {
    return (
        <section
            className="relative min-h-screen -mt-15 flex items-center justify-center"
            style={{
                backgroundImage: `url(${bimg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

            {/* Content */}
            <div className="relative text-center px-6 text-white">
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg"
                >
                    Learn Anytime, Anywhere
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-md"
                >
                    Join interactive study sessions with top tutors
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8"
                >
                    <Link to={'/study-sessions'}>
                        <button className="px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl text-lg font-semibold shadow-lg transition-transform hover:scale-105">
                            Get Started
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;
