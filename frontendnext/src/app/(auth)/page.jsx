"use client"
import React from 'react';
import { notFound } from 'next/navigation';
import AuthLayout from '../component/AuthLayout';

const AuthPage = ({ children }) => {
    return <AuthLayout>{children}</AuthLayout>;
};

export default AuthPage;