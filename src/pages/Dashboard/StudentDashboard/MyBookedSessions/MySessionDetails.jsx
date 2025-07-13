import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';


const MySessionDetails = () => {
    const { id } = useParams(); // sessionId
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [reviewData, setReviewData] = useState({
        rating: '',
        comment: '',
    });

    // Fetch session details
    const { data: session, isLoading, error } = useQuery({
        queryKey: ['session', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/sessions/${id}`);
            return res.data;
        },
    });

    // Fetch existing reviews (assuming you have a route)
    const { data: reviews } = useQuery({
        queryKey: ['reviews', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews/session/${id}`);
            return res.data || [];
        },
    });

    // Mutation to post review
    const postReview = async (newReview) => {
        const res = await axiosSecure.post('/reviews', newReview);
        return res.data;
    };

    const mutation = useMutation({
        mutationFn: postReview,
        onSuccess: () => {
            Swal.fire('Success', 'Review submitted!', 'success');
            queryClient.invalidateQueries(['reviews', id]);
            setReviewData({ rating: '', comment: '' });
        },
        onError: () => {
            Swal.fire('Error', 'Failed to submit review.', 'error');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reviewData.rating) {
            Swal.fire('Error', 'Please select a rating', 'error');
            return;
        }
        mutation.mutate({
            sessionId: id,
            studentEmail: user.email,
            rating: Number(reviewData.rating),
            comment: reviewData.comment,
        });
    };

    if (isLoading) return <div>Loading session details...</div>;
    if (error) return <div>Failed to load session details.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{session.title}</h1>
            <p className="mb-2"><strong>Description:</strong> {session.description}</p>
            <p className="mb-2"><strong>Category:</strong> {session.category}</p>
            <p className="mb-2"><strong>Class Start:</strong> {new Date(session.classStart).toLocaleString()}</p>
            <p className="mb-6"><strong>Class End:</strong> {new Date(session.classEnd).toLocaleString()}</p>

            <hr className="my-6" />

            <section>
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                {reviews?.length ? (
                    reviews.map((rev) => (
                        <div key={rev._id} className="border p-3 mb-3 rounded">
                            <p><strong>{rev.studentEmail}</strong> rated: {rev.rating} ⭐</p>
                            <p>{rev.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to review!</p>
                )}
            </section>

            <section className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Post Your Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    <label>
                        Rating:
                        <select
                            className="select select-bordered w-full"
                            value={reviewData.rating}
                            onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
                            required
                        >
                            <option value="">Select rating</option>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Comment (optional):
                        <textarea
                            className="textarea textarea-bordered w-full"
                            rows={4}
                            value={reviewData.comment}
                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                            placeholder="Write your feedback"
                        ></textarea>
                    </label>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default MySessionDetails;
