// app/auth/login/page.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../../FirebaseData';
import Link from 'next/link';
import { useUser } from '@/utils/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { setUser } = useUser(); // Consume setUser from context

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user); // Update user context
            router.push('/');
        } catch (error) {
            setError('Failed to login. Check your credentials.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user); // Update user context
            router.push('/');
        } catch (error) {
            setError('Failed to login with Google.');
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-6">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleEmailLogin}>
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
                    Login
                </button>
            </form>
            <div className="my-4 text-center">
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                >
                    Login with Google
                </button>
            </div>
            <p className="text-center text-gray-600">
                <Link href="/signup" className="text-blue-500">Sign Up</Link> | 
                <Link href="/forgot-password" className="text-blue-500"> Forgot Password?</Link>
            </p>
        </>
    );
};

export default Login;
