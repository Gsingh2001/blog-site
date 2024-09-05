import React, { useState } from 'react';
import axios from 'axios';

function AddBlogPage() {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        category: '',
        content: [''], // Array to handle multiple content sections
        main_image: null, // Binary data for main image
        author_name: '',
        author_avatar: null, // Binary data for author avatar
        images: [] // Array to handle multiple images
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' || name === 'date' || name === 'category' || name === 'author_name') {
            setFormData({
                ...formData,
                [name]: value
            });
        }
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
        } else if (name === 'author_avatar') {
            setFormData({ ...formData, author_avatar: files[0] });
        }
    };

    const addContentSection = () => {
        setFormData({ ...formData, content: [...formData.content, ''] });
    };

    const removeContentSection = (index) => {
        const updatedContent = formData.content.filter((_, i) => i !== index);
        setFormData({ ...formData, content: updatedContent });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, date, category, content, main_image, author_name, author_avatar, images } = formData;

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('date', date);
        formDataToSend.append('category', category);
        formDataToSend.append('content', JSON.stringify(content)); // Serialize content as JSON
        if (main_image) {
            formDataToSend.append('main_image', main_image);
        }
        formDataToSend.append('author_name', author_name);
        if (author_avatar) {
            formDataToSend.append('author_avatar', author_avatar);
        }
        images.forEach((image, index) => formDataToSend.append(`images[${index}]`, image));

        try {
            await axios.post('http://localhost:3001/article', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Blog post added successfully!');
            setFormData({
                title: '',
                date: '',
                category: '',
                content: [''],
                main_image: null,
                author_name: '',
                author_avatar: null,
                images: []
            });
        } catch (error) {
            console.error('Error adding blog post:', error);
            alert('Failed to add blog post.');
        }
    };


    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add New Blog Post</h2>
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
                    <input
                        type="text"
                        id="category"
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleChange}
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
                    <input
                        type="file"
                        id="main_image"
                        name="main_image"
                        className="form-control"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author_name">Author Name</label>
                    <input
                        type="text"
                        id="author_name"
                        name="author_name"
                        className="form-control"
                        value={formData.author_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="author_avatar">Author Avatar</label>
                    <input
                        type="file"
                        id="author_avatar"
                        name="author_avatar"
                        className="form-control"
                        onChange={handleFileChange}
                        required
                    />
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
                <button type="submit" className="btn btn-primary">Add Blog Post</button>
            </form>
        </div>
    );
}

export default AddBlogPage;
