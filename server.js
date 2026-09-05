const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize SQLite database
const db = new sqlite3.Database('./study_app.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDatabase();
  }
});

// Create tables if they don't exist
function initDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Subjects table
    db.run(`CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Study entries table
    db.run(`CREATE TABLE IF NOT EXISTS study_entries (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      subject_id TEXT NOT NULL,
      date TEXT NOT NULL,
      topic TEXT,
      notes TEXT,
      minutes INTEGER,
      understanding INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (subject_id) REFERENCES subjects (id)
    )`);
  });
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
    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, hashedPassword], 
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, username: username },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token: token,
            user: {
              id: this.lastID,
              username: username,
              email: email
            }
          });
        }
      );
    });
  } catch (error) {
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
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

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
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected Routes for Study Data
app.get('/api/subjects', authenticateToken, (req, res) => {
  db.all('SELECT * FROM subjects WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/subjects', authenticateToken, (req, res) => {
  const { id, name, color } = req.body;
  
  db.run('INSERT INTO subjects (id, user_id, name, color) VALUES (?, ?, ?, ?)',
    [id, req.user.id, name, color],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create subject' });
      }
      res.status(201).json({ message: 'Subject created successfully' });
    }
  );
});

app.delete('/api/subjects/:id', authenticateToken, (req, res) => {
  const subjectId = req.params.id;
  
  db.run('DELETE FROM subjects WHERE id = ? AND user_id = ?', [subjectId, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete subject' });
    }
    
    // Also delete related study entries
    db.run('DELETE FROM study_entries WHERE subject_id = ? AND user_id = ?', [subjectId, req.user.id], (err) => {
      if (err) {
        console.error('Error deleting related entries:', err);
      }
      res.json({ message: 'Subject deleted successfully' });
    });
  });
});

app.get('/api/entries', authenticateToken, (req, res) => {
  db.all('SELECT * FROM study_entries WHERE user_id = ? ORDER BY date DESC', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/entries', authenticateToken, (req, res) => {
  const { id, subjectId, date, topic, notes, minutes, understanding } = req.body;
  
  db.run('INSERT INTO study_entries (id, user_id, subject_id, date, topic, notes, minutes, understanding) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, req.user.id, subjectId, date, topic, notes, minutes, understanding],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create entry' });
      }
      res.status(201).json({ message: 'Entry created successfully' });
    }
  );
});

app.put('/api/entries/:id', authenticateToken, (req, res) => {
  const entryId = req.params.id;
  const { subjectId, date, topic, notes, minutes, understanding } = req.body;
  
  db.run('UPDATE study_entries SET subject_id = ?, date = ?, topic = ?, notes = ?, minutes = ?, understanding = ? WHERE id = ? AND user_id = ?',
    [subjectId, date, topic, notes, minutes, understanding, entryId, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update entry' });
      }
      res.json({ message: 'Entry updated successfully' });
    }
  );
});

app.delete('/api/entries/:id', authenticateToken, (req, res) => {
  const entryId = req.params.id;
  
  db.run('DELETE FROM study_entries WHERE id = ? AND user_id = ?', [entryId, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete entry' });
    }
    res.json({ message: 'Entry deleted successfully' });
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});