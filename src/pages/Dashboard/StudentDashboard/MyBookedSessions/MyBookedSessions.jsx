import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Rating from 'react-rating';
import { FaStar, FaRegStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MyBookedSessions = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [expandedId, setExpandedId] = useState(null);
    const [reviewInputs, setReviewInputs] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const sessionsPerPage = 3;

    const { data: payments = [], isLoading: paymentsLoading } = useQuery({
        queryKey: ['payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get(`/payments/user/${user.email}`)).data,
    });

    const { data: allSessions = [], isLoading: sessionsLoading } = useQuery({
        queryKey: ['sessions'],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get('/sessions')).data,
    });

    const sessionIdToTitle = {};
    allSessions.forEach(s => (sessionIdToTitle[s._id] = s.title));

    const filtered = payments.filter(p => {
        const title = sessionIdToTitle[p.sessionId] || '';
        return (
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            new Date(p.date).toLocaleDateString().includes(searchTerm)
        );
    });

    const totalPages = Math.ceil(filtered.length / sessionsPerPage);
    const displayed = filtered.slice((currentPage - 1) * sessionsPerPage, currentPage * sessionsPerPage);

    const toggleExpand = id => setExpandedId(expandedId === id ? null : id);

    const { data: session, isLoading: sessionLoading } = useQuery({
        queryKey: ['session', expandedId],
        enabled: !!expandedId,
        queryFn: async () => (await axiosSecure.get(`/sessions/${expandedId}`)).data,
    });

    const { data: reviews = [] } = useQuery({
        queryKey: ['feedbacks', expandedId],
        enabled: !!expandedId,
        queryFn: async () => (await axiosSecure.get(`/feedbacks/session/${expandedId}`)).data,
    });

    const myReview = reviews.find(r => r.studentEmail === user.email);
    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : 'N/A';

    useEffect(() => {
        if (expandedId && myReview) {
            setReviewInputs(prev => ({
                ...prev,
                [expandedId]: { rating: myReview.rating, comment: myReview.feedback || '' },
            }));
        } else if (expandedId) {
            setReviewInputs(prev => ({ ...prev, [expandedId]: { rating: 0, comment: '' } }));
        }
    }, [expandedId, myReview]);

    const handleInputChange = (id, field, value) => {
        setReviewInputs(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    };

    const handleSaveReview = async (sessionId, myReviewId) => {
        const input = reviewInputs[sessionId];
        if (!input?.rating || input.rating < 1) {
            return Swal.fire('Error', 'Please provide a rating.', 'error');
        }
        try {
            if (myReviewId) {
                await axiosSecure.patch(`/feedbacks/${myReviewId}`, input);
            } else {
                await axiosSecure.post('/feedbacks', {
                    sessionId,
                    studentEmail: user.email,
                    rating: input.rating,
                    feedback: input.comment || '',
                });
            }
            Swal.fire('Success', 'Feedback saved!', 'success');
            queryClient.invalidateQueries(['payments', user.email]);
            queryClient.invalidateQueries(['feedbacks', sessionId]);
        } catch (err) {
            Swal.fire('Error', 'Failed to submit feedback', 'error');
        }
    };

    if (paymentsLoading || sessionsLoading) {
        return <p className="text-center text-lg text-gray-500">Loading sessions...</p>;
    }

    return (
        <div className="w-11/12 mx-auto py-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h2 className="xl:text-3xl text-2xl font-extrabold text-primary">📚 My Booked Sessions</h2>
                <div className="flex gap-3 w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Search by title or date..."
                        className="input input-bordered input-primary w-full"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* Session Cards */}
            {displayed.length === 0 ? (
                <p className="text-center text-gray-500 text-lg mt-20">No sessions found.</p>
            ) : (
                <div className="space-y-8">
                    {displayed.map(payment => {
                        const sessionId = payment.sessionId;
                        const title = sessionIdToTitle[sessionId] || 'Unknown Title';
                        const isExpanded = expandedId === sessionId;

                        return (
                            <article
                                key={payment._id}
                                className="bg-base-200 shadow-lg rounded-xl border border-gray-200/20 overflow-hidden transition-transform hover:scale-[1.01]"
                            >
                                {/* Card Header */}
                                <div
                                    className="flex justify-between items-center px-6 py-4 cursor-pointer bg-base-200"
                                    onClick={() => toggleExpand(sessionId)}
                                >
                                    <h3 className="text-2xl font-semibold truncate">{title}</h3>
                                    <div className="flex items-center gap-6">
                                        <p className="text-lg font-semibold text-secondary">৳{payment.amount}</p>
                                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                </div>

                                {/* Card Body */}
                                {isExpanded && (
                                    <div className="px-6 py-6 border-t border-gray-200 space-y-6">
                                        {/* Session Info */}
                                        {sessionLoading ? (
                                            <p className="text-gray-400">Loading session details...</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {session?.image && (
                                                    <img
                                                        src={session.image}
                                                        alt={session.title}
                                                        className="w-full  object-cover rounded-lg shadow-md"
                                                        loading="lazy"
                                                    />
                                                )}
                                                <div className="grid md:grid-cols-2 gap-6 ">
                                                    <div className="space-y-1">
                                                        <p><span className="font-semibold">Tutor:</span> {session?.tutorName}</p>
                                                        <p><span className="font-semibold">Registration:</span> {new Date(session?.registrationStart).toLocaleDateString()} - {new Date(session?.registrationEnd).toLocaleDateString()}</p>
                                                        <p><span className="font-semibold">Class Dates:</span> {new Date(session?.classStart).toLocaleDateString()} - {new Date(session?.classEnd).toLocaleDateString()}</p>
                                                        <p><span className="font-semibold">Duration:</span> {session?.duration}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p><span className="font-semibold">Fee:</span> {session?.registrationFee > 0 ? `৳${session.registrationFee}` : 'Free'}</p>
                                                        <p><span className="font-semibold">Status:</span> {new Date(session?.registrationEnd) < new Date() ? <span className="text-red-600 font-bold">Closed</span> : <span className="text-green-600 font-bold">Ongoing</span>}</p>
                                                        <p><span className="font-semibold">Transaction ID:</span> {payment.transactionId}</p>
                                                        <p><span className="font-semibold">Paid At:</span> {new Date(payment.date).toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                {/* Reviews */}
                                                <div className="mt-4">
                                                    <h4 className="text-2xl font-semibold mb-3 border-b border-gray-300 pb-2">Reviews (Avg: {avgRating} ⭐)</h4>
                                                    {reviews.length ? (
                                                        <div className="space-y-3 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded">
                                                            {reviews.map(r => (
                                                                <div key={r._id} className="bg-gray-50 p-3 rounded shadow-sm">
                                                                    <p className="font-semibold">{r.studentEmail} ➤ {r.rating}⭐</p>
                                                                    <p className="text-gray-600">{r.feedback}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : <p className="text-gray-500 italic">No reviews yet.</p>}

                                                    {/* Add Review */}
                                                    <div className="mt-4">
                                                        <h5 className="font-semibold text-lg mb-2">{myReview ? 'Update Your Review' : 'Write a Review'}</h5>
                                                        <Rating
                                                            initialRating={reviewInputs[sessionId]?.rating || 0}
                                                            onChange={r => handleInputChange(sessionId, 'rating', r)}
                                                            emptySymbol={<FaRegStar className="text-yellow-400 text-3xl" />}
                                                            fullSymbol={<FaStar className="text-yellow-500 text-3xl" />}
                                                        />
                                                        <textarea
                                                            className="textarea textarea-bordered w-full mt-3 resize-none"
                                                            rows={3}
                                                            placeholder="Your comment"
                                                            value={reviewInputs[sessionId]?.comment || ''}
                                                            onChange={e => handleInputChange(sessionId, 'comment', e.target.value)}
                                                        />
                                                        <button
                                                            className="btn btn-primary mt-3 w-full"
                                                            onClick={() => handleSaveReview(sessionId, myReview?._id)}
                                                        >
                                                            {myReview ? 'Update' : 'Submit'} Review
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            <nav className="mt-10 flex justify-center gap-2">
                {[...Array(totalPages).keys()].map(p => (
                    <button
                        key={p}
                        onClick={() => setCurrentPage(p + 1)}
                        className={`btn btn-sm ${p + 1 === currentPage ? 'btn-primary' : 'btn-outline'}`}
                    >
                        {p + 1}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default MyBookedSessions;
