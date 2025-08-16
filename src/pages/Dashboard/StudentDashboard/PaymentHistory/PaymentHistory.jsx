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

    const { data: payments = [], isLoading: loadingPayments } = useQuery({
        queryKey: ['payments', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/user/${user.email}`);
            return res.data.map(p => ({
                ...p,
                sessionId: p.sessionId?.$oid || p.sessionId || '',
                date: p.date?.$date || p.date || '',
            }));
        },
    });

    const { data: sessions = [], isLoading: loadingSessions } = useQuery({
        queryKey: ['sessions'],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions');
            return res.data;
        },
    });

    const sessionIdToTitle = useMemo(() => {
        const map = {};
        sessions.forEach(s => {
            map[s._id] = s.title;
        });
        return map;
    }, [sessions]);

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
        <div className="w-11/12 mx-auto py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-primary">💰 My Payment History</h2>
                <input
                    type="text"
                    placeholder="Search by session or date..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="input input-bordered input-primary w-full md:w-80"
                />
            </div>

            {/* No Payments */}
            {displayedPayments.length === 0 && (
                <p className="text-gray-500 text-center mt-20 text-lg">No payment records found.</p>
            )}

            {/* Payment Cards */}
            <div className="space-y-6">
                {displayedPayments.map((p, index) => (
                    <div
                        key={p._id}
                        className="bg-white shadow-md rounded-xl border border-gray-200 p-6 transition-transform hover:scale-[1.02] w-full"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold text-secondary truncate w-3/4">
                                {sessionIdToTitle[p.sessionId] || 'Unknown Title'}
                            </h3>
                            <p className="text-green-600 font-bold text-lg">৳{p.amount}</p>
                        </div>
                        <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Transaction ID:</span> {p.transactionId}
                        </p>
                        <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Paid At:</span> {new Date(p.date).toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm"># {(currentPage - 1) * itemsPerPage + index + 1}</p>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaymentHistory;
