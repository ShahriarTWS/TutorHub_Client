import React from 'react';
import { UserCheck, MessageCircle, Clock } from 'lucide-react';

const WhyJoin = () => (
    <section className="max-w-7xl mx-auto p-6 mt-20">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Why Join Our Study Sessions?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center gap-4">
                <UserCheck className="w-12 h-12 text-indigo-600" />
                <h3 className="text-xl font-semibold mb-3">Expert Tutors</h3>
                <p className="text-gray-700">
                    Learn from experienced tutors who guide you through tough concepts.
                </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center gap-4">
                <MessageCircle className="w-12 h-12 text-indigo-600" />
                <h3 className="text-xl font-semibold mb-3">Interactive Learning</h3>
                <p className="text-gray-700">
                    Engage in live discussions and collaborative problem-solving.
                </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center gap-4">
                <Clock className="w-12 h-12 text-indigo-600" />
                <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
                <p className="text-gray-700">
                    Join sessions anytime, anywhere with our accessible online platform.
                </p>
            </div>
        </div>
    </section>
);

export default WhyJoin;
