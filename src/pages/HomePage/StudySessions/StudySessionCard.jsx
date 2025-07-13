import React, { useState } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const StudySessionCard = (session) => {
    const {
        _id,
        title = 'Untitled',
        description = 'No description available.',
        registrationEnd,
        registrationStart,
        image,
        registrationFee,
        classStart,
        classEnd,
        tutorName,
        tutorEmail
    } = session;

    const now = new Date();
    const deadline = new Date(registrationEnd);
    const isOngoing = now <= deadline;

    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: roleData, isLoading: roleLoading } = useQuery({
        queryKey: ['user-role', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role/${user.email}`);
            return res.data;
        },
    });

    const role = roleData?.role;

    const formattedClassStart = classStart ? format(new Date(classStart), 'MMM d, yyyy') : 'N/A';
    const formattedClassEnd = classEnd ? format(new Date(classEnd), 'MMM d, yyyy') : 'N/A';
    const formattedRegStart = registrationStart ? format(new Date(registrationStart), 'MMM d, yyyy') : 'N/A';
    const formattedRegEnd = registrationEnd ? format(new Date(registrationEnd), 'MMM d, yyyy') : 'N/A';

    const handleEnroll = async () => {
        if (!user || !user.email) return Swal.fire('Error', 'You must be logged in', 'error');

        if (registrationFee <= 0) {
            // Free session – directly record payment
            const paymentData = {
                studentEmail: user.email,
                sessionId: _id,
                amount: 0,
                transactionId: 'FREE',
            };

            try {
                const res = await axiosSecure.post('/payments', paymentData);
                if (res.data.insertedId) {
                    Swal.fire('Enrolled!', 'You have successfully enrolled for free.', 'success');
                    setShowModal(false);
                }
            } catch (error) {
                console.error('Enrollment failed:', error);
                Swal.fire('Error', 'Failed to enroll', 'error');
            }
        } else {
            // Paid session – redirect to payment page
            navigate('/payment', { state: { session } });
        }
    };

    return (
        <>
            <div className="group rounded-xl overflow-hidden bg-base-200 shadow hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-base-200 flex flex-col">
                <div className="h-44 bg-gray-100 overflow-hidden flex justify-center items-center">
                    <img
                        src={image}
                        alt={title}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold mb-1 line-clamp-1">{title}</h3>
                    <p className="text-sm mb-3 line-clamp-2">{description}</p>

                    <div className="text-sm mb-4 space-y-1">
                        <p><span className="font-medium">Registration:</span> {formattedRegStart} → {formattedRegEnd}</p>
                        <p><span className="font-medium">Class:</span> {formattedClassStart} → {formattedClassEnd}</p>
                        <p><span className="font-medium">Fee:</span> {registrationFee > 0 ? `${registrationFee}৳` : 'Free'}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4">
                        <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full 
                            ${isOngoing ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                            {isOngoing ? 'Ongoing' : 'Closed'}
                        </span>
                        <button
                            className="btn btn-sm btn-primary hover:scale-105 transition-transform duration-200"
                            onClick={() => setShowModal(true)}
                        >
                            Details
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <dialog open className="modal modal-bottom sm:modal-middle" onClick={() => setShowModal(false)}>
                    <div className="modal-box max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-3">{title}</h2>
                        <img src={image} alt={title} className="w-full h-48 object-cover rounded mb-4" />

                        <div className="space-y-2 text-sm">
                            <p><strong>Description:</strong> {description}</p>
                            <p><strong>Registration:</strong> {formattedRegStart} → {formattedRegEnd}</p>
                            <p><strong>Class Date:</strong> {formattedClassStart} → {formattedClassEnd}</p>
                            <p><strong>Tutor:</strong> {tutorName} ({tutorEmail})</p>
                            <p><strong>Fee:</strong> {registrationFee > 0 ? `${registrationFee}৳` : 'Free'}</p>
                            <p><strong>Status:</strong> {isOngoing ? 'Ongoing (Open for registration)' : 'Closed'}</p>
                        </div>

                        {role === 'student' && !roleLoading && isOngoing && (
                            <div className="mt-6 text-right">
                                <button className="btn btn-primary" onClick={handleEnroll}>
                                    Enroll
                                </button>
                            </div>
                        )}

                        <div className="modal-action">
                            <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default StudySessionCard;
