import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../../../shared/SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';

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
            navigate(from);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center md:px-4">
            <div className="w-full max-w-md bg-base-200 p-6 sm:p-8 rounded-2xl shadow-lg">
                {/* Title */}
                <h2 className="text-3xl font-semibold text-center">Welcome Back</h2>
                <h2 className="text-sm font-semibold text-center mb-2">Login to your account</h2>

                {/* Google Login */}
                <SocialLogin />

                {/* Divider */}
                <div className="text-center text-gray-400 mb-2">OR</div>

                {/* Email & Password Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
                                    message: "Password must be at least 6 characters"
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
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

                        {/* Forgot Password */}
                        <div className="text-right mt-2">
                            <Link to={'/reset-password'}>
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-full mt-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Register Redirect */}
                <p className="text-center text-sm mt-8">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
