import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';


const ROLES = ['admin', 'tutor', 'student'];
const ITEMS_PER_PAGE = 10;

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search input by 500ms
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-users', debouncedSearch, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/users', {
                params: {
                    search: debouncedSearch,
                    page: currentPage,
                    limit: ITEMS_PER_PAGE
                }
            });
            return res.data; // expect { users: [], total: number }
        },
        keepPreviousData: true,
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }) => {
            return await axiosSecure.patch(`/admin/users/${userId}/role`, { role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            Swal.fire('Success', 'User role updated', 'success');
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update role', 'error');
        },
    });


    // Handler to update role
    const handleRoleChange = (userId, role) => {
        updateRoleMutation.mutate({ userId, role });
    };

    // Pagination
    const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Users</h1>

            <div className="mb-4 flex justify-center">
                <input
                    type="text"
                    className="input input-bordered w-full max-w-md"
                    placeholder="Search users by name or email"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // reset page on search change
                    }}
                />
            </div>

            {isLoading && <p className="text-center py-10">Loading users...</p>}
            {error && <p className="text-center text-red-500">Failed to load users</p>}

            {!isLoading && data && data.users.length === 0 && (
                <p className="text-center text-gray-500">No users found.</p>
            )}

            {!isLoading && data && data.users.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table w-full border border-gray-300">
                        <thead className="bg-base-200">
                            <tr>
                                <th className="text-left px-4 py-2">Name</th>
                                <th className="text-left px-4 py-2">Email</th>
                                <th className="text-left px-4 py-2">Role</th>
                                <th className="text-left px-4 py-2">Change Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map((user) => (
                                <tr key={user._id} className="hover:bg-base-100">
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2 capitalize">{user.role}</td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="select select-bordered w-full max-w-xs"
                                            disabled={updateRoleMutation.isLoading}
                                        >
                                            {ROLES.map((roleOption) => (
                                                <option key={roleOption} value={roleOption}>
                                                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2 flex-wrap">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`btn btn-sm ${currentPage === idx + 1 ? 'btn-primary' : 'btn-outline'}`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllUsers;
