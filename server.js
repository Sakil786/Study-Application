const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// In-memory storage for Vercel (since SQLite doesn't work well in serverless)
let users = [];
let subjects = [];
let entries = [];
let userIdCounter = 1;

// Helper functions
function findUser(username) {
  return users.find(u => u.username === username);
}

function findUserById(id) {
  return users.find(u => u.id === id);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    if (findUser(username) || (email && users.find(u => u.email === email))) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: userIdCounter++,
      username,
      email: email || null,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token: token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = findUser(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected Routes for Study Data
app.get('/api/subjects', authenticateToken, (req, res) => {
  const userSubjects = subjects.filter(s => s.user_id === req.user.id);
  res.json(userSubjects);
});

app.post('/api/subjects', authenticateToken, (req, res) => {
  const { id, name, color } = req.body;
  
  const newSubject = {
    id: id || generateId(),
    user_id: req.user.id,
    name,
    color,
    created_at: new Date().toISOString()
  };
  
  subjects.push(newSubject);
  res.status(201).json({ message: 'Subject created successfully' });
});

app.delete('/api/subjects/:id', authenticateToken, (req, res) => {
  const subjectId = req.params.id;
  
  // Remove subject
  subjects = subjects.filter(s => !(s.id === subjectId && s.user_id === req.user.id));
  
  // Remove related entries
  entries = entries.filter(e => !(e.subject_id === subjectId && e.user_id === req.user.id));
  
  res.json({ message: 'Subject deleted successfully' });
});

app.get('/api/entries', authenticateToken, (req, res) => {
  const userEntries = entries.filter(e => e.user_id === req.user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(userEntries);
});

app.post('/api/entries', authenticateToken, (req, res) => {
  const { id, subjectId, date, topic, notes, minutes, understanding } = req.body;
  
  const newEntry = {
    id: id || generateId(),
    user_id: req.user.id,
    subject_id: subjectId,
    date,
    topic,
    notes,
    minutes: parseInt(minutes) || 0,
    understanding: parseInt(understanding) || 3,
    created_at: new Date().toISOString()
  };
  
  entries.push(newEntry);
  res.status(201).json({ message: 'Entry created successfully' });
});

app.put('/api/entries/:id', authenticateToken, (req, res) => {
  const entryId = req.params.id;
  const { subjectId, date, topic, notes, minutes, understanding } = req.body;
  
  const entryIndex = entries.findIndex(e => e.id === entryId && e.user_id === req.user.id);
  if (entryIndex === -1) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  
  entries[entryIndex] = {
    ...entries[entryIndex],
    subject_id: subjectId,
    date,
    topic,
    notes,
    minutes: parseInt(minutes) || 0,
    understanding: parseInt(understanding) || 3
  };
  
  res.json({ message: 'Entry updated successfully' });
});

app.delete('/api/entries/:id', authenticateToken, (req, res) => {
  const entryId = req.params.id;
  
  entries = entries.filter(e => !(e.id === entryId && e.user_id === req.user.id));
  res.json({ message: 'Entry deleted successfully' });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server (only for local development)
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;