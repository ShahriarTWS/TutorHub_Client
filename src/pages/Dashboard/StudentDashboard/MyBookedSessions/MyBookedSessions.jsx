import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Rating from 'react-rating';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

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
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/user/${user.email}`);
            return res.data;
        },
    });

    const { data: allSessions = [], isLoading: sessionsLoading } = useQuery({
        queryKey: ['sessions'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions');
            return res.data;
        },
    });

    const sessionIdToTitle = {};
    allSessions.forEach(s => {
        sessionIdToTitle[s._id] = s.title;
    });

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

    const { data: materials = [], isLoading: materialsLoading } = useQuery({
        queryKey: ['materials', expandedId, user?.email],
        enabled: !!expandedId && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/materials/session/${expandedId}/student/${user.email}`);
            return res.data;
        },
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
            setReviewInputs(prev => ({
                ...prev,
                [expandedId]: { rating: 0, comment: '' },
            }));
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

    const exportMaterialsCSV = () => {
        if (!materials.length) {
            Swal.fire('Info', 'No materials to export.', 'info');
            return;
        }
        const rows = [['Title', 'Description', 'Resource Link', 'File URL', 'Uploaded By', 'Uploaded At']];
        materials.forEach(m => {
            rows.push([
                m.title || '',
                m.description || '',
                m.resourceLink || '',
                m.fileURL || '',
                m.uploadedBy || '',
                m.uploadedAt ? new Date(m.uploadedAt).toLocaleString() : '',
            ]);
        });
        const csv = rows.map(r => r.map(field => `"${field.replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        saveAs(blob, 'materials.csv');
    };

    if (paymentsLoading || sessionsLoading) {
        return <p className="text-center text-lg text-gray-500">Loading sessions...</p>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-4xl font-extrabold text-primary">📚 My Booked Sessions Materials & Reviews</h2>
                <div className="flex gap-3 w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Search by session title or date..."
                        className="input input-bordered input-primary w-full"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button
                        disabled={!materials.length}
                        className="btn btn-outline btn-primary whitespace-nowrap"
                        onClick={exportMaterialsCSV}
                    >
                        Export Materials CSV
                    </button>
                </div>
            </header>

            {displayed.length === 0 ? (
                <p className="text-center text-gray-600 text-lg mt-20">No sessions found matching your search.</p>
            ) : (
                <div className="space-y-10">
                    {displayed.map(payment => {
                        const sessionId = payment.sessionId;
                        const title = sessionIdToTitle[sessionId] || 'Unknown Title';

                        return (
                            <article
                                key={payment._id}
                                className="card bg-base-100 shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow rounded-lg"
                            >
                                <div className="card-body p-6">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                        <h3 className="card-title text-2xl text-secondary font-semibold truncate">{title}</h3>
                                        <p className="text-lg font-semibold text-yellow-600 whitespace-nowrap">Paid: ৳{payment.amount}</p>
                                    </div>
                                    <p className="text-gray-500 mt-1">
                                        <span className="font-semibold">Transaction ID:</span> {payment.transactionId}
                                    </p>
                                    <p className="text-gray-500">
                                        <span className="font-semibold">Date:</span> {new Date(payment.date).toLocaleString()}
                                    </p>

                                    <div className="text-right mt-4">
                                        <button
                                            className="btn btn-primary btn-sm hover:btn-secondary transition-colors"
                                            onClick={() => toggleExpand(sessionId)}
                                            aria-expanded={expandedId === sessionId}
                                        >
                                            {expandedId === sessionId ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>

                                    {expandedId === sessionId && (
                                        <section className="mt-8 border-t border-gray-300 pt-6 space-y-8">
                                            {sessionLoading ? (
                                                <p className="text-center text-gray-400">Loading session details...</p>
                                            ) : (
                                                <>
                                                    {/* Session Info */}
                                                    <div>
                                                        {session?.image && (
                                                            <img
                                                                src={session.image}
                                                                alt={session.title}
                                                                className="mx-auto mb-6 rounded-lg max-h-64 object-cover shadow-md"
                                                                loading="lazy"
                                                            />
                                                        )}
                                                        <h4 className="text-3xl font-bold mb-3">{session?.title}</h4>
                                                        <p className="text-gray-700 leading-relaxed mb-5">{session?.description}</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 text-lg">
                                                            <div className="space-y-1">
                                                                <p><span className="font-semibold">Tutor:</span> {session?.tutorName}</p>
                                                                <p>
                                                                    <span className="font-semibold">Registration Period:</span>{' '}
                                                                    {new Date(session?.registrationStart).toLocaleDateString()} -{' '}
                                                                    {new Date(session?.registrationEnd).toLocaleDateString()}
                                                                </p>
                                                                <p>
                                                                    <span className="font-semibold">Class Dates:</span>{' '}
                                                                    {new Date(session?.classStart).toLocaleDateString()} -{' '}
                                                                    {new Date(session?.classEnd).toLocaleDateString()}
                                                                </p>
                                                                <p><span className="font-semibold">Duration:</span> {session?.duration}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p>
                                                                    <span className="font-semibold">Registration Fee:</span>{' '}
                                                                    {session?.registrationFee > 0 ? `৳${session.registrationFee}` : 'Free'}
                                                                </p>
                                                                <p>
                                                                    <span className="font-semibold">Status:</span>{' '}
                                                                    {new Date(session?.registrationEnd) < new Date() ? (
                                                                        <span className="text-red-600 font-bold">Closed</span>
                                                                    ) : (
                                                                        <span className="text-green-600 font-bold">Ongoing</span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Materials */}
                                                    {/* Materials - show only if class has started */}
                                                    {new Date(session?.classStart) <= new Date() ? (
                                                        <div>
                                                            <h4 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">Materials</h4>
                                                            {materialsLoading ? (
                                                                <p className="text-gray-500">Loading materials...</p>
                                                            ) : materials.length === 0 ? (
                                                                <p className="italic text-gray-500">No materials available for this session.</p>
                                                            ) : (
                                                                <div className="space-y-5 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-3 rounded border border-gray-200">
                                                                    {materials.map(m => (
                                                                        <div
                                                                            key={m._id}
                                                                            className="p-4 bg-base-200 rounded-lg shadow-sm border border-gray-300"
                                                                        >
                                                                            <h5 className="font-semibold text-lg">{m.title || 'Untitled'}</h5>
                                                                            <p className="text-gray-400 mb-2">{m.description || 'No description'}</p>
                                                                            {m.resourceLink && (
                                                                                <p>
                                                                                    <a
                                                                                        href={m.resourceLink}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-blue-600 underline hover:text-blue-800"
                                                                                    >
                                                                                        Resource Link
                                                                                    </a>
                                                                                </p>
                                                                            )}
                                                                            {m.fileURL && (
                                                                                <p>
                                                                                    <a
                                                                                        href={m.fileURL}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-blue-600 underline hover:text-blue-800"
                                                                                        download
                                                                                    >
                                                                                        Download File
                                                                                    </a>
                                                                                </p>
                                                                            )}
                                                                            <p className="text-xs text-gray-400 mt-2">
                                                                                Uploaded by: {m.uploadedBy || 'Unknown'} <br />
                                                                                Uploaded at: {m.uploadedAt ? new Date(m.uploadedAt).toLocaleString() : 'N/A'}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="italic text-gray-500">📌 Materials will be available after class starts on {new Date(session?.classStart).toLocaleDateString()}.</p>
                                                    )}


                                                    {/* Reviews */}
                                                    <div>
                                                        <h4 className="text-2xl font-semibold mb-3 border-b border-gray-300 pb-2">
                                                            Reviews (Average Rating: {avgRating} ⭐)
                                                        </h4>
                                                        {reviews.length ? (
                                                            <div className="space-y-4 max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-3 rounded border border-gray-200 mb-6">
                                                                {reviews.map(r => (
                                                                    <div
                                                                        key={r._id}
                                                                        className="bg-base-200 p-3 rounded shadow-sm border border-gray-300"
                                                                    >
                                                                        <p className="font-semibold">{r.studentEmail} ➤ {r.rating}⭐</p>
                                                                        <p className="text-gray-700">{r.feedback}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="italic text-gray-500 mb-6">No reviews yet.</p>
                                                        )}

                                                        <h5 className="font-semibold text-xl mb-2">
                                                            {myReview ? 'Update Your Review' : 'Write a Review'}
                                                        </h5>
                                                        <Rating
                                                            initialRating={reviewInputs[sessionId]?.rating || 0}
                                                            onChange={r => handleInputChange(sessionId, 'rating', r)}
                                                            emptySymbol={<FaRegStar className="text-yellow-400 text-4xl" />}
                                                            fullSymbol={<FaStar className="text-yellow-500 text-4xl" />}
                                                        />
                                                        <textarea
                                                            className="textarea textarea-bordered w-full mt-4 resize-none text-lg"
                                                            rows={3}
                                                            placeholder="Your comment"
                                                            value={reviewInputs[sessionId]?.comment || ''}
                                                            onChange={e => handleInputChange(sessionId, 'comment', e.target.value)}
                                                        />
                                                        <button
                                                            className="btn btn-primary mt-4 w-full text-lg"
                                                            onClick={() => handleSaveReview(sessionId, myReview?._id)}
                                                        >
                                                            {myReview ? 'Update' : 'Submit'} Review
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </section>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            <nav
                aria-label="Pagination"
                className="mt-12 flex justify-center gap-3"
            >
                {[...Array(totalPages).keys()].map(p => (
                    <button
                        key={p}
                        onClick={() => setCurrentPage(p + 1)}
                        className={`btn btn-sm ${p + 1 === currentPage ? 'btn-primary' : 'btn-outline'
                            }`}
                        aria-current={p + 1 === currentPage ? 'page' : undefined}
                    >
                        {p + 1}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default MyBookedSessions;
