import React from 'react';
import { Link } from 'react-router';
import { GraduationCap } from 'lucide-react';
import tutorIllustration from '../../assets/banner/tutorimg.svg';

const BeTutorCard = () => {
    return (
        <div className="md:w-10/12 w-11/12 mx-auto bg-base-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col-reverse md:flex-row items-center px-6 py-8 md:py-12 md:px-12 gap-8 hover:shadow-3xl transition-all duration-300 my-20">

            {/* Left content: Text and button */}
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 text-primary md:text-4xl xl:text-5xl font-extrabold">
                    <GraduationCap size={42} className="text-gradient" />
                    <span className="bg-clip-text text-transparent bg-primary">
                        Be a Tutor
                    </span>
                </div>
                <p className=" text-base md:text-lg leading-relaxed">
                    Share your expertise, guide students, and earn recognition. Empower learners by becoming a valued tutor on our platform today!
                </p>
                <Link to="/become-tutor">
                    <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 hover:scale-105 transition-transform duration-300 font-semibold shadow-md">
                        Join as Tutor
                    </button>
                </Link>
            </div>

            {/* Right illustration */}
            <div className="w-full md:w-1/2 flex justify-center">
                <img
                    src={tutorIllustration}
                    alt="Be a Tutor Illustration"
                    className="w-full max-w-md object-contain hover:scale-105 transition-transform duration-500"
                />
            </div>
        </div>
    );
};

export default BeTutorCard;
