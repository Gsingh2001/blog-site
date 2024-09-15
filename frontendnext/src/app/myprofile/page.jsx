// pages/profile.jsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/utils/UserContext';

const ProfilePage = () => {
    const { user } = useUser(); // Access user from context
    const router = useRouter();

    const handleBack = () => {
        router.push('/');
    };

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const profilePhoto = user.photoURL ? user.photoURL : '/default-profile.png';
    const username = user.displayName || 'No Display Name';
    const email = user.email || 'No Email';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
                <div className="text-center mb-4">
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        width="150"
                        height="150"
                        className="rounded-full mx-auto"
                    />
                </div>
                <div className="mb-3">
                    <strong className="block text-gray-700">Username:</strong>
                    <span className="block text-gray-600">{username}</span>
                </div>
                <div className="mb-3">
                    <strong className="block text-gray-700">Email:</strong>
                    <span className="block text-gray-600">{email}</span>
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={handleBack}
                        className="text-blue-500 hover:text-blue-700 underline"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
