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
        <div className="p-6">
            <h2 className="text-3xl font-bold text-center mb-8">Tutor Applications (Pending)</h2>

            {tutors.length === 0 ? (
                <p className="text-center text-gray-500">No pending tutor applications found.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-lg">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200 text-base-content">
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
                                <tr key={tutor._id}>
                                    <td>{index + 1}</td>
                                    <td>{tutor.name}</td>
                                    <td>{tutor.email}</td>
                                    <td>{tutor.experience} yrs</td>
                                    <td>{tutor.speciality}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => setSelectedTutor(tutor)}
                                            className="btn btn-sm btn-primary"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {selectedTutor && (
                <dialog open className="modal modal-bottom sm:modal-middle px-4 md:px-0">
                    <div className="modal-box max-w-2xl p-0">
                        {/* Profile Image */}
                        <div className="w-full flex justify-center items-center">
                            <img
                                src={selectedTutor.photo || 'https://i.ibb.co/0jqHpnp/default-profile.jpg'}
                                alt={selectedTutor.name}
                                className="rounded-full h-48 w-48 p-6"
                            />
                        </div>

                        <div className="p-6">
                            <h3 className="font-bold text-xl mb-4 border-b pb-2">Tutor Application</h3>

                            <div className="h-[300px] overflow-y-auto pr-2 space-y-2 text-sm">
                                <p><span className="font-semibold">Name:</span> {selectedTutor.name}</p>
                                <p><span className="font-semibold">Email:</span> {selectedTutor.email}</p>
                                <p><span className="font-semibold">Experience:</span> {selectedTutor.experience} years</p>
                                <p><span className="font-semibold">Speciality:</span> {selectedTutor.speciality}</p>

                                <div className="pt-2 border-t">
                                    <h4 className="font-semibold text-base">Education</h4>
                                    <p><strong>Degree:</strong> {selectedTutor.education?.degree}</p>
                                    <p><strong>Institution:</strong> {selectedTutor.education?.institution}</p>
                                    <p><strong>Passing Year:</strong> {selectedTutor.education?.year}</p>
                                    <p><strong>GPA:</strong> {selectedTutor.education?.gpa}</p>
                                </div>

                                <div className="pt-2 border-t">
                                    <h4 className="font-semibold text-base">Bio</h4>
                                    <p className="text-justify">{selectedTutor.bio}</p>
                                </div>

                                {selectedTutor.linkedin && (
                                    <div className="pt-2 border-t">
                                        <p>
                                            <strong>LinkedIn:</strong>{' '}
                                            <a
                                                className="link text-blue-500"
                                                href={selectedTutor.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View Profile
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Feedback textarea shown only on reject */}
                            <div className="mt-4">
                                <label htmlFor="feedback" className="block font-semibold mb-1">
                                    Feedback (required if rejecting)
                                </label>
                                <textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="textarea textarea-bordered w-full"
                                    rows={3}
                                    placeholder="Enter feedback for tutor to improve their application"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="modal-action mt-4 flex justify-between items-center">
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
                    </div>
                </dialog>
            )}

        </div>
    );
};

export default TutorManagement;
