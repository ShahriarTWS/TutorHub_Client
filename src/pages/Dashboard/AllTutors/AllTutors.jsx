import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaChalkboardTeacher, FaTrash, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ITEMS_PER_PAGE = 6;

const AllTutors = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch all tutors
    const { data: tutors = [], isLoading } = useQuery({
        queryKey: ['all-tutors'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tutors/all');
            return res.data;
        },
    });

    // Mutation for deleting a tutor
    const deleteTutorMutation = useMutation({
        mutationFn: async (id) => {
            return await axiosSecure.delete(`/tutors/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['all-tutors']);
            Swal.fire('Deleted!', 'Tutor has been deleted.', 'success');
        },
        onError: () => {
            Swal.fire('Error', 'Something went wrong!', 'error');
        },
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently remove the tutor.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTutorMutation.mutate(id);
            }
        });
    };

    // Filter tutors by search
    const filteredTutors = tutors.filter((tutor) =>
        tutor.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        tutor.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredTutors.length / ITEMS_PER_PAGE);
    const paginatedTutors = filteredTutors.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when search text changes
    }, [searchText]);

    if (isLoading) {
        return <div className="text-center py-20 text-lg font-semibold">Loading tutors...</div>;
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                <FaChalkboardTeacher className="text-primary" /> All Tutors
            </h2>

            <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2 w-full sm:w-80">
                    <FaSearch className="text-gray-500" />
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Search by name or email"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            {filteredTutors.length === 0 ? (
                <p className="text-center text-gray-500">No tutors found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedTutors.map((tutor) => (
                        <div
                            key={tutor._id}
                            className="bg-base-200 rounded-xl p-5 shadow-lg flex flex-col items-center text-center transition hover:scale-[1.02]"
                        >
                            <img
                                src={tutor.photo || 'https://i.ibb.co/jkQ1q8R/default-user.png'}
                                alt={`${tutor.name} profile`}
                                className="w-24 h-24 rounded-full object-cover mb-4 shadow"
                            />
                            <h3 className="text-lg font-semibold">{tutor.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{tutor.email}</p>
                            <p className="mt-2 text-sm">
                                <strong>Speciality:</strong> {tutor.speciality}
                            </p>

                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setSelectedTutor(tutor)}
                                    className="btn btn-sm btn-primary"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleDelete(tutor._id)}
                                    className="btn btn-sm btn-error text-base-100"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2 flex-wrap">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`btn btn-sm ${currentPage === idx + 1 ? 'btn-primary' : 'btn-outline'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedTutor && (
    <dialog open className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Left side: Text content */}
                <div className="flex-1 text-left space-y-2 text-sm">
                    <h3 className="text-xl font-bold mb-2">{selectedTutor.name}</h3>
                    <p><strong>Email:</strong> {selectedTutor.email}</p>
                    <p><strong>Experience:</strong> {selectedTutor.experience} years</p>
                    <p><strong>Speciality:</strong> {selectedTutor.speciality}</p>
                    <p><strong>Degree:</strong> {selectedTutor.education?.degree}</p>
                    <p><strong>Institution:</strong> {selectedTutor.education?.institution}</p>
                    <p><strong>Passing Year:</strong> {selectedTutor.education?.year}</p>
                    <p><strong>GPA:</strong> {selectedTutor.education?.gpa}</p>
                    <p><strong>Bio:</strong> {selectedTutor.bio}</p>
                    {selectedTutor.linkedin && (
                        <p>
                            <strong>LinkedIn:</strong>{' '}
                            <a
                                href={selectedTutor.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="link link-primary"
                            >
                                View Profile
                            </a>
                        </p>
                    )}
                </div>

                {/* Right side: Photo */}
                <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                    <img
                        src={selectedTutor.photo || 'https://i.ibb.co/jkQ1q8R/default-user.png'}
                        alt={`${selectedTutor.name} profile`}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="modal-action mt-4">
                <button
                    onClick={() => setSelectedTutor(null)}
                    className="btn btn-outline"
                >
                    Close
                </button>
            </div>
        </div>
    </dialog>
)}

        </div>
    );
};

export default AllTutors;
