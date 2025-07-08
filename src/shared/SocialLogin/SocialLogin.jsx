import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';

const SocialLogin = () => {
    const { signInWithGoogle } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then(result => {
                console.log(result);
                navigate(from);
            })
            .catch(error => {
                console.error(error);
            })
    }
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