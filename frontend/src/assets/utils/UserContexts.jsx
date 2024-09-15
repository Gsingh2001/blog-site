import React, { createContext, useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

// Create the UserContext
export const UserContext = createContext();

// Create the UserProvider component to manage the user state
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [blogData, setBlogData] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        const fetchBlogData = async () => {
            const db = getDatabase();
            const blogRef = ref(db, 'blogPosts');
            try {
                const snapshot = await get(blogRef);
                if (snapshot.exists()) {
                    setBlogData(snapshot.val());
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error('Error fetching blog data:', error);
            }
        };

        fetchBlogData();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = [
                    { value: 'Tech', label: 'Tech' },
                    { value: 'Lifestyle', label: 'Lifestyle' },
                    { value: 'Education', label: 'Education' },
                    { value: 'Content', label: 'Content' },
                    { value: 'Travel', label: 'Travel' }
                ];
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, selectedCategory, setSelectedCategory, blogData, setBlogData, selectedBlog, setSelectedBlog, categories }}>
            {children}
        </UserContext.Provider>
    );
};
