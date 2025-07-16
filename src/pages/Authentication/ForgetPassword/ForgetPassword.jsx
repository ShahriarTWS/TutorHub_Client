import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router'; 
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const ForgetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            await resetPassword(data.email);
            Swal.fire({
                icon: 'success',
                title: 'Email Sent!',
                text: 'Check your inbox/spam for the password reset link.',
                confirmButtonColor: '#6366f1'
            });
        } catch (error) {
            console.error('Reset error:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to send reset email.',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-base-200 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Reset Your Password</h2>
                <p className="text-center text-gray-600 text-sm mb-6">
                    Enter your email address to receive a password reset link.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="input input-bordered w-full"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-sm text-center mt-6">
                    Remembered your password?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgetPassword;
