"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { ref, get, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { database, auth } from '../../../FirebaseData';
import NavBar from '../component/NavBar';
import FooterSection from '../component/FooterSection';

function MyBlog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchBlogs = async () => {
                try {
                    const blogsRef = ref(database, 'blogPosts');
                    const snapshot = await get(blogsRef);
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const userBlogs = Object.keys(data)
                            .map(id => ({ id, ...data[id] }))
                            .filter(blog => blog.author_name === user.displayName);
                        setBlogs(userBlogs);
                    } else {
                        setBlogs([]);
                    }
                    setLoading(false);
                } catch (error) {
                    setError('Failed to fetch blogs.');
                    setLoading(false);
                }
            };
            fetchBlogs();
        }
    }, [user]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
        if (confirmDelete) {
            try {
                await remove(ref(database, `blogPosts/${id}`));
                setBlogs(blogs.filter(blog => blog.id !== id));
                alert('Blog deleted successfully.');
            } catch (error) {
                console.error('Failed to delete blog:', error);
                alert('Failed to delete the blog.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-500">Loading blogs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <>
        <div className="container mx-auto mt-8 p-4">
            <h2 className="text-2xl font-semibold mb-6">My Blogs</h2>
            {blogs.length === 0 ? (
                <p className="text-lg text-gray-600">No blogs found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Title</th>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog.id} className="border-b border-gray-200">
                                    <td className="py-3 px-4">{blog.title}</td>
                                    <td className="py-3 px-4">{new Date(blog.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button
                                            onClick={() => router.push(`/blog/${blog.id}`)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => router.push(`/editblog/${blog.id}`)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </>
    );
}

export default MyBlog;
