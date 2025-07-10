import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';

import useAuth from '../../../../hooks/useAuth';
import useRole from '../../../../hooks/useRole';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const UpdateStudySession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstant = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [role] = useRole();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();

    const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

    // Fetch session details by ID
    const { data: sessionData, isLoading } = useQuery({
        queryKey: ['session', id],
        queryFn: async () => {
            const res = await axiosInstant.get(`/sessions/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    // Prefill form when session data loads
    useEffect(() => {
        if (sessionData) {
            const fields = [
                'title', 'description', 'registrationStart', 'registrationEnd',
                'classStart', 'classEnd', 'duration', 'registrationFee'
            ];
            fields.forEach(field => setValue(field, sessionData[field]));
        }
    }, [sessionData, setValue]);

    // Mutation to update session
    // Mutation to CREATE a new session using updated data
    const updateMutation = useMutation({
        mutationFn: async (data) => {
            let imageUrl = sessionData.image;

            if (data.sessionImage?.[0]) {
                const formData = new FormData();
                formData.append('image', data.sessionImage[0]);

                const imgbbRes = await axiosInstant.post(
                    `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                    formData
                );
                imageUrl = imgbbRes.data.data.url;
            }

            const newSession = {
                title: data.title,
                description: data.description,
                registrationStart: data.registrationStart,
                registrationEnd: data.registrationEnd,
                classStart: data.classStart,
                classEnd: data.classEnd,
                duration: data.duration,
                registrationFee: role === 'admin' ? parseFloat(data.registrationFee) : 0,
                image: imageUrl,
                tutorName: user.displayName,
                tutorEmail: user.email,
                status: 'pending',
            };

            return axiosInstant.post('/sessions', newSession);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['mySessions']);
            Swal.fire('Success!', 'New session created from existing one.', 'success');
            navigate('/dashboard/view-study-sessions');
        },
        onError: () => Swal.fire('Error', 'Failed to create new session.', 'error')
    });


    const onSubmit = (data) => {
        updateMutation.mutate(data);
    };

    if (isLoading) return <p className="text-center">Loading session data...</p>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-base-200 rounded-lg shadow">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">Update Study Session</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <input
                    {...register('title', { required: true })}
                    type="text"
                    placeholder="Session Title"
                    className="input input-bordered w-full"
                />
                {errors.title && <p className="text-red-500">Title is required</p>}

                <input
                    type="text"
                    readOnly
                    value={user.displayName}
                    className="input input-bordered w-full"
                />
                <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="input input-bordered w-full"
                />

                <textarea
                    {...register('description', { required: true })}
                    placeholder="Session Description"
                    className="textarea textarea-bordered w-full"
                />
                {errors.description && <p className="text-red-500">Description is required</p>}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Registration Start</label>
                        <input
                            {...register('registrationStart', { required: true })}
                            type="date"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div>
                        <label className="label">Registration End</label>
                        <input
                            {...register('registrationEnd', { required: true })}
                            type="date"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Class Start</label>
                        <input
                            {...register('classStart', { required: true })}
                            type="date"
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div>
                        <label className="label">Class End</label>
                        <input
                            {...register('classEnd', { required: true })}
                            type="date"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                <input
                    {...register('duration', { required: true })}
                    type="text"
                    placeholder="Session Duration"
                    className="input input-bordered w-full"
                />
                {errors.duration && <p className="text-red-500">Duration is required</p>}

                <input
                    {...register('registrationFee')}
                    type="number"
                    readOnly={role !== 'admin'}
                    className="input input-bordered w-full"
                    placeholder="Registration Fee"
                />

                {/* <div>
                    <label className="label">Update Image (optional)</label>
                    <input
                        {...register('sessionImage')}
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                    />
                </div> */}

                <button
                    type="submit"
                    className="btn btn-primary w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Updating...' : 'Update Session'}
                </button>
            </form>
        </div>
    );
};

export default UpdateStudySession;
