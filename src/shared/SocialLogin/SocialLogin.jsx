import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxios from '../../hooks/useAxios'; // 👈 import your axios instance

const SocialLogin = () => {
    const { signInWithGoogle, updateUserProfile } = useAuth();
    const axiosInstance = useAxios();

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            const user = result.user;

            // 3. Update Firebase profile
            await updateUserProfile(user.name, user.photoURL);
            // 👇 Save user to MongoDB
            const userInfo = {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            };

            await axiosInstance.post('/users', userInfo); // 🔁 send to backend

            Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                showConfirmButton: false,
                timer: 1500
            });

            navigate(from);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message || 'Something went wrong!',
            });
        }
    };

    return (
        <div>
            <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg mb-2 hover:bg-gray-100 transition"
            >
                <FcGoogle className="text-xl" />
                <span>Continue with Google</span>
            </button>
        </div>
    );
};

export default SocialLogin;
