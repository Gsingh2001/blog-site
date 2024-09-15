import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database, auth } from '../../FirebaseData'; // Import Firebase services
import { ref, get, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

function MyBlog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

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

    // Fetch the list of blogs authored by the user based on email
    useEffect(() => {
        if (user) {
            const fetchBlogs = async () => {
                try {
                    const blogsRef = ref(database, 'blogPosts'); // Reference to the 'blogPosts' in Realtime DB
                    const snapshot = await get(blogsRef); // Fetch the blogs
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const userBlogs = Object.keys(data)
                            .map(id => ({ id, ...data[id] })) // Convert to array of blogs
                            .filter(blog => blog.author_name === user.displayName); // Filter by current user's email
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

    // Handle blog deletion
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
        if (confirmDelete) {
            try {
                await remove(ref(database, `blogPosts/${id}`)); // Delete the blog from Firebase
                setBlogs(blogs.filter(blog => blog.id !== id)); // Update the state after deletion
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
