import React from 'react';
import ImageSide from '../component/ImageSide';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-screen">
            <ImageSide />
            <div className="flex flex-col w-full lg:w-1/2 bg-white p-8 shadow-lg rounded-lg border border-gray-300 items-center justify-center">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
