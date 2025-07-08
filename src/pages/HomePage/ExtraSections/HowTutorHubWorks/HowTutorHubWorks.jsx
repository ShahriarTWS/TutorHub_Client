import React from 'react';
import { BookOpenCheck, Users2, CalendarCheck, CheckCircle2 } from 'lucide-react';

const HowTutorHubWorks = () => {
    const steps = [
        {
            icon: <Users2 size={32} className="text-primary" />,
            title: 'Create Your Account',
            description: 'Sign up as a student, tutor, or admin. Use email or social login to get started.',
        },
        {
            icon: <BookOpenCheck size={32} className="text-primary" />,
            title: 'Explore Study Sessions',
            description: 'Browse available sessions, check tutor profiles, and join based on your interests.',
        },
        {
            icon: <CalendarCheck size={32} className="text-primary" />,
            title: 'Book & Attend',
            description: 'Book your preferred session. Join live classes and access study materials anytime.',
        },
        {
            icon: <CheckCircle2 size={32} className="text-primary" />,
            title: 'Review & Collaborate',
            description: 'Rate sessions, post reviews, share notes, and engage with other students.',
        },
    ];

    return (
        <section className="py-16 bg-base-100">
            <div className="md:w-10/12 w-11/12 mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">How TutorHub Works</h2>
                <p className="text-gray-500 mb-12">A simple process for impactful learning</p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-xl shadow hover:shadow-lg transition duration-300 bg-base-200 border border-base-300"
                        >
                            <div className="mb-4 flex justify-center">{step.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowTutorHubWorks;
