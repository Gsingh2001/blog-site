const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());
app.use(cors());

// Helper functions for reading and writing to db.json
const readDB = () => {
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// Define API routes
app.get('/blogs', (req, res) => {
  const db = readDB();
  res.status(200).json(db.blogs);
});

app.get('/blogs/:id', (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const db = readDB();
  const blog = db.blogs.find(blog => blog.id === blogId);
  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(404).json({ message: 'Blog not found.' });
  }
});

app.post('/blogs', (req, res) => {
  const newBlog = req.body;
  const db = readDB();
  newBlog.id = db.blogs.length ? db.blogs[db.blogs.length - 1].id + 1 : 1;
  db.blogs.push(newBlog);
  writeDB(db);
  res.status(201).json(newBlog);
});

app.delete('/blogs/:id', (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const db = readDB();
  const blogIndex = db.blogs.findIndex(blog => blog.id === blogId);
  if (blogIndex !== -1) {
    db.blogs.splice(blogIndex, 1);
    writeDB(db);
    res.status(200).json({ message: 'Blog deleted successfully.' });
  } else {
    res.status(404).json({ message: 'Blog not found.' });
  }
});

app.put('/blogs/:id', (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const updatedBlog = req.body;
  const db = readDB();
  const blogIndex = db.blogs.findIndex(blog => blog.id === blogId);
  if (blogIndex !== -1) {
    db.blogs[blogIndex] = { ...db.blogs[blogIndex], ...updatedBlog, id: blogId };
    writeDB(db);
    res.status(200).json(db.blogs[blogIndex]);
  } else {
    res.status(404).json({ message: 'Blog not found.' });
  }
});

// Start server
app.listen(port, '172.16.0.2', () => { // Listen on all network interfaces
  console.log(`Server is running on http://172.16.0.2:${port}`);
});
