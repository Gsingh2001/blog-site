const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

app.use(cors());

// Create a MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Database connected.');
});

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Create the POST API endpoint to insert an article
app.post('/article', upload.any(), (req, res) => {
  console.log('Files:', req.files);
  console.log('Body:', req.body);

  const { title, date, category, author_name } = req.body;
  const content = req.body.content ? JSON.parse(req.body.content) : [];

  const mainImage = req.files.find(file => file.fieldname === 'main_image') ? req.files.find(file => file.fieldname === 'main_image').path : null;
  const authorAvatar = req.files.find(file => file.fieldname === 'author_avatar') ? req.files.find(file => file.fieldname === 'author_avatar').path : null;
  const images = req.files.filter(file => file.fieldname.startsWith('images')).map(file => file.path);

  if (!title || !date || !category || !author_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO articles (title, date, category, content, main_image, author_name, author_avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [title, date, category, JSON.stringify(content), mainImage, author_name, authorAvatar], (err, results) => {
    if (err) {
      console.error('Error inserting article:', err);
      return res.status(500).json({ error: 'Error inserting article into database' });
    }

    const articleId = results.insertId;

    const imageQuery = 'INSERT INTO article_images (article_id, image_path) VALUES ?';
    const imageValues = images.map(image => [articleId, image]);

    db.query(imageQuery, [imageValues], (err) => {
      if (err) {
        console.error('Error inserting images:', err);
        return res.status(500).json({ error: 'Error inserting images into database' });
      }

      const contentQuery = 'INSERT INTO article_contents (article_id, content) VALUES ?';
      const contentValues = content.map(c => [articleId, c]);

      db.query(contentQuery, [contentValues], (err) => {
        if (err) {
          console.error('Error inserting content:', err);
          return res.status(500).json({ error: 'Error inserting content into database' });
        }

        res.status(200).json({ message: 'Article created successfully', articleId });
      });
    });
  });
});

// Create the GET API endpoint to retrieve all articles
app.get('/articles', (req, res) => {
  const query = `
    SELECT a.*, 
           GROUP_CONCAT(ai.image_path) AS images,
           GROUP_CONCAT(ac.content SEPARATOR '||') AS content_sections
    FROM articles a
    LEFT JOIN article_images ai ON a.id = ai.article_id
    LEFT JOIN article_contents ac ON a.id = ac.article_id
    GROUP BY a.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving articles:', err);
      return res.status(500).json({ error: 'Error retrieving articles from database' });
    }

    const articles = results.map(row => ({
      id: row.id,
      title: row.title,
      date: row.date,
      category: row.category,
      content: row.content_sections ? row.content_sections.split('||') : [],
      main_image: row.main_image,
      author_name: row.author_name,
      author_avatar: row.author_avatar,
      images: row.images ? row.images.split(',') : []
    }));

    res.status(200).json(articles);
  });
});

// Create the GET API endpoint to retrieve a specific article by ID
app.get('/article/:id', (req, res) => {
  const articleId = req.params.id;

  const query = `
    SELECT a.*, 
           GROUP_CONCAT(ai.image_path) AS images,
           GROUP_CONCAT(ac.content SEPARATOR '||') AS content_sections
    FROM articles a
    LEFT JOIN article_images ai ON a.id = ai.article_id
    LEFT JOIN article_contents ac ON a.id = ac.article_id
    WHERE a.id = ?
    GROUP BY a.id
  `;

  db.query(query, [articleId], (err, results) => {
    if (err) {
      console.error('Error retrieving article:', err);
      return res.status(500).json({ error: 'Error retrieving article from database' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const row = results[0];
    const article = {
      id: row.id,
      title: row.title,
      date: row.date,
      category: row.category,
      content: row.content_sections ? row.content_sections.split('||') : [],
      main_image: row.main_image,
      author_name: row.author_name,
      author_avatar: row.author_avatar,
      images: row.images ? row.images.split(',') : []
    };

    res.status(200).json(article);
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
