import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import StudySessionCard from './StudySessionCard';

const StudySessions = () => {
    const axiosSecure = useAxiosSecure();

    const { data: sessions = [], isLoading, error } = useQuery({
        queryKey: ['allApprovedSessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions'); // ✅ Get all sessions
            // ✅ Filter only approved ones
            return res.data.filter(session => session.status === 'approved');
        }
    });

    return (
        <section className="md:w-10/12 w-11/12 mx-auto py-16">
            <h1 className="text-4xl font-bold mb-10 text-center">Available Study Sessions</h1>

            {isLoading && <p className="text-center">Loading sessions...</p>}
            {error && <p className="text-center text-red-500">Failed to load sessions.</p>}

            {!isLoading && sessions.length === 0 && (
                <p className="text-center text-gray-500">No approved sessions found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sessions.map(session => (
                    <StudySessionCard key={session._id} {...session} />
                ))}
            </div>
        </section>
    );
};

export default StudySessions;
