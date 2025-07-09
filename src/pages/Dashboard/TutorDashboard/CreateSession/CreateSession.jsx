import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

import useAuth from '../../../../hooks/useAuth';
import useRole from '../../../../hooks/useRole';
import useAxios from '../../../../hooks/useAxios';

const CreateStudySession = () => {
    const { user } = useAuth();
    const [role] = useRole(); // Detect if admin
    const axiosInstant = useAxios();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

    const onSubmit = async (data) => {
        try {
            // Upload image
            const imageFile = data.sessionImage[0];
            const formData = new FormData();
            formData.append('image', imageFile);

            const imgbbRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                formData
            );
            const imageUrl = imgbbRes.data.data.url;

            // Prepare data
            const sessionData = {
                title: data.title,
                tutorName: user.displayName,
                tutorEmail: user.email,
                description: data.description,
                registrationStart: data.registrationStart,
                registrationEnd: data.registrationEnd,
                classStart: data.classStart,
                classEnd: data.classEnd,
                duration: data.duration,
                registrationFee: role === 'admin' ? parseFloat(data.registrationFee) : 0,
                status: 'pending',
                image: imageUrl,
            };

            // Send to backend
            const res = await axiosInstant.post('/sessions', sessionData);
            if (res.data.insertedId) {
                Swal.fire('Success!', 'Study session created.', 'success');
                reset();
            } else {
                Swal.fire('Error', 'Failed to create session', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-base-200 rounded-lg shadow">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">Create Study Session</h2>
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
                    className="input input-bordered w-full bg-gray-100"
                />
                <input
                    type="email"
                    readOnly
                    value={user.email}
                    className="input input-bordered w-full bg-gray-100"
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
                    placeholder="Session Duration (e.g., 2 weeks)"
                    className="input input-bordered w-full"
                />
                {errors.duration && <p className="text-red-500">Duration is required</p>}

                <input
                    {...register('registrationFee')}
                    type="number"
                    defaultValue={0}
                    readOnly={role !== 'admin'}
                    className={`input input-bordered w-full ${role !== 'admin' ? 'bg-gray-100' : ''}`}
                    placeholder="Registration Fee"
                />

                <input
                    {...register('sessionImage', { required: true })}
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                />
                {errors.sessionImage && <p className="text-red-500">Image is required</p>}

                <button
                    type="submit"
                    className="btn btn-primary w-full mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Create Session'}
                </button>
            </form>
        </div>
    );
};

export default CreateStudySession;
