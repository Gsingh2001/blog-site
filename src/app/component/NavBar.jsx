"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaUser, FaPlus, FaBlog } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { useUser } from '@/utils/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../../FirebaseData';
import { CiLogin } from "react-icons/ci";

const categories = [
    { value: 'Tech', label: 'Tech' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Education', label: 'Education' },
    { value: 'Content', label: 'Content' },
    { value: 'Travel', label: 'Travel' }
];

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const categoriesRef = useRef(null);
    const profileRef = useRef(null);
    const menuRef = useRef(null);

    const { user, setUser } = useUser(); // Consume user and setUser from context

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleCategories = () => {
        setIsCategoriesOpen(!isCategoriesOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleClickOutside = (event) => {
        if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
            setIsCategoriesOpen(false);
        }
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setIsProfileOpen(false);
        }
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.clear(); // Clear local storage
            setUser(null); // Set user to null
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-50">
            <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">Kuldeep Blogs</span>
                </Link>
                <div className="relative hidden md:block" ref={categoriesRef}>
                    <button
                        onClick={toggleCategories}
                        className="flex items-center text-gray-200 hover:text-white bg-gray-700 p-2 rounded-md"
                    >
                        <MdCategory className="mr-2 text-xl" />
                        Categories
                    </button>
                    {isCategoriesOpen && (
                        <ul className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-800 border border-gray-300 rounded-md shadow-lg">
                            {categories.map((category) => (
                                <li
                                    key={category.value}
                                    className="p-3 cursor-pointer hover:bg-gray-100"
                                >
                                    <Link href={`/categories/${category.value}`}>
                                        {category.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4">
                    {user ?
                        <>
                            <Link href="/addblog">
                                <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
                                    <FaPlus className="mr-2 text-lg" />
                                    Add Blog
                                </button>
                            </Link>
                            <Link href="/myblogs">
                                <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
                                    <FaBlog className="mr-2 text-lg" />
                                    My Blog
                                </button>
                            </Link>
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={toggleProfile}
                                    className="flex items-center text-gray-200 hover:text-white bg-gray-700 p-2 rounded-md"
                                >
                                    <img
                                        src={user.photoURL}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border border-gray-600"
                                    />
                                </button>
                                {isProfileOpen && (
                                    <ul className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 border border-gray-300 rounded-md shadow-lg">
                                        <li className="p-3 cursor-pointer hover:bg-gray-100">
                                            <Link href="/myprofile">My Profile</Link>
                                        </li>
                                        <li className="p-3 cursor-pointer hover:bg-gray-100">
                                            <button onClick={handleLogout}>Logout</button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </>
                        : <Link href="/login">
                            <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
                                <CiLogin className="mr-2 text-lg" />
                                Get Started
                            </button>
                        </Link>}
                </div>
                {/* Hamburger Menu */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white p-2"
                    ref={menuRef}
                >
                    {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed top-0 right-0 w-64 bg-gray-800 text-white p-4 md:hidden transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                ref={menuRef}
            >
                <button
                    onClick={toggleMenu}
                    className="text-white p-2 mb-4"
                >
                    <FaTimes className="text-2xl" />
                </button>

                {user ?
                    <>
                        <Link href="/add-blog" className="block mb-2">
                            <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
                                <FaPlus className="mr-2 text-lg" />
                                Add Blog
                            </button>
                        </Link>
                        <Link href="/myblogs" className="block mb-2">
                            <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
                                <FaBlog className="mr-2 text-lg" />
                                My Blog
                            </button>
                        </Link>
                        <Link href="/myprofile" className="block mb-2">
                            <button className="flex items-center text-gray-200 hover:text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-md">
                                <FaUser className="mr-2 text-lg" />
                                My Profile
                            </button>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-gray-200 hover:text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
                        >
                            <FaUser className="mr-2 text-lg" />
                            Logout
                        </button>
                    </>
                    : <Link href="/login">
                        <button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
                            <CiLogin className="mr-2 text-lg" />
                            Get Started
                        </button>
                    </Link>
                }
                <div className="mt-4">
                    <button
                        onClick={toggleCategories}
                        className="flex items-center text-gray-200 hover:text-white bg-gray-700 p-2 rounded-md w-full"
                    >
                        <MdCategory className="mr-2 text-xl" />
                        Categories
                    </button>
                    {isCategoriesOpen && (
                        <ul className="mt-2 bg-gray-700 text-gray-300 rounded-md">
                            {categories.map((category) => (
                                <li
                                    key={category.value}
                                    className="p-3 cursor-pointer hover:bg-gray-600"
                                >
                                    <Link href={`/categories/${category.value}`}>
                                        {category.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
