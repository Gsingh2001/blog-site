// app/auth/signup/page.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../../FirebaseData';
import Link from 'next/link';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (error) {
            setError('Failed to sign up. Try again.');
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/dashboard');
        } catch (error) {
            setError('Failed to sign up with Google.');
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleEmailSignup}>
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
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Sign Up
                </button>
            </form>
            <div className="my-4 text-center">
                <button
                    onClick={handleGoogleSignup}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                >
                    Sign Up with Google
                </button>
            </div>
            <p className="text-center text-gray-600">
                <Link href="/login" className="text-blue-500">Login</Link>
            </p>
        </>
    );
};

export default Signup;
