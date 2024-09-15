"use client"
import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import Link from 'next/link';
import { database } from '../../../FirebaseData';

const RelatedBlogs = ({ category, currentBlogId }) => {
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    useEffect(() => {
        const fetchRelatedBlogs = async () => {
            const articlesRef = ref(database, 'blogPosts');
            const snapshot = await get(articlesRef);

            if (snapshot.exists()) {
                const articles = snapshot.val();

                // Check if category is an array and filter accordingly
                const related = Object.keys(articles)
                    .filter((id) => {
                        const articleCategory = articles[id].category;

                        // If category is an array, check for any match
                        if (Array.isArray(articleCategory)) {
                            return articleCategory.some(cat => category.includes(cat)) && id !== currentBlogId;
                        }

                        // If category is a string, check directly
                        return articleCategory === category && id !== currentBlogId;
                    })
                    .map((id) => ({ id, ...articles[id] }));

                setRelatedBlogs(related);
            }
        };

        if (category) {
            fetchRelatedBlogs();
        }
    }, [category, currentBlogId]);


    console.log(category)

    if (relatedBlogs.length === 0) {
        return <div>No related blogs found.</div>;
    }

    return (
        <div className="bg-gray-200 shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Related Blogs</h2>
            <ul>
                {relatedBlogs.slice(0, 5).map((blog) => (
                    <li key={blog.id} className="mb-4">
                        <Link href={`/blog/${blog.id}`}>
                            <div className="flex items-center">
                                <img src={blog.main_image} alt={blog.title} className="w-16 h-16 object-cover rounded mr-4" />
                                <div>
                                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                                    <p className="text-gray-500 text-sm">{new Date(blog.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RelatedBlogs;
