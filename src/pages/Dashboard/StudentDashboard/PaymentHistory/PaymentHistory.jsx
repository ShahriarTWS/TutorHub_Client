import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Normalize payments by extracting sessionId.$oid and date.$date
    const { data: payments = [], isLoading: loadingPayments } = useQuery({
        queryKey: ['payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/user/${user.email}`);

            // Map payments to flatten sessionId and date fields
            return res.data.map(p => ({
                ...p,
                sessionId: p.sessionId?.$oid || p.sessionId || '',
                date: p.date?.$date || p.date || '',
            }));
        },
    });

    // Sessions data come with _id as string directly
    const { data: sessions = [], isLoading: loadingSessions } = useQuery({
        queryKey: ['sessions'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions');
            return res.data; // No extra normalization needed
        },
    });

    // Create a map from sessionId to session title
    const sessionIdToTitle = useMemo(() => {
        const map = {};
        sessions.forEach(s => {
            map[s._id] = s.title;
        });
        return map;
    }, [sessions]);

    // Filter payments by title or date matching searchTerm
    const filteredPayments = payments.filter(p => {
        const title = sessionIdToTitle[p.sessionId] || '';
        const dateStr = new Date(p.date).toLocaleDateString();
        return (
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dateStr.includes(searchTerm)
        );
    });

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const displayedPayments = filteredPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loadingPayments || loadingSessions) {
        return <p className="text-center text-lg text-gray-500">Loading payment history...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-primary">💰 My Payment History</h2>
                <input
                    type="text"
                    placeholder="Search by title or date..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="input input-bordered input-primary w-full md:w-80"
                />
            </div>

            {displayedPayments.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">No payment records found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full rounded-lg shadow-md border">
                        <thead className="bg-base-200 text-base-content">
                            <tr>
                                <th>#</th>
                                <th>Session Title</th>
                                <th>Amount</th>
                                <th>Transaction ID</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedPayments.map((p, index) => (
                                <tr key={p._id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{sessionIdToTitle[p.sessionId] || 'Unknown Title'}</td>
                                    <td className="text-green-600 font-semibold">৳{p.amount}</td>
                                    <td className="font-mono text-sm">{p.transactionId}</td>
                                    <td>{new Date(p.date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn btn-sm ${
                            currentPage === i + 1 ? 'btn-primary' : 'btn-outline'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaymentHistory;
