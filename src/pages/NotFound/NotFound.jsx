import React from 'react';
import { Link } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 text-center">
            <div className="max-w-md">
                <h1 className="text-7xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold mt-4 text-base-content">Page Not Found</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary mt-6 inline-flex items-center gap-2">
                    <FaArrowLeft /> Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
