const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Ensure that the express.json() middleware is used to parse JSON request bodies

const DB_FILE = './db.json';

const transporter = nodemailer.createTransport({
  service: 'Zoho', // Use your email service
  auth: {
    user: 'bloggerkuldeep@zohomail.in', // Your email address
    pass: 'cK0scxWa7ZSnzcT'   // Your email password or app-specific password
  }
});
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, '734ecd6369cedaf3263f5d6297c799f760b49b606270cb7464afa07aa7ad6003', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Create the POST API endpoint to register a new user
app.post('/signup', upload.single('profilePhoto'), async (req, res) => {
  const { username, email, password } = req.body;
  const profilePhoto = req.file;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  const db = readDatabase();
  const userExists = db.users.find(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    id: db.users.length + 1,
    username,
    email,
    password: hashedPassword,
    profilePhoto: profilePhoto ? profilePhoto.path : null, // Save file path
  };

  db.users.push(newUser);
  writeDatabase(db);

  res.status(201).json({ message: 'User registered successfully' });
});

// Create the POST API endpoint to log in a user
// Create the POST API endpoint to log in a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = readDatabase();
  const user = db.users.find(user => user.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Include profile photo path in the token payload
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto // Add profile photo path
    },
    '734ecd6369cedaf3263f5d6297c799f760b49b606270cb7464afa07aa7ad6003'
  );

  res.status(200).json({ token });
});


// Create the POST API endpoint to insert an article
app.post('/article', upload.any(), authenticateToken, (req, res) => {
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
  const { all } = req.query;

  console.log(`Search Query: ${all}`); // Debug log to check the query parameter

  let articles = db.articles;

  if (all) {
    const searchQuery = all.toLowerCase();

    articles = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery) ||
      article.category.toLowerCase().includes(searchQuery) ||
      article.author_name.toLowerCase().includes(searchQuery)
    );
  }

  if (articles.length === 0) {
    return res.status(404).json({ message: 'No articles found matching the criteria' });
  }

  res.status(200).json(articles);
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

// Create the PUT API endpoint to update an article by ID
app.patch('/article/:id', upload.any(), authenticateToken, (req, res) => {
  const articleId = parseInt(req.params.id);
  const { title, date, category, author_name } = req.body;
  const content = req.body.content ? JSON.parse(req.body.content) : [];

  // Handle file uploads
  const mainImage = req.files.find(file => file.fieldname === 'main_image') ? req.files.find(file => file.fieldname === 'main_image').path : null;
  const authorAvatar = req.files.find(file => file.fieldname === 'author_avatar') ? req.files.find(file => file.fieldname === 'author_avatar').path : null;
  const images = req.files.filter(file => file.fieldname.startsWith('images')).map(file => file.path);

  const db = readDatabase();
  const articleIndex = db.articles.findIndex(a => a.id === articleId);

  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Update the article partially
  const updatedArticle = {
    ...db.articles[articleIndex],
    ...(title && { title }),
    ...(date && { date }),
    ...(category && { category }),
    ...(author_name && { author_name }),
    ...(content.length > 0 && { content }),
    ...(mainImage && { main_image: mainImage }),
    ...(authorAvatar && { author_avatar: authorAvatar }),
    ...(images.length > 0 && { images })
  };

  db.articles[articleIndex] = updatedArticle;

  writeDatabase(db);

  res.status(200).json({ message: 'Article updated successfully' });
});


// Create the DELETE API endpoint to delete an article by ID
app.delete('/article/:id', authenticateToken, (req, res) => {
  const articleId = parseInt(req.params.id);

  const db = readDatabase();
  const articleIndex = db.articles.findIndex(a => a.id === articleId);

  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found' });
  }

  // Remove the article from the database
  db.articles.splice(articleIndex, 1);
  writeDatabase(db);

  res.status(200).json({ message: 'Article deleted successfully' });
});

// Create the GET API endpoint to retrieve articles by author_name
app.get('/myblogs', authenticateToken, (req, res) => {
  const { username } = req.user; // Get the username from the authenticated user

  if (!username) {
    return res.status(400).json({ error: 'Username not found in token' });
  }

  const db = readDatabase();
  const articlesByAuthor = db.articles.filter(article => article.author_name === username);

  if (articlesByAuthor.length === 0) {
    return res.status(404).json({ message: 'No articles found for this author' });
  }

  res.status(200).json(articlesByAuthor);
});

app.post('/forgot-password', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const db = readDatabase();
  const user = db.users.find(user => user.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate a new random password
  const newPassword = randomstring.generate({ length: 12, charset: 'alphanumeric' });

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update the user's password in the database
  user.password = hashedPassword;
  writeDatabase(db);

  // Send the new password to the user's email
  const mailOptions = {
    from: 'bloggerkuldeep@zohomail.in',
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Your new password is: <strong>${newPassword}</strong></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'New password sent to email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending new password email' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
