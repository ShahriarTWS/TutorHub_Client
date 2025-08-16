import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../../../shared/SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { signIn } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const onSubmit = async (data) => {
        try {
            const result = await signIn(data.email, data.password);
            console.log(result);

            // Success message with auto-close
            Swal.fire({
                icon: 'success',
                title: 'Logged in!',
                text: `Welcome back, ${data.email}`,
                timer: 1500,
                showConfirmButton: false,
            });

            navigate(from);
        } catch (error) {
            console.error(error);

            // Error message with auto-close
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid email or password.',
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-base-100 px-4">
            <div className="w-full md:max-w-lg bg-base-200 p-8 sm:p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                {/* Title */}
                <h2 className="text-4xl font-extrabold text-center mb-2 dark:text-white">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-300 mb-6">
                    Login to your account
                </p>

                {/* Social Login */}
                <SocialLogin />

                {/* Divider */}
                <div className="flex items-center my-6">
                    <hr className="flex-1 border-gray-300 dark:border-gray-600" />
                    <span className="mx-3 text-gray-400">OR</span>
                    <hr className="flex-1 border-gray-300 dark:border-gray-600" />
                </div>

                {/* Email & Password Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: "Email is required" })}
                            className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register('password', {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            className="input input-bordered w-full pr-10 focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="********"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-10 text-gray-500 dark:text-gray-300 text-lg"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>

                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

                        {/* Forgot Password */}
                        <div className="text-right mt-2">
                            <Link to={'/reset-password'}>
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-transform duration-300 font-semibold shadow-md"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Register Redirect */}
                <p className="text-center text-sm mt-6 text-gray-500 dark:text-gray-300">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
