import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../assets/utils/auth';

function MyBlog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token'); // Retrieve JWT token for authorization

    useEffect(() => {
        // Fetch the list of blogs authored by the user
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${BaseUrl}myblogs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBlogs(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch blogs.');
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [token]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
        if (confirmDelete) {
            try {
                await axios.delete(`${BaseUrl}article/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Update the list after deletion
                setBlogs(blogs.filter(blog => blog._id !== id));
                alert('Blog deleted successfully.');
            } catch (error) {
                console.error('Failed to delete blog:', error);
                alert('Failed to delete the blog.');
            }
        }
    };

    if (loading) {
        return <p>Loading blogs...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">My Blogs</h2>
            {blogs.length === 0 ? (
                <p>No blogs found.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog.id}>
                                <td>{blog.title}</td>
                                <td>{new Date(blog.date).toLocaleDateString()}</td>
                               
                                <td>
                                    {/* View Button */}
                                    <Link to={`/blog/${blog.id}`} className="btn btn-info btn-sm mr-2">
                                        View
                                    </Link>
                                    {/* Edit Button */}
                                    <Link to={`/editblog/${blog.id}`} className="btn btn-warning btn-sm mr-2">
                                        Edit
                                    </Link>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MyBlog;
