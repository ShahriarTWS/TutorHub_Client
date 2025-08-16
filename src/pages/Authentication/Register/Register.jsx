import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../../../shared/SocialLogin/SocialLogin';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const axiosInstance = useAxiosSecure();
    const password = watch('password'); // Watch password for match

    const { createUser, updateUserProfile } = useAuth();

    const onSubmit = async (data) => {
        const imageFile = data.photoURL[0];
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('image', imageFile);

        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
        setLoading(true);

        try {
            const imgbbResponse = await axios.post(
                `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                formData
            );
            const photoURL = imgbbResponse.data.data.display_url;

            const result = await createUser(data.email, data.password);
            await updateUserProfile(data.name, photoURL);

            const userInfo = { uid: result.user.uid, name: data.name, email: data.email, photoURL };
            await axiosInstance.post('/users', userInfo);

            Swal.fire({ icon: 'success', title: 'Registration Successful!', showConfirmButton: false, timer: 1500 });
            navigate('/');
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Registration Failed', text: error.message || 'Something went wrong!' });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
        if (strength <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
        return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-base-100 px-4">
            <div className="w-full md:max-w-lg bg-base-200 p-8 sm:p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <h2 className="text-4xl font-extrabold text-center mb-2">Create Account</h2>
                <p className="text-center text-gray-500 mb-6">Register to get started</p>

                {/* Social Login */}
                <SocialLogin />

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-1 border-gray-300" />
                    <span className="mx-3 text-gray-400">OR</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            {...register('name', { required: "Name is required" })}
                            className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Upload Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register('photoURL', { required: "Photo is required" })}
                            className="file-input file-input-bordered w-full"
                        />
                        {errors.photoURL && <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: "Email is required" })}
                            className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register('password', {
                                required: "Password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters" }
                            })}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            className="input input-bordered w-full pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-lg text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

                        {passwordValue && (
                            <div className="mt-2">
                                <div className="h-2 bg-gray-200 rounded">
                                    <div className={`h-2 rounded ${getPasswordStrength(passwordValue).color} ${getPasswordStrength(passwordValue).width} transition-all duration-300`}></div>
                                </div>
                                <p className="text-sm mt-1 text-gray-600">
                                    Strength: <span className="font-medium">{getPasswordStrength(passwordValue).label}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register('confirmPassword', {
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                            className="input input-bordered w-full pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-9 text-lg text-gray-600"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        {watch('confirmPassword') && (
                            <p className={`text-sm mt-1 ${watch('confirmPassword') === password ? 'text-green-600' : 'text-red-500'}`}>
                                {watch('confirmPassword') === password ? '✅ Passwords match' : '❌ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3 mt-2 rounded-xl hover:bg-primary/90 transition duration-300 font-semibold shadow-md"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
