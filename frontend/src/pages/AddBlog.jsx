import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AddBlog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    authorImage: null,
    content: [{ type: 'text', heading: '', value: '', images: [] }],
    date: '',
    tags: [],
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchBlogs();
    fetchTags();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://blog-site-1emf.onrender.com/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('https://blog-site-1emf.onrender.com/tags');
      setAllTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleCreateBlog = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('author', newBlog.author);
      if (newBlog.authorImage) {
        formData.append('authorImage', newBlog.authorImage);
      }
      formData.append('date', newBlog.date);
      formData.append('tags', JSON.stringify(newBlog.tags));
      newBlog.content.forEach((item, index) => {
        formData.append(`content[${index}][type]`, 'text');
        formData.append(`content[${index}][heading]`, item.heading);
        formData.append(`content[${index}][value]`, item.value);
        item.images.forEach((image, imgIndex) => {
          formData.append(`content[${index}][images][${imgIndex}]`, image);
        });
      });

      await axios.post('https://blog-site-1emf.onrender.com/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchBlogs();
      setNewBlog({ title: '', author: '', authorImage: null, content: [{ type: 'text', heading: '', value: '', images: [] }], date: '', tags: [] });
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleEditBlog = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editingBlog.title);
      formData.append('author', editingBlog.author);
      if (editingBlog.authorImage) {
        formData.append('authorImage', editingBlog.authorImage);
      }
      formData.append('date', editingBlog.date);
      formData.append('tags', JSON.stringify(editingBlog.tags));
      editingBlog.content.forEach((item, index) => {
        formData.append(`content[${index}][type]`, 'text');
        formData.append(`content[${index}][heading]`, item.heading);
        formData.append(`content[${index}][value]`, item.value);
        item.images.forEach((image, imgIndex) => {
          formData.append(`content[${index}][images][${imgIndex}]`, image);
        });
      });

      await axios.put(`https://blog-site-1emf.onrender.com/blogs/${editingBlog.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchBlogs();
      setEditingBlog(null);
    } catch (error) {
      console.error('Error editing blog:', error);
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput && !newBlog.tags.includes(tagInput)) {
      const updatedTags = [...newBlog.tags, tagInput];
      setNewBlog({ ...newBlog, tags: updatedTags });
      setTagInput('');

      // Save the new tag to backend
      axios.post('https://blog-site-1emf.onrender.com/tags', { tag: tagInput })
        .then(() => fetchTags())
        .catch(error => console.error('Error saving tag:', error));
    }
  };

  const handleRemoveTag = (tag) => {
    const updatedTags = newBlog.tags.filter(t => t !== tag);
    setNewBlog({ ...newBlog, tags: updatedTags });
  };

  const handleAddParagraph = () => {
    setNewBlog({
      ...newBlog,
      content: [
        ...newBlog.content,
        { type: 'text', heading: '', value: '', images: [] }
      ]
    });
  };

  const handleHeadingChange = (index, value) => {
    const updatedContent = [...newBlog.content];
    updatedContent[index].heading = value;
    setNewBlog({ ...newBlog, content: updatedContent });
  };

  const handleContentChange = (index, value) => {
    const updatedContent = [...newBlog.content];
    updatedContent[index].value = value;
    setNewBlog({ ...newBlog, content: updatedContent });
  };

  const handleRemoveParagraph = (index) => {
    const updatedContent = newBlog.content.filter((_, i) => i !== index);
    setNewBlog({ ...newBlog, content: updatedContent });
  };

  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedContent = [...newBlog.content];
    updatedContent[index].images = [...updatedContent[index].images, ...files];
    setNewBlog({ ...newBlog, content: updatedContent });
  };

  const handleRemoveImage = (paraIndex, imgIndex) => {
    const updatedContent = [...newBlog.content];
    updatedContent[paraIndex].images.splice(imgIndex, 1);
    setNewBlog({ ...newBlog, content: updatedContent });
  };

  const handleSelectBlog = (id) => {
    const blog = blogs.find(blog => blog.id === id);
    setSelectedBlog(blog);
  };

  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`https://blog-site-1emf.onrender.com/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div className="App">
      <h1>Blog Manager</h1>

      <div>
        <h2>Create New Blog</h2>
        <input
          type="text"
          placeholder="Title"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBlog.author}
          onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewBlog({ ...newBlog, authorImage: e.target.files[0] })}
        />
        {newBlog.authorImage && (
          <img
            src={URL.createObjectURL(newBlog.authorImage)}
            alt="Author"
            style={{ width: '100px', marginTop: '10px' }}
          />
        )}
        {newBlog.content.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Heading"
              value={item.heading}
              onChange={(e) => handleHeadingChange(index, e.target.value)}
            />
            {item.type === 'text' && (
              <ReactQuill
                value={item.value}
                onChange={(value) => handleContentChange(index, value)}
              />
            )}
            {item.images.length > 0 && (
              <div>
                {item.images.map((image, imgIndex) => (
                  <div key={imgIndex} style={{ display: 'inline-block', position: 'relative', marginRight: '10px' }}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Blog image ${imgIndex}`}
                      style={{ width: '100px' }}
                    />
                    <button
                      style={{ position: 'absolute', top: '0', right: '0' }}
                      onClick={() => handleRemoveImage(index, imgIndex)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
            {index > 0 && (
              <button onClick={() => handleRemoveParagraph(index)}>Remove Paragraph</button>
            )}
            <input
              type="file"
              multiple
              onChange={(e) => handleImageChange(index, e)}
            />
          </div>
        ))}
        <button onClick={handleAddParagraph}>Add Paragraph</button>
        <input
          type="date"
          placeholder="Date"
          value={newBlog.date}
          onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })}
        />
        <div>
          <input
            type="text"
            placeholder="Tags"
            value={tagInput}
            onChange={handleTagInputChange}
          />
          <button onClick={handleAddTag}>Add Tag</button>
        </div>
        <div>
          <strong>Tags:</strong>
          {newBlog.tags.map(tag => (
            <span key={tag} style={{ margin: '0 5px' }}>
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>X</button>
            </span>
          ))}
        </div>
        <button onClick={handleCreateBlog}>Create Blog</button>
      </div>

      <h2>Existing Blogs</h2>
      {blogs.map(blog => (
        <div key={blog.id}>
          <h3>{blog.title}</h3>
          <p><strong>Author:</strong> {blog.author}</p>
          {blog.authorImage && (
            <img
              src={`https://blog-site-1emf.onrender.com/uploads/${blog.authorImage}`}
              alt="Author"
              style={{ width: '100px', marginTop: '10px' }}
            />
          )}
          <button onClick={() => handleSelectBlog(blog.id)}>View</button>
          <button onClick={() => setEditingBlog(blog)}>Edit</button>
          <button onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
        </div>
      ))}

      {selectedBlog && (
        <div>
          <h2>Blog Details</h2>
          <p><strong>Title:</strong> {selectedBlog.title}</p>
          <p><strong>Author:</strong> {selectedBlog.author}</p>
          {selectedBlog.authorImage && (
            <img
              src={`https://blog-site-1emf.onrender.com/uploads/${selectedBlog.authorImage}`}
              alt="Author"
              style={{ width: '100px', marginTop: '10px' }}
            />
          )}
          {selectedBlog.content.map((item, index) => (
            <div key={index}>
              <h3>{item.heading}</h3>
              {item.type === 'text' && <div dangerouslySetInnerHTML={{ __html: item.value }} />}
              {item.images.length > 0 && (
                <div>
                  {item.images.map((image, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={`https://blog-site-1emf.onrender.com/uploads/${image}`}
                      alt={`Blog image ${imgIndex}`}
                      style={{ width: '100px', marginRight: '10px' }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          <p><strong>Date:</strong> {selectedBlog.date}</p>
          <p><strong>Tags:</strong> {selectedBlog.tags.join(', ')}</p>
        </div>
      )}

      {editingBlog && (
        <div>
          <h2>Edit Blog</h2>
          <input
            type="text"
            placeholder="Title"
            value={editingBlog.title}
            onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author"
            value={editingBlog.author}
            onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditingBlog({ ...editingBlog, authorImage: e.target.files[0] })}
          />
          {editingBlog.authorImage && (
            <img
              src={URL.createObjectURL(editingBlog.authorImage)}
              alt="Author"
              style={{ width: '100px', marginTop: '10px' }}
            />
          )}
          {editingBlog.content.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Heading"
                value={item.heading}
                onChange={(e) => handleHeadingChange(index, e.target.value)}
              />
              {item.type === 'text' && (
                <ReactQuill
                  value={item.value}
                  onChange={(value) => handleContentChange(index, value)}
                />
              )}
              {item.images.length > 0 && (
                <div>
                  {item.images.map((image, imgIndex) => (
                    <div key={imgIndex} style={{ display: 'inline-block', position: 'relative', marginRight: '10px' }}>
                      <img
                        src={`https://blog-site-1emf.onrender.com/uploads/${image}`}
                        alt={`Blog image ${imgIndex}`}
                        style={{ width: '100px' }}
                      />
                      <button
                        style={{ position: 'absolute', top: '0', right: '0' }}
                        onClick={() => handleRemoveImage(index, imgIndex)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {index > 0 && (
                <button onClick={() => handleRemoveParagraph(index)}>Remove Paragraph</button>
              )}
              <button onClick={handleAddParagraph}>Add Paragraph</button>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageChange(index, e)}
              />
            </div>
          ))}
          <input
            type="date"
            placeholder="Date"
            value={editingBlog.date}
            onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={editingBlog.tags.join(', ')}
            onChange={(e) => setEditingBlog({ ...editingBlog, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          />
          <button onClick={handleEditBlog}>Save Changes</button>
        </div>
      )}
    </div>
  );
}

export default AddBlog;
