"use client"
import React, { useState, useEffect } from 'react';
import { ref as dbRef, set, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Select from 'react-select';
import { Puff } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { auth, database, storage } from '../../../FirebaseData';
import { onAuthStateChanged } from 'firebase/auth';

function AddBlogPage() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        category: [],
        content: [''],
        main_image: null,
        author_name: '',
        author_avatar: '',
        images: []
    });
    const [loading, setLoading] = useState(false);

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
            setFormData(prevFormData => ({
                ...prevFormData,
                author_name: user.displayName || '',
                author_avatar: user.photoURL || ''
            }));
        }
    }, [user]);

    const predefinedCategories = [
        { value: 'Tech', label: 'Tech' },
        { value: 'Lifestyle', label: 'Lifestyle' },
        { value: 'Education', label: 'Education' },
        { value: 'Content', label: 'Content' },
        { value: 'Travel', label: 'Travel' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' || name === 'date') {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleCategoryChange = (selectedOptions) => {
        const selectedCategories = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData({ ...formData, category: selectedCategories });
    };

    const handleContentChange = (index, value) => {
        const updatedContent = [...formData.content];
        updatedContent[index] = value;
        setFormData({ ...formData, content: updatedContent });
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const images = Array.from(files);
        setFormData({ ...formData, images });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'main_image') {
            setFormData({ ...formData, main_image: files[0] });
        }
    };

    const addContentSection = () => {
        setFormData({ ...formData, content: [...formData.content, ''] });
    };

    const removeContentSection = (index) => {
        const updatedContent = formData.content.filter((_, i) => i !== index);
        setFormData({ ...formData, content: updatedContent });
    };

    const uploadImage = async (imageFile) => {
        const imageRef = storageRef(storage, `blogImages/${imageFile.name}_${Date.now()}`);
        await uploadBytes(imageRef, imageFile);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, date, category, content, main_image, author_name, author_avatar, images } = formData;

        try {
            setLoading(true);

            // Upload main_image and images to Firebase Storage
            let mainImageUrl = '';
            const imageUrls = [];

            if (main_image) {
                mainImageUrl = await uploadImage(main_image); // Upload main image
            }

            if (images.length > 0) {
                for (const image of images) {
                    const imageUrl = await uploadImage(image); // Upload additional images
                    imageUrls.push(imageUrl);
                }
            }

            // Prepare data to send
            const blogPostData = {
                title,
                date,
                category,
                content,
                author_name,
                author_avatar,
                main_image: mainImageUrl, // Main image URL
                images: imageUrls, // Array of additional image URLs
                uid: user?.uid || '' // Add UID to the data
            };

            // Push data to Firebase Realtime Database
            const blogPostRef = push(dbRef(database, 'blogPosts'));
            await set(blogPostRef, blogPostData);

            toast.success('Blog post added successfully!');
            setFormData({
                title: '',
                date: '',
                category: [],
                content: [''],
                main_image: null,
                author_name: user?.displayName || '',
                author_avatar: user?.photoURL || '',
                images: []
            });
        } catch (error) {
            console.error('Error adding blog post:', error);
            toast.error('Failed to add blog post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Blog Post</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {loading ? (
                    <div className="flex justify-center">
                        <Puff color="#00BFFF" height={100} width={100} />
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            <div className="form-group">
                                <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="date" className="block text-lg font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
                                <Select
                                    id="category"
                                    name="category"
                                    options={predefinedCategories}
                                    isMulti
                                    value={predefinedCategories.filter(cat => formData.category.includes(cat.value))}
                                    onChange={handleCategoryChange}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    required
                                />
                            </div>
                        </div>
                        {formData.content.map((content, index) => (
                            <div key={index} className="form-group space-y-2">
                                <label htmlFor={`content-${index}`} className="block text-lg font-medium text-gray-700">Content {index + 1}</label>
                                <textarea
                                    id={`content-${index}`}
                                    name={`content-${index}`}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                    rows="5"
                                    value={content}
                                    onChange={(e) => handleContentChange(index, e.target.value)}
                                    required
                                />
                                {formData.content.length > 1 && (
                                    <button type="button" className="text-red-600 hover:text-red-800" onClick={() => removeContentSection(index)}>
                                        Remove Content Section
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="text-blue-600 hover:text-blue-800" onClick={addContentSection}>
                            Add Another Content Section
                        </button>
                        <div className="form-group space-y-4 mt-4">
                            <div className="mb-4">
                                <label htmlFor="main_image" className="block text-lg font-medium text-gray-700">Main Image</label>
                                <input
                                    type="file"
                                    id="main_image"
                                    name="main_image"
                                    className="mt-1 block w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-50 file:text-blue-600 hover:file:bg-gray-100"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="images" className="block text-lg font-medium text-gray-700">Additional Images</label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    className="mt-1 block w-full text-gray-500 file:mr-4 file:py-                                    2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-50 file:text-blue-600 hover:file:bg-gray-100"
                                    multiple
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                        <button type="submit" className="mt-6 w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                            Submit Blog
                        </button>
                    </>
                )}
            </form>
        </div>
        </>
    );
}

export default AddBlogPage;

