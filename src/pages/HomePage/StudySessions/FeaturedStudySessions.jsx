import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StudySessionCard from './StudySessionCard';
import { Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const FeaturedStudySessions = () => {
    const axiosSecure = useAxiosSecure();

    const { data: sessions = [], isLoading, error } = useQuery({
        queryKey: ['allApprovedSessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions');
            return res.data.filter(session => session.status === 'approved');
        }
    });

    const visibleSessions = sessions.slice(0, 6);

    return (
        <section className="md:w-10/12 w-11/12 mx-auto py-16">
            <h1 className="text-4xl font-bold mb-10 text-center">Available Study Sessions</h1>

            {isLoading && <p className="text-center">Loading sessions...</p>}
            {error && <p className="text-center text-red-500">Failed to load sessions.</p>}

            {!isLoading && visibleSessions.length === 0 && (
                <p className="text-center text-gray-500">No approved sessions found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleSessions.map(session => (
                    <StudySessionCard key={session._id} {...session} />
                ))}
            </div>

            {/* See All Button */}
            {sessions.length > 6 && (
                <div className="text-center mt-10">
                    <Link to="/study-sessions" className="btn btn-outline btn-primary">
                        See All Sessions
                    </Link>
                </div>
            )}
        </section>
    );
};

export default FeaturedStudySessions;
