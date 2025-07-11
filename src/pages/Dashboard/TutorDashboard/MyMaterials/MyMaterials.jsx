import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const MyMaterials = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [groupedMaterials, setGroupedMaterials] = useState({});
    const [sessionsMap, setSessionsMap] = useState({}); // sessionId => title
    const [loading, setLoading] = useState(true);

    // Fetch tutor materials and sessions titles
    useEffect(() => {
        const fetchMaterialsAndSessions = async () => {
            try {
                setLoading(true);

                // Fetch materials
                const materialsRes = await axiosSecure.get(`/materials/tutor/${user.email}`);
                const materials = materialsRes.data;

                // Group by sessionId
                const grouped = {};
                for (const mat of materials) {
                    const id = mat.sessionId;
                    if (!grouped[id]) grouped[id] = [];
                    grouped[id].push(mat);
                }
                setGroupedMaterials(grouped);

                // Fetch session titles for each sessionId
                const sessionIds = [...new Set(materials.map(m => m.sessionId))];
                if (sessionIds.length > 0) {
                    // Fetch session details in parallel
                    const sessionsData = await Promise.all(
                        sessionIds.map(id => axiosSecure.get(`/sessions/${id}`).then(res => res.data).catch(() => null))
                    );
                    // Create id→title map
                    const map = {};
                    sessionsData.forEach(session => {
                        if (session?._id) map[session._id] = session.title || 'Untitled Session';
                    });
                    setSessionsMap(map);
                }

            } catch (err) {
                console.error('Failed to load materials or sessions:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) fetchMaterialsAndSessions();
    }, [user?.email, axiosSecure]);

    // Delete material handler
    const handleDelete = async (id, sessionId) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "This resource will be permanently deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/materials/${id}`);
                setGroupedMaterials(prev => {
                    const updated = { ...prev };
                    updated[sessionId] = updated[sessionId].filter(mat => mat._id !== id);
                    if (updated[sessionId].length === 0) delete updated[sessionId];
                    return updated;
                });
                Swal.fire('Deleted!', 'Material deleted.', 'success');
            } catch (err) {
                Swal.fire('Error!', 'Failed to delete.', 'error');
            }
        }
    };

    // Edit material handler with nicer Swal form
    const handleEdit = async (material) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit Material',
            html: `
        <input id="swal-title" class="swal2-input" placeholder="Title" value="${material.title || ''}">
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Description">${material.description || ''}</textarea>
        <input id="swal-link" class="swal2-input" placeholder="Resource Link" value="${material.resourceLink || ''}">`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    title: document.getElementById('swal-title').value.trim(),
                    description: document.getElementById('swal-desc').value.trim(),
                    resourceLink: document.getElementById('swal-link').value.trim(),
                };
            },
            width: '400px',
        });

        if (formValues) {
            try {
                await axiosSecure.patch(`/materials/${material._id}`, formValues);
                setGroupedMaterials(prev => {
                    const updated = { ...prev };
                    updated[material.sessionId] = updated[material.sessionId].map(mat =>
                        mat._id === material._id ? { ...mat, ...formValues } : mat
                    );
                    return updated;
                });
                Swal.fire('Updated!', 'Material updated.', 'success');
            } catch (err) {
                Swal.fire('Error!', 'Failed to update material.', 'error');
            }
        }
    };

    return (
        <section className="w-11/12 md:w-10/12 mx-auto py-16">
            <h1 className="text-3xl font-bold mb-10 text-center text-primary">My Uploaded Materials</h1>

            {loading ? (
                <div className="flex justify-center items-center space-x-2">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-primary border-t-transparent"></div>
                    <span className="text-lg font-semibold text-gray-600">Loading materials...</span>
                </div>
            ) : Object.keys(groupedMaterials).length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No materials uploaded yet.</p>
            ) : (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                    {Object.entries(groupedMaterials).map(([sessionId, resources]) => (
                        <div key={sessionId} className="border p-6 rounded-lg shadow-lg bg-base-200">
                            <h3 className="text-2xl font-semibold text-secondary mb-4">
                                {sessionsMap[sessionId] || 'Session Title Not Found'}
                            </h3>
                            <div className="space-y-4">
                                {resources.map(mat => (
                                    <div key={mat._id} className="border border-base-300 rounded p-4 bg-base-100 shadow-sm">
                                        <p className="font-bold text-lg">{mat.title}</p>
                                        <p className="text-gray-700 mb-2">{mat.description}</p>

                                        {mat.resourceLink && (
                                            <p className="text-blue-600 underline break-all mb-1">
                                                <strong>Link: </strong>
                                                <a href={mat.resourceLink} target="_blank" rel="noreferrer">{mat.resourceLink}</a>
                                            </p>
                                        )}
                                        {mat.fileURL && (
                                            <p className="text-blue-600 underline">
                                                <strong>File: </strong>
                                                <a href={mat.fileURL} target="_blank" rel="noreferrer" download>
                                                    Download
                                                </a>
                                            </p>
                                        )}

                                        <div className="mt-3 flex space-x-3">
                                            <button
                                                onClick={() => handleEdit(mat)}
                                                className="btn btn-sm btn-warning"
                                                title="Edit Material"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mat._id, mat.sessionId)}
                                                className="btn btn-sm btn-error"
                                                title="Delete Material"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MyMaterials;
