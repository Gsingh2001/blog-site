import React, { useState, useEffect } from 'react';
import { ref as dbRef, set, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import Select from 'react-select';
import { Puff } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { auth, database, storage } from '../../FirebaseData';
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
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Add New Blog Post</h2>
            <form onSubmit={handleSubmit}>
                {loading ? (
                    <div className="text-center">
                        <Puff color="#00BFFF" height={100} width={100} />
                    </div>
                ) : (
                    <>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                className="form-control"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <Select
                                id="category"
                                name="category"
                                options={predefinedCategories}
                                isMulti
                                value={predefinedCategories.filter(cat => formData.category.includes(cat.value))}
                                onChange={handleCategoryChange}
                                required
                            />
                        </div>
                        {formData.content.map((content, index) => (
                            <div key={index} className="form-group">
                                <label htmlFor={`content-${index}`}>Content {index + 1}</label>
                                <textarea
                                    id={`content-${index}`}
                                    name={`content-${index}`}
                                    className="form-control"
                                    rows="5"
                                    value={content}
                                    onChange={(e) => handleContentChange(index, e.target.value)}
                                    required
                                />
                                {formData.content.length > 1 && (
                                    <button type="button" className="btn btn-danger mt-2" onClick={() => removeContentSection(index)}>
                                        Remove Content Section
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn btn-primary mt-3" onClick={addContentSection}>
                            Add Another Content Section
                        </button>
                        <div className="form-group mt-4">
                            <label htmlFor="main_image">Main Image</label>
                            <input
                                type="file"
                                id="main_image"
                                name="main_image"
                                className="form-control"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="form-group mt-4">
                            <label htmlFor="images">Additional Images</label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                className="form-control"
                                multiple
                                onChange={handleImageChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-success mt-4">
                            Submit Blog
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}

export default AddBlogPage;
