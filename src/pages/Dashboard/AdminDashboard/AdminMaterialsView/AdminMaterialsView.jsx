import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { FaEdit, FaTrash, FaDownload, FaTh, FaList } from 'react-icons/fa';
import { debounce } from 'lodash';

const AdminMaterialsView = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [materialForm, setMaterialForm] = useState({
        title: '',
        description: '',
        resourceLink: '',
        fileURL: ''
    });

    const [viewMode, setViewMode] = useState('card');
    const [search, setSearch] = useState('');
    const [groupedMaterials, setGroupedMaterials] = useState({});
    const [sessionMap, setSessionMap] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const materialsPerPage = 4;

    // Fetch all materials
    const { data: materials = [], isLoading } = useQuery({
        queryKey: ['materials'],
        queryFn: async () => {
            const res = await axiosSecure.get('/materials');
            return res.data;
        },
    });

    // Group materials by sessionId and fetch session titles
    useEffect(() => {
        const groupAndFetchSessions = async () => {
            const keyword = search.toLowerCase();

            const filtered = materials.filter(mat =>
                mat.title.toLowerCase().includes(keyword) ||
                mat.uploadedBy.toLowerCase().includes(keyword)
            );

            const grouped = {};
            for (const mat of filtered) {
                const sid = mat.sessionId;
                if (!grouped[sid]) grouped[sid] = [];
                grouped[sid].push(mat);
            }
            setGroupedMaterials(grouped);

            const sessionIds = Object.keys(grouped);
            const sessionResults = await Promise.all(
                sessionIds.map(id =>
                    axiosSecure.get(`/sessions/${id}`).then(res => res.data).catch(() => null)
                )
            );

            const map = {};
            sessionResults.forEach(session => {
                if (session?._id) map[session._id] = session.title || 'Untitled Session';
            });
            setSessionMap(map);
            setCurrentPage(1);
        };

        const debounced = debounce(groupAndFetchSessions, 300);
        debounced();
        return () => debounced.cancel();
    }, [search, materials, axiosSecure]);

    const paginatedSessionIds = Object.keys(groupedMaterials).slice(
        (currentPage - 1) * materialsPerPage,
        currentPage * materialsPerPage
    );

    const totalPages = Math.ceil(Object.keys(groupedMaterials).length / materialsPerPage);

    const updateMutation = useMutation({
        mutationFn: async (updatedData) => {
            return await axiosSecure.patch(`/materials/${selectedMaterial._id}`, updatedData);
        },
        onSuccess: () => {
            Swal.fire('Success', 'Material updated', 'success');
            queryClient.invalidateQueries(['materials']);
            setSelectedMaterial(null);
        },
        onError: () => {
            Swal.fire('Error', 'Failed to update', 'error');
        }
    });

    const deleteMaterial = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This material will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/materials/${id}`);
                queryClient.invalidateQueries(['materials']);
                Swal.fire('Deleted!', 'Material has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete material', 'error');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMaterialForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        updateMutation.mutate(materialForm);
    };

    const handleExport = () => {
        const headers = ['Title', 'Description', 'Resource Link', 'File URL', 'Uploaded By'];
        const rows = materials.map(m =>
            [m.title, m.description, m.resourceLink, m.fileURL, m.uploadedBy]
        );
        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'materials.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const openModal = (material) => {
        setSelectedMaterial(material);
        setMaterialForm({
            title: material.title || '',
            description: material.description || '',
            resourceLink: material.resourceLink || '',
            fileURL: material.fileURL || ''
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-primary">Admin - Study Materials</h1>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search by title or tutor email..."
                        className="input input-bordered w-64"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-secondary" onClick={handleExport}>
                        <FaDownload className="mr-2" /> Export
                    </button>
                    <button onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')} className="btn btn-outline">
                        {viewMode === 'card' ? <FaList /> : <FaTh />}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <p className="text-center">Loading materials...</p>
            ) : viewMode === 'table' ? (
                <div className="overflow-x-auto">
                    <table className="table w-full border border-base-300">
                        <thead className="bg-base-200">
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Resource</th>
                                <th>File</th>
                                <th>Uploader</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materials.map((material) => (
                                <tr key={material._id}>
                                    <td>{material.title}</td>
                                    <td>{material.description}</td>
                                    <td>{material.resourceLink ? <a href={material.resourceLink} className="link link-primary" target="_blank" rel="noreferrer">Link</a> : '-'}</td>
                                    <td>{material.fileURL ? <a href={material.fileURL} className="link link-primary" target="_blank" rel="noreferrer">File</a> : '-'}</td>
                                    <td>{material.uploadedBy}</td>
                                    <td className="flex gap-2">
                                        <button className="btn btn-sm btn-info" onClick={() => openModal(material)}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn btn-sm btn-error" onClick={() => deleteMaterial(material._id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {paginatedSessionIds.map(sessionId => (
                        <div key={sessionId} className=" rounded-lg shadow p-5 bg-base-200">
                            <h2 className="text-xl font-bold text-secondary mb-3">{sessionMap[sessionId] || 'Session Title Not Found'}</h2>
                            <div className="space-y-4">
                                {groupedMaterials[sessionId].map(mat => (
                                    <div key={mat._id} className="bg-base-100 p-4 rounded shadow ">
                                        <h3 className="text-lg font-semibold">{mat.title}</h3>
                                        <p className="text-sm">{mat.description}</p>
                                        <p className="text-xs text-gray-600 mb-1"><strong>Uploader:</strong> {mat.uploadedBy}</p>
                                        {mat.resourceLink && (
                                            <a href={mat.resourceLink} target="_blank" rel="noreferrer" className="text-blue-600 underline block">
                                                View Resource
                                            </a>
                                        )}
                                        {mat.fileURL && (
                                            <a href={mat.fileURL} target="_blank" rel="noreferrer" className="text-blue-600 underline block">
                                                Download File
                                            </a>
                                        )}
                                        <div className="flex gap-2 mt-3 justify-end">
                                            <button className="btn btn-sm btn-info" onClick={() => openModal(mat)}><FaEdit /></button>
                                            <button className="btn btn-sm btn-error" onClick={() => deleteMaterial(mat._id)}><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {viewMode === 'card' && totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Update Modal */}
            {selectedMaterial && (
                <dialog open className="modal modal-bottom sm:modal-middle" onClick={() => setSelectedMaterial(null)}>
                    <div className="modal-box max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Update Material</h3>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <input name="title" value={materialForm.title} onChange={handleChange} className="input input-bordered w-full" placeholder="Title" required />
                            <textarea name="description" value={materialForm.description} onChange={handleChange} className="textarea textarea-bordered w-full" placeholder="Description" required />
                            <input name="resourceLink" value={materialForm.resourceLink} onChange={handleChange} className="input input-bordered w-full" placeholder="Resource Link (optional)" />
                            <input name="fileURL" value={materialForm.fileURL} onChange={handleChange} className="input input-bordered w-full" placeholder="File URL (optional)" />
                            <div className="modal-action flex justify-between">
                                <button type="submit" className="btn btn-primary">{updateMutation.isLoading ? 'Updating...' : 'Update'}</button>
                                <button type="button" className="btn btn-outline" onClick={() => setSelectedMaterial(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default AdminMaterialsView;
