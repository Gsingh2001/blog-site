import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: '', author: '', content: '', date: '', tags: '' });
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleCreateBlog = async () => {
    try {
      await axios.post('http://localhost:3000/blogs', newBlog);
      fetchBlogs();
      setNewBlog({ title: '', author: '', content: '', date: '', tags: '' });
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleEditBlog = async () => {
    try {
      await axios.put(`http://localhost:3000/blogs/${editingBlog.id}`, editingBlog);
      fetchBlogs();
      setEditingBlog(null);
    } catch (error) {
      console.error('Error editing blog:', error);
    }
  };

  const handleSelectBlog = (id) => {
    const blog = blogs.find(blog => blog.id === id);
    setSelectedBlog(blog);
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
          type="text"
          placeholder="Content"
          value={newBlog.content}
          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
        />
        <input
          type="date"
          placeholder="Date"
          value={newBlog.date}
          onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={newBlog.tags}
          onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value.split(',').map(tag => tag.trim()) })}
        />
        <button onClick={handleCreateBlog}>Create Blog</button>
      </div>

      <div>
        <h2>Blogs</h2>
        <ul>
          {blogs.map(blog => (
            <li key={blog.id}>
              <strong>{blog.title}</strong> by {blog.author}
              <button onClick={() => handleSelectBlog(blog.id)}>View</button>
              <button onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
              <button onClick={() => setEditingBlog(blog)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedBlog && (
        <div>
          <h2>Blog Details</h2>
          <p><strong>Title:</strong> {selectedBlog.title}</p>
          <p><strong>Author:</strong> {selectedBlog.author}</p>
          <p><strong>Content:</strong> {selectedBlog.content}</p>
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
            type="text"
            placeholder="Content"
            value={editingBlog.content}
            onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
          />
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

export default App;
