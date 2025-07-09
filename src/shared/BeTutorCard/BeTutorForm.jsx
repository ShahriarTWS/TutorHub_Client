import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';

const BeTutorForm = () => {
    const { user } = useAuth();
    const [gpaScale, setGpaScale] = useState('5.00');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm();

    const { data: tutor = {}, isLoading } = useQuery({
        queryKey: ['tutor-status', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/tutors/email/${user.email}`);
            return res.data;
        },
    });

    // Redirect if already approved
    useEffect(() => {
        if (tutor?.status === 'approved') {
            navigate('/dashboard');
        }
    }, [tutor, navigate]);

    // Populate form with previous data if rejected and data exists
    useEffect(() => {
        if (tutor?.status === 'cancelled' && tutor?.name) {
            // Prefill form with previous data to allow editing and reapply
            setValue('name', tutor.name);
            setValue('email', tutor.email);
            setValue('experience', tutor.experience);
            setValue('speciality', tutor.speciality);
            setValue('education.degree', tutor.education?.degree);
            setValue('education.institution', tutor.education?.institution);
            setValue('education.year', tutor.education?.year);
            setValue('education.gpa', tutor.education?.gpa);
            setValue('bio', tutor.bio);
            setValue('linkedin', tutor.linkedin);
            setGpaScale(tutor.education?.gpa ? String(tutor.education.gpa) : '5.00');
        }
    }, [tutor, setValue]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                role: 'tutor',
                status: 'pending', // reset status on re-application
            };

            let response;
            if (tutor?._id) {
                // Update existing tutor application
                response = await axiosSecure.patch(`/tutors/${tutor._id}`, payload);
            } else {
                // New tutor application
                response = await axiosSecure.post('/tutors', payload);
            }

            if (response.data?.modifiedCount > 0 || response.data?.insertedId || response.status === 200) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted',
                    text: 'Your tutor application has been sent successfully!',
                    confirmButtonText: 'OK',
                });
                reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'Failed to submit application. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error submitting tutor application:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while submitting the application.',
            });
        }
    };

    if (isLoading) {
        return <div className="text-center py-20 text-lg">Loading...</div>;
    }

    if (tutor?.status === 'pending') {
        return (
            <section className="min-h-[90vh] flex items-center justify-center p-4">
                <div className="w-full max-w-xl bg-base-200 p-8 rounded-2xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-4">Your Application is Pending</h2>
                    <p className="text-gray-500">We are reviewing your tutor application. You will be notified upon approval.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-[90vh] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-base-200 p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">
                    {tutor?.status === 'cancelled' ? 'Update Your Tutor Application' : 'Become a Tutor'}
                </h2>

                {/* Show rejection feedback if exists */}
                {tutor?.status === 'cancelled' && tutor?.feedback && (
                    <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
                        <h3 className="font-semibold mb-2">Application Rejected</h3>
                        <p>Please review the feedback below and update your application accordingly:</p>
                        <blockquote className="mt-2 italic border-l-4 border-red-500 pl-4">
                            {tutor.feedback}
                        </blockquote>
                    </div>
                )}

                {/* Show rejection feedback if exists */}
                {tutor?.status === 'cancelled' && tutor?.feedback && (
                    <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
                        <h3 className="font-semibold mb-2">Application Rejected</h3>
                        <p>Please review the feedback below and update your application accordingly:</p>
                        <blockquote className="mt-2 italic border-l-4 border-red-500 pl-4">
                            {tutor.feedback}
                        </blockquote>
                    </div>
                )}

                {/* Show general rejection message if no feedback */}
                {tutor?.status === 'cancelled' && !tutor?.feedback && (
                    <div className="mb-6 p-4 rounded-lg bg-yellow-100 border border-yellow-400 text-yellow-700">
                        <p>Your previous application was rejected. Please update and resubmit.</p>
                    </div>
                )}


                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block mb-1 font-medium">Full Name</label>
                        <input
                            type="text"
                            defaultValue={user?.displayName || ''}
                            readOnly
                            className="input input-bordered w-full bg-base-100"
                            {...register('name')}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            defaultValue={user?.email || ''}
                            readOnly
                            className="input input-bordered w-full bg-base-100"
                            {...register('email')}
                        />
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block mb-1 font-medium">Years of Experience</label>
                        <input
                            type="number"
                            {...register('experience', { required: 'Experience is required' })}
                            className="input input-bordered w-full"
                            placeholder="e.g., 3"
                        />
                        {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
                    </div>

                    {/* Speciality */}
                    <div>
                        <label className="block mb-1 font-medium">Subject Speciality</label>
                        <input
                            type="text"
                            {...register('speciality', { required: 'Speciality is required' })}
                            className="input input-bordered w-full"
                            placeholder="e.g., Physics, Math"
                        />
                        {errors.speciality && <p className="text-red-500 text-sm mt-1">{errors.speciality.message}</p>}
                    </div>

                    {/* Educational Qualification */}
                    <div>
                        <label className="block mb-2 font-semibold">Educational Qualification</label>
                        <div className="space-y-4">
                            <input
                                type="text"
                                {...register('education.degree', { required: 'Degree is required' })}
                                className="input input-bordered w-full"
                                placeholder="Degree (e.g., B.Sc in Physics)"
                            />
                            {errors.education?.degree && (
                                <p className="text-red-500 text-sm mt-1">{errors.education.degree.message}</p>
                            )}

                            <input
                                type="text"
                                {...register('education.institution', { required: 'Institution is required' })}
                                className="input input-bordered w-full"
                                placeholder="Institution (e.g., University of XYZ)"
                            />
                            {errors.education?.institution && (
                                <p className="text-red-500 text-sm mt-1">{errors.education.institution.message}</p>
                            )}

                            <input
                                type="number"
                                {...register('education.year', {
                                    required: 'Passing year is required',
                                    min: { value: 1900, message: 'Year too early' },
                                    max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' },
                                })}
                                className="input input-bordered w-full"
                                placeholder="Passing Year (e.g., 2020)"
                            />
                            {errors.education?.year && (
                                <p className="text-red-500 text-sm mt-1">{errors.education.year.message}</p>
                            )}

                            <div>
                                <label className="block mb-1 font-medium">GPA Scale</label>
                                <select
                                    value={gpaScale}
                                    onChange={(e) => setGpaScale(e.target.value)}
                                    className="select select-bordered w-full"
                                >
                                    <option value="5.00">5.00 Scale</option>
                                    <option value="4.00">4.00 Scale</option>
                                </select>
                            </div>

                            <input
                                type="number"
                                step="0.01"
                                {...register('education.gpa', {
                                    required: 'GPA/CGPA is required',
                                    min: { value: 0, message: 'GPA cannot be negative' },
                                    max: {
                                        value: parseFloat(gpaScale),
                                        message: `GPA cannot exceed ${gpaScale}`,
                                    },
                                })}
                                className="input input-bordered w-full"
                                placeholder={`GPA / CGPA (out of ${gpaScale})`}
                            />
                            {errors.education?.gpa && (
                                <p className="text-red-500 text-sm mt-1">{errors.education.gpa.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block mb-1 font-medium">Short Bio</label>
                        <textarea
                            {...register('bio', { required: 'Please provide a short bio' })}
                            className="textarea textarea-bordered w-full"
                            rows={4}
                            placeholder="Tell us about your teaching style or background"
                        ></textarea>
                        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>}
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="block mb-1 font-medium">LinkedIn Profile URL</label>
                        <input
                            type="url"
                            {...register('linkedin', {
                                pattern: {
                                    value: /^https?:\/\/(www\.)?linkedin\.com\/.*$/i,
                                    message: 'Please enter a valid LinkedIn URL',
                                },
                            })}
                            className="input input-bordered w-full"
                            placeholder="https://www.linkedin.com/in/yourprofile"
                        />
                        {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>}
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : (tutor?.status === 'cancelled' ? 'Update Application' : 'Submit Application')}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default BeTutorForm;
