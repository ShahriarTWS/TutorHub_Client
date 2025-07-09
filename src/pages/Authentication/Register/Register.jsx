import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../../../shared/SocialLogin/SocialLogin';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';
import Swal from 'sweetalert2';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const password = watch('password'); // Watch password to match

    const { createUser, updateUserProfile } = useAuth();


    const onSubmit = async (data) => {
        const imageFile = data.photoURL[0];
        if (!imageFile) {
            console.log("No image selected");
            return;
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

        setLoading(true); // Start loading

        try {
            // 1. Upload profile picture to ImgBB
            const imgbbResponse = await axios.post(
                `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                formData
            );
            const photoURL = imgbbResponse.data.data.display_url;

            // 2. Create Firebase user
            const result = await createUser(data.email, data.password);

            // 3. Update Firebase profile
            await updateUserProfile(data.name, photoURL);

            // 4. Sync user to MongoDB
            const userInfo = {
                uid: result.user.uid,
                name: data.name,
                email: data.email,
                photoURL: photoURL,
            };

            await axiosInstance.post('/users', userInfo);

            // ✅ Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                showConfirmButton: false,
                timer: 1500
            });

            navigate('/');
        } catch (error) {
            console.error("❌ Error during registration:", error);

            // ❌ Show error alert
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.message || 'Something went wrong!',
            });
        }
    };




    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
        if (strength === 2 || strength === 3) return { label: 'Medium', color: 'bg-yellow-500', width: 'w-2/3' };
        return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    };

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center md:px-4">
            <div className="w-full max-w-md bg-base-200 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-semibold text-center">Create Account</h2>
                <h2 className="text-sm font-semibold text-center mb-2">Register to get started</h2>

                <SocialLogin />
                <div className="text-center text-gray-400 mb-2">OR</div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            {...register('name', { required: "Name is required" })}
                            className="input input-bordered w-full"
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
                        {errors.photoURL && (
                            <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: "Email is required" })}
                            className="input input-bordered w-full"
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
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long"
                                }
                            })}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            className="input input-bordered w-full pr-10"
                            placeholder="********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-lg text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                        {passwordValue && (
                            <div className="mt-2">
                                <div className="h-2 bg-gray-200 rounded">
                                    <div
                                        className={`h-2 rounded ${getPasswordStrength(passwordValue).color} ${getPasswordStrength(passwordValue).width} transition-all duration-300`}
                                    ></div>
                                </div>
                                <p className="text-sm mt-1 text-gray-600">
                                    Strength: <span className="font-medium">{getPasswordStrength(passwordValue).label}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    {/* Confirm Password */}
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register('confirmPassword', {
                                required: "Please confirm your password",
                                validate: value =>
                                    value === password || "Passwords do not match"
                            })}
                            className="input input-bordered w-full pr-10"
                            placeholder="********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-9 text-lg text-gray-600"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                        {/* Live Match Feedback */}
                        {watch('confirmPassword') && (
                            <p className={`text-sm mt-1 ${watch('confirmPassword') === password ? 'text-green-600' : 'text-red-500'}`}>
                                {watch('confirmPassword') === password ? '✅ Passwords match' : '❌ Passwords do not match'}
                            </p>
                        )}
                    </div>


                    <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm mt-8">
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
