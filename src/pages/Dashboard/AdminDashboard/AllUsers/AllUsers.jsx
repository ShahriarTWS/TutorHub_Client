import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const ROLES = ['admin', 'tutor', 'student'];
const ITEMS_PER_PAGE = 10;

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState('card');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-users', debouncedSearch, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get('/admin/users', {
                params: { search: debouncedSearch, page: currentPage, limit: ITEMS_PER_PAGE }
            });
            return res.data;
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

    const handleRoleChange = (userId, role) => {
        updateRoleMutation.mutate({ userId, role });
    };

    const handleViewInfo = async (user) => {
        if (user.role === 'tutor') {
            try {
                const res = await axiosSecure.get(`/tutors/email/${user.email}`);
                setSelectedUser({ ...user, ...res.data });
            } catch (err) {
                console.error('Error fetching tutor data:', err);
                setSelectedUser(user);
            }
        } else {
            setSelectedUser(user);
        }
    };

    const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 1;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-center sm:text-left">Manage Users</h1>
                <div className="flex gap-2 items-center">
                    <button className={`btn btn-sm ${viewMode === 'card' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('card')}>
                        Card View
                    </button>
                    <button className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('table')}>
                        Table View
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    className="input input-bordered w-full max-w-md"
                    placeholder="Search users by name or email"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {isLoading && <p className="text-center py-10">Loading users...</p>}
            {error && <p className="text-center text-red-500">Failed to load users</p>}
            {!isLoading && data && data.users.length === 0 && (
                <p className="text-center text-gray-500">No users found.</p>
            )}

            {/* Card View */}
            {!isLoading && data && data.users.length > 0 && viewMode === 'card' && (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    {data.users.map((user) => (
                        <div
                            key={user._id}
                            className="card bg-base-200 border rounded-lg shadow transform transition-transform duration-300 hover:scale-105"
                        >
                            <div className="card-body items-center text-center">
                                <div className="avatar">
                                    <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mb-2">
                                        <img src={user.photo || user.photoURL || '/default-avatar.png'} alt="User" />
                                    </div>
                                </div>
                                <h2 className="card-title text-lg">{user.name}</h2>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <p className="badge badge-info capitalize mt-1">{user.role}</p>

                                <div className="mt-4 w-full">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className="select select-bordered w-full"
                                        disabled={updateRoleMutation.isLoading}
                                    >
                                        {ROLES.map((roleOption) => (
                                            <option key={roleOption} value={roleOption}>
                                                {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button className="btn btn-sm btn-outline mt-3" onClick={() => handleViewInfo(user)}>
                                    View Info
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Table View */}
            {!isLoading && data && data.users.length > 0 && viewMode === 'table' && (
                <div className="overflow-x-auto mt-4">
                    <table className="table w-full border border-gray-300">
                        <thead className="bg-base-200">
                            <tr>
                                <th className="px-4 py-2 text-left">S/N</th>
                                <th className="px-4 py-2 text-left">Photo</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Role</th>
                                <th className="px-4 py-2 text-left">Change Role</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className="hover:bg-base-100 border-b border-gray-300 transition-all duration-200"
                                >
                                    <td className="px-4 py-2">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>{/* */}
                                    <td className="px-4 py-2">
                                        <div className="avatar">
                                            <div className="w-10 rounded-full">
                                                <img src={user.photo || user.photoURL || '/default-avatar.png'} alt="User" />
                                            </div>
                                        </div>
                                    </td>{/* */}
                                    <td className="px-4 py-2">{user.name}</td>{/* */}
                                    <td className="px-4 py-2">{user.email}</td>{/* */}
                                    <td className="px-4 py-2 capitalize">{user.role}</td>{/* */}
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
                                    </td>{/* */}
                                    <td className="px-4 py-2">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleViewInfo(user)}
                                        >
                                            View Info
                                        </button>

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

            {/* Info Modal */}
            {selectedUser && (
                <dialog open className="modal modal-bottom sm:modal-middle" onClick={() => setSelectedUser(null)}>
                    <div className="modal-box max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center mb-4">
                            <div className="avatar">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img
                                        src={selectedUser.photo || selectedUser.photoURL || '/default-avatar.png'}
                                        alt="User"
                                    />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mt-2">{selectedUser.name}</h3>
                            <p className="text-sm text-gray-600">{selectedUser.email}</p>
                            <p className="badge badge-info capitalize mt-1">{selectedUser.role}</p>
                        </div>

                        <div className="space-y-2 text-left text-sm">
                            {selectedUser.role === 'tutor' && (
                                <>
                                    {selectedUser.status && <p><strong>Status:</strong> {selectedUser.status}</p>}
                                    {selectedUser.experience && <p><strong>Experience:</strong> {selectedUser.experience} years</p>}
                                    {selectedUser.speciality && <p><strong>Speciality:</strong> {selectedUser.speciality}</p>}
                                    {selectedUser.education && (
                                        <p><strong>Education:</strong> {Object.values(selectedUser.education).join(', ')}</p>
                                    )}
                                    {selectedUser.bio && <p><strong>Bio:</strong> {selectedUser.bio}</p>}
                                    {selectedUser.linkedin && (
                                        <p><strong>LinkedIn:</strong> <a href={selectedUser.linkedin} target="_blank" className="link link-primary">View Profile</a></p>
                                    )}
                                </>
                            )}

                            {selectedUser.createdAt && (
                                <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                            )}
                            {selectedUser.uid && <p><strong>UID:</strong> {selectedUser.uid}</p>}
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-outline" onClick={() => setSelectedUser(null)}>Close</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AllUsers;
