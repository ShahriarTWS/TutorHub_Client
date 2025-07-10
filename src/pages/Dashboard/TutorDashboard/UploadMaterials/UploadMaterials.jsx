import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import useAuth from '../../../../hooks/useAuth';

const UploadMaterials = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [selectedSession, setSelectedSession] = useState(null);
    const [link, setLink] = useState('');
    const [file, setFile] = useState(null);

    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ['approved-sessions', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tutors/${user.email}/approved-sessions`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const uploadMutation = useMutation({
        mutationFn: async ({ sessionId, title, description, resourceLink, fileURL, uploadedBy }) => {
            return await axiosSecure.post(`/materials/${sessionId}`, {
                title,
                description,
                resourceLink,
                fileURL,
                uploadedBy,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['approved-sessions', user?.email]);
            Swal.fire('Success', 'Material uploaded successfully!', 'success');
            setSelectedSession(null);
            setLink('');
            setFile(null);
        },
        onError: () => {
            Swal.fire('Error', 'Failed to upload material', 'error');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!link && !file) {
            return Swal.fire('Error', 'Please provide at least a link or a file.', 'error');
        }

        let fileURL = '';
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

            try {
                const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                console.log('imgbb upload response:', data);
                if (data.success) {
                    fileURL = data.data.url;
                } else {
                    throw new Error(data.error?.message || 'Upload failed');
                }
            } catch (error) {
                console.error('imgbb upload error:', error);
                return Swal.fire('Error', 'Image upload failed!', 'error');
            }
        }

        uploadMutation.mutate({
            sessionId: selectedSession._id,
            title: selectedSession.title,
            description: selectedSession.description,
            uploadedBy: user?.email,
            resourceLink: link,
            fileURL,
        });
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Upload Materials for Approved Sessions</h2>

            {isLoading ? (
                <p className="text-center">Loading sessions...</p>
            ) : sessions.length === 0 ? (
                <p className="text-center text-gray-500">No approved sessions found.</p>
            ) : (
                <div className="grid sm:grid-cols-3 gap-6">
                    {sessions.map((session) => (
                        <div key={session._id} className="bg-base-200 p-4 rounded-lg shadow space-y-1">
                            <h3 className="text-lg font-semibold">{session.title}</h3>
                            <p className="text-sm text-gray-600">{session.description}</p>
                            <p><strong>Category:</strong> {session.category || 'N/A'}</p>
                            <p><strong>Duration:</strong> {session.duration || 'N/A'} mins</p>
                            <p><strong>Tutor:</strong> {session.tutorName} ({session.tutorEmail})</p>
                            <p><strong>Class Dates:</strong> {new Date(session.classStart).toLocaleDateString()} to {new Date(session.classEnd).toLocaleDateString()}</p>
                            <p><strong>Registration Fee:</strong> ${session.registrationFee || 0}</p>

                            <button
                                className="btn btn-sm btn-primary mt-2"
                                onClick={() => {
                                    setSelectedSession(session);
                                    setLink('');
                                    setFile(null);
                                }}
                            >
                                Upload Materials
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {selectedSession && (
                <dialog open className="modal modal-bottom sm:modal-middle" onClick={() => setSelectedSession(null)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-lg mb-2">Upload Materials for {selectedSession.title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">Resource Link (optional)</label>
                                <input
                                    type="url"
                                    className="input input-bordered w-full"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="https://example.com/resource"
                                />
                            </div>

                            <div>
                                <label className="label">Upload Image File (optional)</label>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="file-input file-input-bordered w-full"
                                />
                            </div>

                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary" disabled={uploadMutation.isLoading}>
                                    {uploadMutation.isLoading ? 'Uploading...' : 'Submit'}
                                </button>
                                <button type="button" className="btn" onClick={() => setSelectedSession(null)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default UploadMaterials;
