// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import useAxiosSecure from '../../../hooks/useAxiosSecure';
// import StudySessionCard from './StudySessionCard';

// const StudySessions = () => {
//     const axiosSecure = useAxiosSecure();

//     const { data: sessions = [], isLoading, error } = useQuery({
//         queryKey: ['allApprovedSessions'],
//         queryFn: async () => {
//             const res = await axiosSecure.get('/sessions'); // ✅ Get all sessions
//             // ✅ Filter only approved ones
//             return res.data.filter(session => session.status === 'approved');
//         }
//     });

//     return (
//         <section className="md:w-10/12 w-11/12 mx-auto py-16">
//             <h1 className="text-4xl font-bold mb-10 text-center">Available Study Sessions</h1>

//             {isLoading && <p className="text-center">Loading sessions...</p>}
//             {error && <p className="text-center text-red-500">Failed to load sessions.</p>}

//             {!isLoading && sessions.length === 0 && (
//                 <p className="text-center text-gray-500">No approved sessions found.</p>
//             )}

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {sessions.map(session => (
//                     <StudySessionCard key={session._id} {...session} />
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default StudySessions;



import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import StudySessionCard from './StudySessionCard';
import { FaSearch } from 'react-icons/fa';

const StudySessions = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [sortOption, setSortOption] = useState('latest'); // default sort

    const { data: sessions = [], isLoading, error } = useQuery({
        queryKey: ['allApprovedSessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions');
            return res.data.filter(session => session.status === 'approved');
        }
    });

    // 🔍 Search + Sort logic
    const filteredAndSorted = useMemo(() => {
        let result = sessions.filter(session =>
            session.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            session.tutorName?.toLowerCase().includes(searchText.toLowerCase()) ||
            session.tutorEmail?.toLowerCase().includes(searchText.toLowerCase())
        );

        if (sortOption === 'latest') {
            result.sort((a, b) => new Date(b.registrationStart) - new Date(a.registrationStart));
        } else if (sortOption === 'oldest') {
            result.sort((a, b) => new Date(a.registrationStart) - new Date(b.registrationStart));
        } else if (sortOption === 'feeLowHigh') {
            result.sort((a, b) => a.registrationFee - b.registrationFee);
        } else if (sortOption === 'feeHighLow') {
            result.sort((a, b) => b.registrationFee - a.registrationFee);
        }

        return result;
    }, [sessions, searchText, sortOption]);

    return (
        <section className="md:w-10/12 w-11/12 mx-auto py-16">
            <h1 className="text-4xl font-bold mb-10 text-center">Available Study Sessions</h1>

            {/* 🔍 Search & Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                {/* Search */}
                <div className="flex items-center gap-2 w-full sm:w-80">
                    <FaSearch className="text-gray-500" />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Search by title, tutor name, or email"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                {/* Sort */}
                <select
                    className="select select-bordered"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="latest">Sort by Latest</option>
                    <option value="oldest">Sort by Oldest</option>
                    <option value="feeLowHigh">Fee: Low → High</option>
                    <option value="feeHighLow">Fee: High → Low</option>
                </select>
            </div>

            {isLoading && <p className="text-center">Loading sessions...</p>}
            {error && <p className="text-center text-red-500">Failed to load sessions.</p>}

            {!isLoading && filteredAndSorted.length === 0 && (
                <p className="text-center text-gray-500">No sessions found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSorted.map(session => (
                    <StudySessionCard key={session._id} {...session} />
                ))}
            </div>
        </section>
    );
};

export default StudySessions;
