import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { Link } from 'react-router'; // Fixed import

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

    if (isLoading) return <p className="text-center mt-10 text-lg font-medium">Loading sessions...</p>;

    return (
        <div className="w-11/12 mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-primary">All Study Sessions</h1>

            {/* Large screen table */}
            <div className="hidden lg:block overflow-x-auto rounded-lg shadow-lg border border-base-300">
                <table className="table table-zebra w-full">
                    <thead className="bg-primary text-primary-content">
                        <tr>
                            <th>Title</th>
                            <th>Tutor</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(session => (
                            <tr key={session._id} className="hover:bg-base-200 transition-colors">
                                <td>{session.title}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-10 rounded-full">
                                                <img src={session.tutorImage} alt="Tutor" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{session.tutorName}</p>
                                            <p className="text-sm opacity-70">{session.tutorEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className={`badge ${session.status === 'approved' ? 'badge-success' : session.status === 'pending' ? 'badge-warning' : 'badge-error'} text-base-100`}
                                    >
                                        {session.status}
                                    </span>
                                </td>
                                <td className="space-x-2">
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => {
                                            setSelectedSession(session);
                                            setRegistrationFee(session.registrationFee || '');
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
                                    <Link
                                        to={`/dashboard/update-session/${session._id}`}
                                        className="btn btn-sm btn-warning"
                                    >
                                        Update
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card view */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                {sessions.map(session => (
                    <div key={session._id} className="card bg-base-100 shadow-md rounded-xl border border-base-200">
                        <figure>
                            <img src={session.image} alt={session.title} className="w-full h-40 object-cover rounded-t-xl" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">{session.title}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="avatar">
                                    <div className="w-10 rounded-full">
                                        <img src={session.tutorImage} alt="Tutor" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold">{session.tutorName}</p>
                                    <p className="text-sm opacity-70">{session.tutorEmail}</p>
                                </div>
                            </div>
                            <p className="mt-2"><strong>Status:</strong> <span className={`badge ${session.status === 'approved' ? 'badge-success' : session.status === 'pending' ? 'badge-warning' : 'badge-error'} text-base-100`}>{session.status}</span></p>
                            <div className="card-actions justify-center  md:justify-end mt-3 space-x-2">
                                <button
                                    className="btn btn-sm btn-success text-white"
                                    onClick={() => {
                                        setSelectedSession(session);
                                        setRegistrationFee(session.registrationFee || '');
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn btn-sm btn-error text-white"
                                    onClick={() => setRejectSession(session)}
                                >
                                    Reject
                                </button>
                                <Link to={`/dashboard/update-session/${session._id}`} className="btn btn-sm btn-warning text-white">
                                    Update
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Approval Modal */}
            {selectedSession && (
                <dialog open className="modal modal-bottom sm:modal-middle" onClick={() => setSelectedSession(null)}>
                    <div className="modal-box max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedSession.image} alt={selectedSession.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                        <h3 className="text-xl font-bold">{selectedSession.title}</h3>
                        <p className="text-sm mt-2">{selectedSession.description}</p>
                        <p><strong>Duration:</strong> {selectedSession.duration}</p>
                        <p><strong>Registration:</strong> {selectedSession.registrationStart} to {selectedSession.registrationEnd}</p>
                        <p><strong>Class:</strong> {selectedSession.classStart} to {selectedSession.classEnd}</p>

                        <div className="form-control mt-4">
                            <label className="label font-semibold">Registration Fee (TAKA)</label>
                            <input
                                type="number"
                                className="input input-bordered"
                                placeholder="Enter fee"
                                value={registrationFee}
                                onChange={(e) => setRegistrationFee(e.target.value)}
                            />
                        </div>

                        <div className="modal-action mt-4 justify-between">
                            <button
                                className="btn btn-success"
                                disabled={!registrationFee}
                                onClick={() => approveMutation.mutate({ id: selectedSession._id, fee: registrationFee })}
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

            {/* Rejection Modal */}
            {rejectSession && (
                <dialog open className="modal modal-bottom sm:modal-middle" onClick={() => setRejectSession(null)}>
                    <div className="modal-box max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <img src={rejectSession.image} alt={rejectSession.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                        <div className="flex items-center gap-3 mb-2">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img src={rejectSession.tutorImage} alt="Tutor" />
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">{rejectSession.tutorName}</p>
                                <p className="text-sm opacity-70">{rejectSession.tutorEmail}</p>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold">{rejectSession.title}</h3>
                        <p className="text-sm mt-2">{rejectSession.description}</p>
                        <p><strong>Duration:</strong> {rejectSession.duration}</p>
                        <p><strong>Registration:</strong> {rejectSession.registrationStart} to {rejectSession.registrationEnd}</p>
                        <p><strong>Class:</strong> {rejectSession.classStart} to {rejectSession.classEnd}</p>

                        <div className="form-control mt-4">
                            <label className="label font-semibold">Rejection Feedback</label>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                rows="4"
                                placeholder="Provide feedback to the tutor"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>

                        <div className="modal-action mt-4 justify-between">
                            <button
                                className="btn btn-error"
                                disabled={!feedback.trim()}
                                onClick={() => rejectMutation.mutate({ id: rejectSession._id, feedback: feedback.trim() })}
                            >
                                Submit Rejection
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => { setRejectSession(null); setFeedback(''); }}
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
