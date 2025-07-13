import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';

const axiosSecure = useAxiosSecure();

const fetchPayments = async (email) => {
    const { data } = await axiosSecure.get(`/payments/user/${email}`);
    return data;
};

const fetchSession = async (sessionId) => {
    const { data } = await axiosSecure.get(`/sessions/${sessionId}`);
    return data;
};

// Placeholder: implement your backend feedback POST route or adjust accordingly
const postFeedback = async (feedbackData) => {
    const { data } = await axiosSecure.post('/feedbacks', feedbackData);
    return data;
};

const MyBookedSessions = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});

    // 1. Fetch payments (booked sessions)
    const {
        data: payments,
        isLoading: loadingPayments,
        error: paymentsError,
    } = useQuery(['payments', user?.email], () => fetchPayments(user.email), {
        enabled: !!user?.email,
    });

    // 2. Fetch all sessions details in parallel using multiple queries
    const sessionsQueries = (payments || []).map((payment) =>
        useQuery(['session', payment.sessionId], () => fetchSession(payment.sessionId), {
            enabled: !!payment.sessionId,
        })
    );

    // 3. Mutation for feedback submission
    const feedbackMutation = useMutation(postFeedback, {
        onSuccess: () => {
            Swal.fire('Success', 'Feedback submitted successfully!', 'success');
            queryClient.invalidateQueries(['payments', user.email]); // or feedback queries
        },
        onError: (error) => {
            Swal.fire('Error', error.response?.data?.error || 'Failed to submit feedback', 'error');
        },
    });

    const handleRatingChange = (sessionId, value) => {
        setRatings((prev) => ({ ...prev, [sessionId]: value }));
    };

    const handleCommentChange = (sessionId, value) => {
        setComments((prev) => ({ ...prev, [sessionId]: value }));
    };

    const submitFeedback = (sessionId) => {
        const rating = ratings[sessionId];
        if (!rating || rating < 1 || rating > 5) {
            Swal.fire('Error', 'Please select a rating between 1 and 5', 'error');
            return;
        }

        feedbackMutation.mutate({
            sessionId,
            studentEmail: user.email,
            rating,
            feedback: comments[sessionId] || '',
        });
    };

    if (loadingPayments) return <div>Loading your booked sessions...</div>;
    if (paymentsError) return <div>Error loading sessions</div>;

    if (!payments || payments.length === 0)
        return <div>You have no booked sessions yet.</div>;

    const now = new Date();

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold mb-4">My Booked Sessions</h1>

            {payments.map((payment, idx) => {
                const sessionQuery = sessionsQueries[idx];
                const session = sessionQuery?.data;
                const loadingSession = sessionQuery?.isLoading;

                if (loadingSession) return <div key={payment._id}>Loading session info...</div>;
                if (!session) return <div key={payment._id}>Session not found</div>;

                const classStarted = new Date(session.classStart) <= now;

                return (
                    <div
                        key={payment._id}
                        className="border rounded-md p-4 shadow-sm bg-white"
                    >
                        <h2 className="text-xl font-semibold mb-2">{session.title}</h2>
                        <p className="mb-2">{session.description}</p>
                        <p>
                            <strong>Class Start:</strong> {new Date(session.classStart).toLocaleString()}
                        </p>
                        <p>
                            <strong>Class End:</strong> {new Date(session.classEnd).toLocaleString()}
                        </p>

                        {classStarted ? (
                            <button
                                className="btn btn-secondary mt-3"
                                onClick={() => window.open(`/study-materials/${session._id}`, '_blank')}
                            >
                                View Study Materials
                            </button>
                        ) : (
                            <p className="italic text-gray-500 mt-3">
                                Study materials will be available after the class starts.
                            </p>
                        )}

                        {/* Feedback form */}
                        <div className="mt-5">
                            <h3 className="font-semibold mb-2">Give Rating & Feedback</h3>

                            <label className="block mb-1 font-medium">Rating (1-5):</label>
                            <select
                                className="select select-bordered max-w-xs mb-3"
                                value={ratings[session._id] || ''}
                                onChange={(e) => handleRatingChange(session._id, Number(e.target.value))}
                            >
                                <option value="">Select rating</option>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>
                                        {n} Star{n > 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>

                            <label className="block mb-1 font-medium">Feedback (optional):</label>
                            <textarea
                                rows={3}
                                className="textarea textarea-bordered w-full max-w-md mb-3"
                                placeholder="Write your feedback"
                                value={comments[session._id] || ''}
                                onChange={(e) => handleCommentChange(session._id, e.target.value)}
                            ></textarea>

                            <button
                                className="btn btn-primary"
                                onClick={() => submitFeedback(session._id)}
                                disabled={feedbackMutation.isLoading}
                            >
                                {feedbackMutation.isLoading ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MyBookedSessions;
