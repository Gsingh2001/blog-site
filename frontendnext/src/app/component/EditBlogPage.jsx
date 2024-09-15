import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { UserContext } from '../assets/utils/UserContexts';
import { Puff } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { ref as dbRef, set, update, get, child } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../FirebaseData';

function EditBlogPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext) || {}; // Default to an empty object if UserContext is null

    const predefinedCategories = [
        { value: 'Tech', label: 'Tech' },
        { value: 'Lifestyle', label: 'Lifestyle' },
        { value: 'Education', label: 'Education' },
        { value: 'Content', label: 'Content' },
        { value: 'Travel', label: 'Travel' }
    ];

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        category: [],
        content: [''],
        main_image: null,
        author_name: '',
        author_avatar: null,
        images: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blogSnapshot = await get(child(dbRef(database), `blogPosts/${id}`));
                if (blogSnapshot.exists()) {
                    const blogData = blogSnapshot.val();
                    setFormData({
                        title: blogData.title,
                        date: blogData.date,
                        category: blogData.category || [],
                        content: blogData.content || [''],
                        main_image: blogData.main_image || null,
                        author_name: blogData.author_name || (user ? user.displayName : 'Unknown Author'),
                        author_avatar: blogData.author_avatar || null,
                        images: blogData.images || []
                    });
                    setLoading(false);
                } else {
                    toast.error('Blog post not found.');
                    navigate('/blogs');
                }
            } catch (error) {
                console.error('Error fetching blog data:', error);
                toast.error('Failed to fetch blog data.');
            }
        };

        fetchBlog();
    }, [id, navigate, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        setLoading(true);

        const { title, date, category, content, main_image, author_name, author_avatar, images } = formData;

        try {
            let mainImageUrl = '';
            const imageUrls = [];

            if (main_image instanceof File) {
                mainImageUrl = await uploadImage(main_image);
            } else {
                mainImageUrl = main_image; // Keep the existing main image URL
            }

            if (images.length > 0) {
                for (const image of images) {
                    if (image instanceof File) {
                        const imageUrl = await uploadImage(image);
                        imageUrls.push(imageUrl);
                    } else {
                        imageUrls.push(image); // Keep existing image URLs
                    }
                }
            }

            // Prepare data to update
            const updatedBlogData = {
                title,
                date,
                category,
                content,
                author_name,
                author_avatar,
                main_image: mainImageUrl,
                images: imageUrls
            };

            // Update the blog post in Firebase Realtime Database
            const blogPostRef = dbRef(database, `blogPosts/${id}`);
            await update(blogPostRef, updatedBlogData);

            toast.success('Blog post updated successfully!');
            navigate(`/blogs/${id}`);
        } catch (error) {
            console.error('Error updating blog post:', error);
            toast.error('Failed to update blog post.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Puff color="#00BFFF" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Edit Blog Post</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="button" className="btn btn-secondary mb-3" onClick={addContentSection}>
                    Add More Content
                </button>
                <div className="form-group">
                    <label htmlFor="main_image">Main Image</label>
                    {formData.main_image && typeof formData.main_image === 'string' ? (
                        <img
                            src={formData.main_image}
                            alt="Main Blog Image"
                            width="100"
                            className="d-block mb-3"
                        />
                    ) : (
                        <input
                            type="file"
                            id="main_image"
                            name="main_image"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="author_name">Author Name</label>
                    <input
                        type="text"
                        id="author_name"
                        name="author_name"
                        className="form-control"
                        value={formData.author_name}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author_avatar">Author Avatar</label>
                    {formData.author_avatar && typeof formData.author_avatar === 'string' ? (
                        <img
                            src={formData.author_avatar}
                            alt="Author Avatar"
                            width="50"
                            height="50"
                            className="d-block mb-3"
                        />
                    ) : (
                        <input
                            type="file"
                            id="author_avatar"
                            name="author_avatar"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    )}
                </div>
                <div className="form-group">
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
                <button type="submit" className="btn btn-primary">Update Blog Post</button>
            </form>
        </div>
    );
}

export default EditBlogPage;
