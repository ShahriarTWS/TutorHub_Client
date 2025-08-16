import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const TutorManagement = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: tutors = [], refetch, isLoading } = useQuery({
        queryKey: ['pending-tutors'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tutors?status=pending');
            return res.data;
        },
    });

    const handleStatusChange = async (id, status) => {
        try {
            setIsSubmitting(true);
            const payload = status === 'cancelled' ? { status, feedback } : { status };
            const res = await axiosSecure.patch(`/tutors/${id}`, payload);

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: `Tutor ${status === 'approved' ? 'Approved' : 'Rejected'}`,
                    toast: true,
                    position: 'top-end',
                    timer: 2000,
                    showConfirmButton: false,
                });
                setSelectedTutor(null);
                setFeedback('');
                refetch();
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Something went wrong!', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p className="text-center mt-10 text-lg font-medium">Loading pending tutors...</p>;

    return (
        <div className="w-11/12 mx-auto py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Pending Tutor Applications</h2>

            {tutors.length === 0 ? (
                <p className="text-center text-gray-500">No pending tutor applications found.</p>
            ) : (
                <>
                    {/* Table for large screens */}
                    <div className="hidden lg:block overflow-x-auto rounded-lg shadow-lg bg-base-100 border border-base-300">
                        <table className="table w-full table-zebra">
                            <thead className="bg-primary text-primary-content">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Experience</th>
                                    <th>Speciality</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tutors.map((tutor, index) => (
                                    <tr key={tutor._id} className="hover:bg-base-200 transition-colors">
                                        <td>{index + 1}</td>
                                        <td>{tutor.name}</td>
                                        <td>{tutor.email}</td>
                                        <td>{tutor.experience} yrs</td>
                                        <td>{tutor.speciality}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => setSelectedTutor(tutor)}
                                                className="btn btn-sm btn-primary hover:scale-105 transition-transform"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Card layout for small screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                        {tutors.map((tutor) => (
                            <div
                                key={tutor._id}
                                className="bg-base-100 shadow-md rounded-xl p-4 flex flex-col items-center space-y-3"
                            >
                                <img
                                    src={tutor.photo || 'https://i.ibb.co/0jqHpnp/default-profile.jpg'}
                                    alt={tutor.name}
                                    className="rounded-full h-24 w-24 mb-2 border-2 border-base-300"
                                />
                                <h3 className="font-semibold text-lg">{tutor.name}</h3>
                                <p className="text-sm text-gray-600">{tutor.email}</p>
                                <p className="text-sm">Experience: {tutor.experience} yrs</p>
                                <p className="text-sm">Speciality: {tutor.speciality}</p>
                                <button
                                    onClick={() => setSelectedTutor(tutor)}
                                    className="btn btn-primary btn-sm mt-2"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Modal */}
            {selectedTutor && (
                <dialog open className="modal modal-bottom sm:modal-middle p-0">
                    <div className="modal-box max-w-3xl p-0 rounded-xl overflow-hidden shadow-xl">
                        <div className="flex flex-col items-center bg-primary text-primary-content p-6">
                            <img
                                src={selectedTutor.photo || 'https://i.ibb.co/0jqHpnp/default-profile.jpg'}
                                alt={selectedTutor.name}
                                className="rounded-full h-32 w-32 mb-4 border-4 border-base-100"
                            />
                            <h3 className="text-2xl font-bold">{selectedTutor.name}</h3>
                            <p className="text-sm opacity-80">{selectedTutor.speciality}</p>
                        </div>

                        <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <p><span className="font-semibold">Email:</span> {selectedTutor.email}</p>
                                <p><span className="font-semibold">Experience:</span> {selectedTutor.experience} yrs</p>
                                {selectedTutor.education && (
                                    <>
                                        <p><span className="font-semibold">Degree:</span> {selectedTutor.education.degree}</p>
                                        <p><span className="font-semibold">Institution:</span> {selectedTutor.education.institution}</p>
                                        <p><span className="font-semibold">Passing Year:</span> {selectedTutor.education.year}</p>
                                        <p><span className="font-semibold">GPA:</span> {selectedTutor.education.gpa}</p>
                                    </>
                                )}
                            </div>

                            {selectedTutor.bio && (
                                <div>
                                    <h4 className="font-semibold">Bio</h4>
                                    <p className="text-justify">{selectedTutor.bio}</p>
                                </div>
                            )}

                            {selectedTutor.linkedin && (
                                <p>
                                    <span className="font-semibold">LinkedIn:</span>{' '}
                                    <a
                                        href={selectedTutor.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="link text-blue-500"
                                    >
                                        View Profile
                                    </a>
                                </p>
                            )}

                            <div>
                                <label htmlFor="feedback" className="block font-semibold mb-1">
                                    Feedback (required if rejecting)
                                </label>
                                <textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                    placeholder="Provide feedback for rejection..."
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div className="modal-action justify-between p-6 border-t border-base-300">
                            <div className="space-x-2">
                                <button
                                    onClick={() => {
                                        if (!feedback.trim()) {
                                            Swal.fire('Feedback required', 'Please provide feedback before rejecting.', 'warning');
                                            return;
                                        }
                                        handleStatusChange(selectedTutor._id, 'cancelled');
                                    }}
                                    className="btn btn-error btn-sm text-base-100"
                                    disabled={isSubmitting}
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleStatusChange(selectedTutor._id, 'approved')}
                                    className="btn btn-success btn-sm text-base-100"
                                    disabled={isSubmitting}
                                >
                                    Approve
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedTutor(null);
                                    setFeedback('');
                                }}
                                className="btn btn-sm"
                                disabled={isSubmitting}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default TutorManagement;
