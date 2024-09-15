// app/auth/forgot-password/page.jsx
"use client";

import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../../FirebaseData';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent!');
            setError('');
        } catch (error) {
            setError('Failed to send password reset email.');
            setMessage('');
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">Forgot Password</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <form onSubmit={handlePasswordReset}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Send Password Reset Email
                </button>
            </form>
        </>
    );
};

export default ForgotPassword;
