import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';

import useAuth from '../../../../hooks/useAuth';
import useAxios from '../../../../hooks/useAxios';
import { useNavigate } from 'react-router';

const MyStudySessions = () => {
    const { user } = useAuth();
    const axiosInstant = useAxios();
    const navigate = useNavigate();

    const [selectedSession, setSelectedSession] = useState(null);

    const { data: sessions = [], isLoading, isError } = useQuery({
        queryKey: ['mySessions', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosInstant.get('/sessions', {
                params: { tutorEmail: user.email },
            });
            return res.data;
        },
        enabled: !!user?.email,
        onError: (error) => {
            console.error(error);
            Swal.fire('Error', 'Failed to load your sessions', 'error');
        },
        staleTime: 5 * 60 * 1000,
    });

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">My Study Sessions</h1>

            {isLoading ? (
                <p className="text-center">Loading sessions...</p>
            ) : isError ? (
                <p className="text-center text-red-500">Failed to load sessions.</p>
            ) : sessions.length === 0 ? (
                <p className="text-center">You have not created any study sessions yet.</p>
            ) : (
                <table className="table w-full border border-gray-300">
                    <thead>
                        <tr className="bg-base-200">
                            <th>Title</th>
                            <th>Status</th>
                            <th>Registration Period</th>
                            <th>Class Period</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <tr key={session._id}>
                                <td>{session.title}</td>
                                <td>
                                    <span
                                        className={`badge ${session.status === 'approved'
                                                ? 'badge-success'
                                                : session.status === 'pending'
                                                    ? 'badge-warning'
                                                    : session.status === 'rejected'
                                                        ? 'badge-error'
                                                        : 'badge-secondary'
                                            }`}
                                    >
                                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                    </span>
                                </td>
                                <td>
                                    {session.registrationStart} to {session.registrationEnd}
                                </td>
                                <td>
                                    {session.classStart} to {session.classEnd}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() => setSelectedSession(session)}
                                    >
                                        View Info
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedSession && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                    onClick={() => setSelectedSession(null)}
                >
                    <div
                        className="modal-box max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="w-full h-48 rounded-lg overflow-hidden shadow-lg mb-4">
                            <img
                                src={selectedSession.image}
                                alt={selectedSession.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Details */}
                        <div className="text-left space-y-2 text-sm">
                            <h3 className="text-xl font-bold mb-2">{selectedSession.title}</h3>
                            <p>
                                <strong>Description:</strong> {selectedSession.description}
                            </p>
                            <p>
                                <strong>Duration:</strong> {selectedSession.duration}
                            </p>
                            <p>
                                <strong>Registration:</strong> {selectedSession.registrationStart} to{' '}
                                {selectedSession.registrationEnd}
                            </p>
                            <p>
                                <strong>Class Period:</strong> {selectedSession.classStart} to {selectedSession.classEnd}
                            </p>
                            <p>
                                <strong>Registration Fee:</strong> ${selectedSession.registrationFee?.toFixed(2) || '0.00'}
                            </p>
                            <p>
                                <strong>Status:</strong>{' '}
                                <span
                                    className={`badge ${selectedSession.status === 'approved'
                                            ? 'badge-success'
                                            : selectedSession.status === 'pending'
                                                ? 'badge-warning'
                                                : selectedSession.status === 'rejected'
                                                    ? 'badge-error'
                                                    : 'badge-secondary'
                                        }`}
                                >
                                    {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
                                </span>
                            </p>

                            {/* Feedback if rejected */}
                            {selectedSession.status === 'rejected' && selectedSession.feedback && (
                                <p className="text-red-500">
                                    <strong>Rejection Feedback:</strong> {selectedSession.feedback}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="modal-action mt-4 flex justify-between flex-wrap gap-2">
                            <button
                                onClick={() => navigate(`/dashboard/update-session/${selectedSession._id}`)}
                                className="btn btn-warning"
                            >
                                Update
                            </button>
                            <button onClick={() => setSelectedSession(null)} className="btn btn-outline">
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default MyStudySessions;
