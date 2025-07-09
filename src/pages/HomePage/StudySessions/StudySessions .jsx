import React from 'react';
import StudySessionCard from './StudySessionCard';


const sessions = [
    {
        id: 1,
        title: 'Math Fundamentals',
        description: 'Join our interactive math study group to master algebra and geometry.',
        registrationDeadline: '2025-07-15T23:59:59',
        image: 'mathImg',
    },
    {
        id: 2,
        title: 'Physics Mechanics',
        description: 'Explore the basics of mechanics through live sessions and practice problems.',
        registrationDeadline: '2025-07-05T23:59:59',
        image: 'physicsImg',
    },
    {
        id: 3,
        title: 'Chemistry Organic',
        description: 'Understand organic chemistry concepts with expert tutors.',
        registrationDeadline: '2025-07-20T23:59:59',
        image: 'chemistryImg',
    },
    {
        id: 4,
        title: 'English Literature',
        description: 'Dive into classic and modern literature in a collaborative environment.',
        registrationDeadline: '2025-07-01T23:59:59',
        image: 'literatureImg',
    },
    {
        id: 5,
        title: 'Computer Science Basics',
        description: 'Learn programming fundamentals and problem solving techniques.',
        registrationDeadline: '2025-07-30T23:59:59',
        image: 'csImg',
    },
    {
        id: 6,
        title: 'History and Civics',
        description: 'Discuss historical events and civic responsibilities in detail.',
        registrationDeadline: '2025-06-30T23:59:59',
        image: 'historyImg',
    },
];

const StudySessions = () => {
    return (
        <section className="md:w-10/12 w-11/12 mx-auto py-16">
            <h1 className="text-4xl font-bold mb-10 text-center">Available Study Sessions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sessions.map(session => (
                    <StudySessionCard key={session.id} {...session} />
                ))}
            </div>
        </section>
    );
};

export default StudySessions;
