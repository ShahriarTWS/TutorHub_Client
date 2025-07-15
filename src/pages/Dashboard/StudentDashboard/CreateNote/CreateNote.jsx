import React, { useState } from 'react';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const CreateNote = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setMessage({ type: 'error', text: 'Title and description are required.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const noteData = {
                title,
                content,
                studentEmail: user?.email,
            };

            const response = await axiosSecure.post('/notes', noteData);

            if (response.data?.insertedId) {
                setMessage({ type: 'success', text: 'Note created successfully!' });
                setTitle('');
                setContent('');
            } else {
                setMessage({ type: 'error', text: 'Failed to create note.' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Create a New Note</h2>

            {message && (
                <div
                    className={`mb-4 p-3 rounded ${message.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-semibold mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="title" className="block font-semibold mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter note title"
                        disabled={loading}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block font-semibold mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        className="textarea textarea-bordered w-full"
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your note here..."
                        disabled={loading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Note'}
                </button>
            </form>
        </div>
    );
};

export default CreateNote;
