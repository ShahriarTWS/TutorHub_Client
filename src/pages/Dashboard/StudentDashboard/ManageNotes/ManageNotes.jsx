import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageNotes = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editingNote, setEditingNote] = useState(null);
    const [expandedNoteId, setExpandedNoteId] = useState(null);

    const { data: notes = [], isLoading, refetch } = useQuery({
        queryKey: ['notes', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notes/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.delete(`/notes/${id}`);
                Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
                refetch();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete note', 'error');
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { _id, title, content } = editingNote;

        if (!title.trim() || !content.trim()) {
            return Swal.fire('Error', 'Both fields are required', 'error');
        }

        try {
            await axiosSecure.patch(`/notes/${_id}`, { title, content });
            setEditingNote(null);
            Swal.fire('Success', 'Note updated successfully!', 'success');
            refetch();
        } catch (error) {
            Swal.fire('Error', 'Failed to update note', 'error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-primary">
                📓 Manage My Notes
            </h2>

            {isLoading ? (
                <div className="text-center text-lg font-medium">Loading notes...</div>
            ) : notes.length === 0 ? (
                <div className="text-center text-gray-500">No notes found.</div>
            ) : (
                <div className="space-y-5">
                    {notes.map((note) => (
                        <div
                            key={note._id}
                            className="bg-white border border-gray-200 rounded-xl shadow-md transition duration-200 hover:shadow-lg"
                        >
                            <div
                                className="cursor-pointer flex items-center justify-between px-5 py-4"
                                onClick={() =>
                                    setExpandedNoteId((prev) => (prev === note._id ? null : note._id))
                                }
                            >
                                <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                                <span className="text-sm text-primary">
                                    {expandedNoteId === note._id ? '▲ Hide' : '▼ Show'}
                                </span>
                            </div>

                            {expandedNoteId === note._id && (
                                <div className="px-5 pb-4 text-gray-700 border-t border-gray-100">
                                    <p className="whitespace-pre-line py-4">{note.content}</p>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => setEditingNote(note)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => handleDelete(note._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingNote && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white max-w-md w-full p-6 rounded-lg shadow-lg animate__animated animate__fadeInDown">
                        <h3 className="text-2xl font-bold text-center mb-5 text-primary">✏️ Edit Note</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Note Title"
                                className="input input-bordered w-full"
                                value={editingNote.title}
                                onChange={(e) =>
                                    setEditingNote({ ...editingNote, title: e.target.value })
                                }
                            />
                            <textarea
                                className="textarea textarea-bordered w-full"
                                rows={5}
                                placeholder="Write your note here..."
                                value={editingNote.content}
                                onChange={(e) =>
                                    setEditingNote({ ...editingNote, content: e.target.value })
                                }
                            ></textarea>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setEditingNote(null)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageNotes;
