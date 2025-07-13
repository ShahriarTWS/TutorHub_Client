import React, { useEffect, useState } from 'react';
import { FaSearch, FaLinkedin } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AllTutors = () => {
    const axiosSecure = useAxiosSecure();
    const [tutors, setTutors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const tutorsPerPage = 10;

    // Fetch tutors
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const res = await axiosSecure.get('/tutors/all');
                const approvedTutors = res.data.filter(tutor => tutor.status === 'approved');
                setTutors(approvedTutors);
                setFilteredTutors(approvedTutors);
            } catch (error) {
                console.error('Failed to fetch tutors:', error);
            }
        };
        fetchTutors();
    }, [axiosSecure]);

    // Search logic
    useEffect(() => {
        const filtered = tutors.filter(tutor =>
            tutor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tutor.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTutors(filtered);
        setCurrentPage(1);
    }, [searchTerm, tutors]);

    // Pagination logic
    const indexOfLast = currentPage * tutorsPerPage;
    const indexOfFirst = indexOfLast - tutorsPerPage;
    const currentTutors = filteredTutors.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-6 text-primary">Our Tutors</h1>

            {/* Search */}
            <div className="flex justify-center mb-6">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="input input-bordered w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
            </div>

            {/* Tutor cards */}
            {/* Tutor cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentTutors.map((tutor) => (
                    <div
                        key={tutor._id}
                        className="bg-base-100 shadow-md hover:shadow-xl hover:scale-[1.01] transition duration-300 rounded-lg p-6 border border-gray-200 text-center"
                    >
                        <div className="flex justify-center mb-3">
                            <img
                                src={tutor.photo || 'https://i.ibb.co/ZYW3VTp/brown-brim.png'}
                                alt={tutor.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                            />
                        </div>
                        <h2 className="text-xl font-semibold">{tutor.name}</h2>
                        <p className="text-sm text-gray-600">{tutor.email}</p>
                        <p className="text-sm mt-1 text-blue-500 font-medium">Speciality: {tutor.speciality}</p>
                        <button
                            className="btn btn-sm btn-outline btn-primary mt-4"
                            onClick={() => setSelectedTutor(tutor)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>


            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                        key={num}
                        className={`btn btn-sm ${currentPage === num ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setCurrentPage(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Modal for tutor details */}
            {selectedTutor && (
                <dialog open className="modal" onClick={() => setSelectedTutor(null)}>
                    <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold mb-4 text-primary">Tutor Details</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src={selectedTutor.photo}
                                alt={selectedTutor.name}
                                className="w-full md:w-48 h-48 object-cover rounded"
                            />
                            <div className="space-y-2">
                                <p><strong>Name:</strong> {selectedTutor.name}</p>
                                <p><strong>Email:</strong> {selectedTutor.email}</p>
                                <p><strong>Experience:</strong> {selectedTutor.experience} years</p>
                                <p><strong>Speciality:</strong> {selectedTutor.speciality}</p>
                                {selectedTutor.bio && <p><strong>Bio:</strong> {selectedTutor.bio}</p>}
                                {selectedTutor.education && (
                                    <div className="mt-2">
                                        <p className="font-semibold">🎓 Education</p>
                                        <p><strong>Degree:</strong> {selectedTutor.education.degree}</p>
                                        <p><strong>Institution:</strong> {selectedTutor.education.institution}</p>
                                        <p><strong>Passing Year:</strong> {selectedTutor.education.year}</p>
                                        <p><strong>GPA:</strong> {selectedTutor.education.gpa}</p>
                                    </div>
                                )}
                                {selectedTutor.linkedin && (
                                    <p>
                                        <a
                                            href={selectedTutor.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <FaLinkedin /> LinkedIn Profile
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setSelectedTutor(null)}>Close</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AllTutors;
