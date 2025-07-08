import React from 'react';
import {
    BookOpen,
    Users,
    ClipboardList,
    UploadCloud,
    CalendarCheck,
    ShieldCheck,
} from 'lucide-react';

const services = [
    {
        id: 1,
        icon: <BookOpen size={48} className="text-primary" />,
        title: 'Study Sessions',
        description: 'Join and participate in approved study sessions curated by expert tutors.',
    },
    {
        id: 2,
        icon: <Users size={48} className="text-primary" />,
        title: 'Tutor Collaboration',
        description: 'Connect with tutors and collaborate on interactive study materials.',
    },
    {
        id: 3,
        icon: <ClipboardList size={48} className="text-primary" />,
        title: 'Personal Notes',
        description: 'Create, manage, and organize your own study notes seamlessly.',
    },
    {
        id: 4,
        icon: <UploadCloud size={48} className="text-primary" />,
        title: 'Upload Materials',
        description: 'Tutors can upload study materials and Google Drive links for easy access.',
    },
    {
        id: 5,
        icon: <CalendarCheck size={48} className="text-primary" />,
        title: 'Booking & Scheduling',
        description: 'Book sessions effortlessly and keep track of your study schedules.',
    },
    {
        id: 6,
        icon: <ShieldCheck size={48} className="text-primary" />,
        title: 'Secure Authentication',
        description: 'Role-based secure login using JWT and social authentication providers.',
    },
];

const OurServices = () => {
    return (
        <section className="md:w-10/12 w-11/12 mx-auto py-16">
            <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(({ id, icon, title, description }) => (
                    <div
                        key={id}
                        className="bg-base-200 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                    >
                        <div className="mb-4">{icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{title}</h3>
                        <p className="text-gray-500">{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurServices;
