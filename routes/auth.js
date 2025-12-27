const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');

const router = express.Router();

// Render login & register pages
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// User registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('register', { error: 'Username and password are required.' });
  }

  if (username.length < 3) {
    return res.render('register', { error: 'Username must be at least 3 characters long.' });
  }

  if (password.length < 6) {
    return res.render('register', { error: 'Password must be at least 6 characters long.' });
  }

  try {
    const db = getDb();
    
    // Check if username already exists
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, existingUser) => {
      if (err) {
        return res.render('register', { error: 'Database error. Please try again.' });
      }
      
      if (existingUser) {
        return res.render('register', { error: 'This username is already taken.' });
      }

      const hash = await bcrypt.hash(password, 10);

      db.run(
        'INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, 0)',
        [username, hash],
        (err) => {
          if (err) {
            console.error('Registration error:', err);
            return res.render('register', { error: 'Registration failed. Please try again.' });
          }
          console.log(`New user registered: ${username}`);
          res.redirect('/login');
        }
      );
    });
  } catch (e) {
    console.error('Registration error:', e);
    res.render('register', { error: 'Server error. Please try again later.' });
  }
});

// User login (normal)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('login', { error: 'Username and password are required.' });
  }
  
  const db = getDb();

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      console.error('Login error:', err);
      return res.render('login', { error: 'Database error. Please try again.' });
    }
    
    if (!user) {
      return res.render('login', { error: 'Invalid username or password.' });
    }

    try {
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.render('login', { error: 'Invalid username or password.' });
      }

      req.session.user = { 
        id: user.id, 
        username: user.username, 
        is_admin: !!user.is_admin 
      };
      
      console.log(`User logged in: ${username}`);
      
      // Redirect to the page they were trying to access, or home
      const returnTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(returnTo);
    } catch (e) {
      console.error('Login error:', e);
      return res.render('login', { error: 'Login failed. Please try again.' });
    }
  });
});

// Admin login page
router.get('/admin/login', (req, res) => {
  res.render('admin-login', { error: null });
});

// Admin login handler
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('admin-login', { error: 'Username and password are required.' });
  }
  
  const db = getDb();

  db.get('SELECT * FROM users WHERE username = ? AND is_admin = 1', [username], async (err, user) => {
    if (err) {
      console.error('Admin login error:', err);
      return res.render('admin-login', { error: 'Database error. Please try again.' });
    }
    
    if (!user) {
      return res.render('admin-login', { error: 'Invalid admin credentials.' });
    }

    try {
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.render('admin-login', { error: 'Invalid admin credentials.' });
      }

      req.session.user = { 
        id: user.id, 
        username: user.username, 
        is_admin: !!user.is_admin 
      };
      
      console.log(`Admin logged in: ${username}`);
      res.redirect('/admin');
    } catch (e) {
      console.error('Admin login error:', e);
      return res.render('admin-login', { error: 'Login failed. Please try again.' });
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
