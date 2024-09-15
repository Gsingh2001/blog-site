"use client"
import React from 'react';

import { useRouter } from 'next/navigation';
import ImageSide from './ImageSide';

const AuthLayout = ({ children }) => {
    const router = useRouter();
    return (
        <div className="flex min-h-screen">
            <ImageSide/>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;