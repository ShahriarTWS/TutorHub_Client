import React from 'react';
import { Link } from 'react-router';
import { GraduationCap } from 'lucide-react'; // Icon from lucide-react
import tutorIllustration from '../../assets/banner/gummy-app-development.svg'; // Replace with your actual path

const BeTutorCard = () => {
    return (
        <div className="md:w-10/12 w-11/12 mx-auto bg-base-200 shadow-xl rounded-2xl overflow-hidden flex flex-col-reverse md:flex-row items-center px-6 py-6 md:py-0 md:px-10 gap-6 md:gap-10 hover:shadow-2xl transition-all duration-300 my-16">

            {/* Left content: Text and button */}
            <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary text-2xl md:text-3xl lg:text-5xl font-semibold">
                    <GraduationCap size={40} /> Be a Tutor
                </div>
                <p className="text-gray-600 text-base md:text-lg">
                    Share your expertise, guide students, and earn recognition. Empower learners by becoming a valued tutor on our platform today!
                </p>
                <Link to="/become-tutor">
                    <button className="btn btn-primary px-6 py-2 mt-2 hover:scale-105 transition-transform duration-300">
                        Join as Tutor
                    </button>
                </Link>
            </div>

            {/* Right illustration */}
            <div className="w-full md:w-1/2 flex justify-center">
                <img
                    src={tutorIllustration}
                    alt="Be a Tutor Illustration"
                    className="w-full h-full  object-contain hover:scale-105 transition-transform duration-300"
                />
            </div>
        </div>
    );
};

export default BeTutorCard;
