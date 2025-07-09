import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const AdminStudySessions = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [selectedSession, setSelectedSession] = useState(null);
    const [registrationFee, setRegistrationFee] = useState('');

    const [rejectSession, setRejectSession] = useState(null);
    const [feedback, setFeedback] = useState('');

    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ['admin-sessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/sessions');
            return res.data;
        }
    });

    const approveMutation = useMutation({
        mutationFn: async ({ id, fee }) => {
            return await axiosSecure.patch(`/admin/sessions/${id}`, {
                status: 'approved',
                registrationFee: parseFloat(fee)
            });
        },
        onSuccess: () => {
            Swal.fire('✅ Success', 'Session approved!', 'success');
            queryClient.invalidateQueries(['admin-sessions']);
            setSelectedSession(null);
            setRegistrationFee('');
        },
        onError: () => Swal.fire('❌ Error', 'Failed to approve session', 'error')
    });

    const rejectMutation = useMutation({
        mutationFn: async ({ id, feedback }) => {
            return await axiosSecure.patch(`/admin/sessions/${id}`, {
                status: 'rejected',
                feedback: feedback
            });
        },
        onSuccess: () => {
            Swal.fire('⛔ Rejected', 'Session has been rejected with feedback.', 'info');
            queryClient.invalidateQueries(['admin-sessions']);
            setRejectSession(null);
            setFeedback('');
        },
        onError: () => Swal.fire('❌ Error', 'Failed to reject session', 'error')
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">All Study Sessions</h1>

            {isLoading ? (
                <p className="text-center">Loading sessions...</p>
            ) : (
                <table className="table w-full border border-gray-300">
                    <thead>
                        <tr className="bg-base-200">
                            <th>Title</th>
                            <th>Tutor</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <tr key={session._id}>
                                <td>{session.title}</td>
                                <td>{session.tutorEmail}</td>
                                <td>
                                    <span className={`badge ${session.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                                        {session.status}
                                    </span>
                                </td>
                                <td>
                                    {session.status === 'pending' && (
                                        <div className="space-x-2">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => {
                                                    setSelectedSession(session);
                                                    setRegistrationFee('');
                                                }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-error"
                                                onClick={() => setRejectSession(session)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ✅ Approval Modal */}
            {selectedSession && (
                <dialog open className="modal modal-bottom sm:modal-middle" onClick={() => setSelectedSession(null)}>
                    <div className="modal-box max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedSession.image}
                            alt={selectedSession.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-bold">{selectedSession.title}</h3>
                        <p className="text-sm mt-2">{selectedSession.description}</p>
                        <p><strong>Duration:</strong> {selectedSession.duration}</p>
                        <p><strong>Registration:</strong> {selectedSession.registrationStart} to {selectedSession.registrationEnd}</p>
                        <p><strong>Class:</strong> {selectedSession.classStart} to {selectedSession.classEnd}</p>

                        <div className="form-control mt-4">
                            <label className="label font-semibold">Registration Fee (USD)</label>
                            <input
                                type="number"
                                className="input input-bordered"
                                placeholder="Enter fee"
                                value={registrationFee}
                                onChange={(e) => setRegistrationFee(e.target.value)}
                            />
                        </div>

                        <div className="modal-action mt-4">
                            <button
                                className="btn btn-success"
                                disabled={!registrationFee}
                                onClick={() => approveMutation.mutate({
                                    id: selectedSession._id,
                                    fee: registrationFee
                                })}
                            >
                                Confirm Approve
                            </button>
                            <button className="btn btn-outline" onClick={() => setSelectedSession(null)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* ❌ Rejection Modal with Feedback */}
            {rejectSession && (
                <dialog open className="modal modal-bottom sm:modal-middle" onClick={() => setRejectSession(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-2 text-red-600">Reject Study Session</h3>
                        <p className="mb-2"><strong>Session:</strong> {rejectSession.title}</p>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            rows="4"
                            placeholder="Provide feedback to the tutor"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                        <div className="modal-action mt-4">
                            <button
                                className="btn btn-error"
                                disabled={!feedback.trim()}
                                onClick={() => rejectMutation.mutate({
                                    id: rejectSession._id,
                                    feedback: feedback.trim()
                                })}
                            >
                                Submit Rejection
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    setRejectSession(null);
                                    setFeedback('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AdminStudySessions;
