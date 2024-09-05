const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

const DB_FILE = './db.json';

// Utility function to read the database JSON file
const readDatabase = () => {
  const rawData = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(rawData);
};

// Utility function to write to the database JSON file
const writeDatabase = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Create the POST API endpoint to insert an article
app.post('/article', upload.any(), (req, res) => {
  const { title, date, category, author_name } = req.body;
  const content = req.body.content ? JSON.parse(req.body.content) : [];

  const mainImage = req.files.find(file => file.fieldname === 'main_image') ? req.files.find(file => file.fieldname === 'main_image').path : null;
  const authorAvatar = req.files.find(file => file.fieldname === 'author_avatar') ? req.files.find(file => file.fieldname === 'author_avatar').path : null;
  const images = req.files.filter(file => file.fieldname.startsWith('images')).map(file => file.path);

  if (!title || !date || !category || !author_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDatabase();
  const newArticle = {
    id: db.articles.length + 1,
    title,
    date,
    category,
    content,
    main_image: mainImage,
    author_name,
    author_avatar: authorAvatar,
    images,
  };

  db.articles.push(newArticle);
  writeDatabase(db);

  res.status(200).json({ message: 'Article created successfully', articleId: newArticle.id });
});

// Create the GET API endpoint to retrieve all articles
app.get('/articles', (req, res) => {
  const db = readDatabase();
  res.status(200).json(db.articles);
});

// Create the GET API endpoint to retrieve a specific article by ID
app.get('/article/:id', (req, res) => {
  const articleId = parseInt(req.params.id);
  const db = readDatabase();
  const article = db.articles.find(a => a.id === articleId);

  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }

  res.status(200).json(article);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
