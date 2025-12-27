const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../db');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'videos');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /mp4|avi|mkv|mov|wmv|flv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  }
});

function ensureAdmin(req, res, next) {
  if (req.session.user && req.session.user.is_admin) {
    return next();
  }
  res.redirect('/admin/login');
}

// Admin dashboard
router.get('/', ensureAdmin, (req, res) => {
  const db = getDb();
  db.all('SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.render('admin-dashboard', { error: 'Error loading content.', content: [] });
    }
    res.render('admin-dashboard', { content: rows, error: null });
  });
});

// Genres management
router.get('/genres', ensureAdmin, (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM genres ORDER BY name', (err, genres) => {
    if (err) {
      return res.render('admin-genres', { error: 'Error loading genres.', genres: [] });
    }
    res.render('admin-genres', { genres, error: null, success: null });
  });
});

// Add genre
router.post('/genres/add', ensureAdmin, (req, res) => {
  const { name, slug } = req.body;
  const db = getDb();
  
  db.run('INSERT INTO genres (name, slug) VALUES (?, ?)', [name, slug], (err) => {
    if (err) {
      return res.redirect('/admin/genres?error=Failed to add genre');
    }
    res.redirect('/admin/genres?success=Genre added successfully');
  });
});

// Delete genre
router.post('/genres/:id/delete', ensureAdmin, (req, res) => {
  const db = getDb();
  const id = req.params.id;
  
  db.run('DELETE FROM genres WHERE id = ?', [id], (err) => {
    if (err) {
      return res.redirect('/admin/genres?error=Failed to delete genre');
    }
    res.redirect('/admin/genres?success=Genre deleted successfully');
  });
});

// New content form
router.get('/content/new', ensureAdmin, (req, res) => {
  const db = getDb();
  db.all('SELECT * FROM genres ORDER BY name', (err, genres) => {
    res.render('admin-content-form', { item: null, genres: err ? [] : genres, error: null });
  });
});

// Create content
router.post('/content/new', ensureAdmin, (req, res) => {
  const { title, description, category, genre_id, year, country, rating, image_url, video_url, is_featured, is_banner } = req.body;
  if (!title || !category || !video_url) {
    const db = getDb();
    db.all('SELECT * FROM genres ORDER BY name', (err, genres) => {
      return res.render('admin-content-form', { item: null, genres: err ? [] : genres, error: 'Title, category and video URL are required.' });
    });
    return;
  }

  const db = getDb();
  db.run(
    'INSERT INTO content (title, description, category, genre_id, year, country, rating, image_url, video_url, is_featured, is_banner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, category, genre_id || null, year || null, country || null, rating || 0, image_url, video_url, is_featured ? 1 : 0, is_banner ? 1 : 0],
    (err) => {
      if (err) {
        db.all('SELECT * FROM genres ORDER BY name', (err, genres) => {
          return res.render('admin-content-form', { item: null, genres: err ? [] : genres, error: 'Error creating content.' });
        });
        return;
      }
      res.redirect('/admin');
    },
  );
});

// Edit content form
router.get('/content/:id/edit', ensureAdmin, (req, res) => {
  const db = getDb();
  const id = req.params.id;

  db.get('SELECT * FROM content WHERE id = ?', [id], (err, row) => {
    if (err || !row) {
      return res.status(404).render('404');
    }
    db.all('SELECT * FROM genres ORDER BY name', (err, genres) => {
      res.render('admin-content-form', { item: row, genres: err ? [] : genres, error: null });
    });
  });
});

// Update content
router.post('/content/:id/edit', ensureAdmin, (req, res) => {
  const { title, description, category, genre_id, year, country, rating, image_url, video_url, is_featured, is_banner } = req.body;
  const id = req.params.id;

  if (!title || !category || !video_url) {
    const db = getDb();
    db.all('SELECT * FROM genres ORDER BY name', (err, genres) => {
      return res.render('admin-content-form', { 
        item: { id, title, description, category, genre_id, year, country, rating, image_url, video_url, is_featured, is_banner }, 
        genres: err ? [] : genres,
        error: 'Title, category and video URL are required.' 
      });
    });
    return;
  }

  const db = getDb();
  db.run(
    'UPDATE content SET title = ?, description = ?, category = ?, genre_id = ?, year = ?, country = ?, rating = ?, image_url = ?, video_url = ?, is_featured = ?, is_banner = ? WHERE id = ?',
    [title, description, category, genre_id || null, year || null, country || null, rating || 0, image_url, video_url, is_featured ? 1 : 0, is_banner ? 1 : 0, id],
    (err) => {
      if (err) {
        db.all('SELECT * FROM genres ORDER BY name', (err, genres) => {
          return res.render('admin-content-form', { 
            item: { id, title, description, category, genre_id, year, country, rating, image_url, video_url, is_featured, is_banner }, 
            genres: err ? [] : genres,
            error: 'Error updating content.' 
          });
        });
        return;
      }
      res.redirect('/admin');
    },
  );
});

// Delete content
router.post('/content/:id/delete', ensureAdmin, (req, res) => {
  const id = req.params.id;
  const db = getDb();

  db.run('DELETE FROM content WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).send('Error deleting content');
    }
    res.redirect('/admin');
  });
});

// Episode Management Routes

// View episodes for content
router.get('/content/:id/episodes', ensureAdmin, (req, res) => {
  const contentId = req.params.id;
  const db = getDb();
  
  db.get('SELECT * FROM content WHERE id = ?', [contentId], (err, content) => {
    if (err || !content) {
      return res.status(404).render('404');
    }
    
    db.all('SELECT * FROM episodes WHERE content_id = ? ORDER BY episode_number', [contentId], (err, episodes) => {
      res.render('admin-episodes', {
        content,
        episodes: err ? [] : episodes,
        error: null,
        success: null
      });
    });
  });
});

// Add episode form
router.get('/content/:id/episodes/new', ensureAdmin, (req, res) => {
  const contentId = req.params.id;
  const db = getDb();
  
  db.get('SELECT * FROM content WHERE id = ?', [contentId], (err, content) => {
    if (err || !content) {
      return res.status(404).render('404');
    }
    
    res.render('admin-episode-form', {
      content,
      episode: null,
      error: null
    });
  });
});

// Create episode (with file upload or link)
router.post('/content/:id/episodes/new', ensureAdmin, upload.single('video_file'), (req, res) => {
  const contentId = req.params.id;
  const { episode_number, title, description, video_url, duration } = req.body;
  const db = getDb();
  
  // Use uploaded file path if available, otherwise use provided URL
  let finalVideoUrl = video_url;
  if (req.file) {
    finalVideoUrl = '/uploads/videos/' + req.file.filename;
  }
  
  if (!episode_number || !finalVideoUrl) {
    return res.redirect(`/admin/content/${contentId}/episodes?error=Episode number and video are required`);
  }
  
  db.run(
    'INSERT INTO episodes (content_id, episode_number, title, description, video_url, duration) VALUES (?, ?, ?, ?, ?, ?)',
    [contentId, episode_number, title, description, finalVideoUrl, duration || null],
    (err) => {
      if (err) {
        console.error('Error creating episode:', err);
        return res.redirect(`/admin/content/${contentId}/episodes?error=Error creating episode`);
      }
      res.redirect(`/admin/content/${contentId}/episodes?success=Episode added successfully`);
    }
  );
});

// Edit episode form
router.get('/content/:contentId/episodes/:episodeId/edit', ensureAdmin, (req, res) => {
  const { contentId, episodeId } = req.params;
  const db = getDb();
  
  db.get('SELECT * FROM content WHERE id = ?', [contentId], (err, content) => {
    if (err || !content) {
      return res.status(404).render('404');
    }
    
    db.get('SELECT * FROM episodes WHERE id = ? AND content_id = ?', [episodeId, contentId], (err, episode) => {
      if (err || !episode) {
        return res.status(404).render('404');
      }
      
      res.render('admin-episode-form', {
        content,
        episode,
        error: null
      });
    });
  });
});

// Update episode
router.post('/content/:contentId/episodes/:episodeId/edit', ensureAdmin, upload.single('video_file'), (req, res) => {
  const { contentId, episodeId } = req.params;
  const { episode_number, title, description, video_url, duration } = req.body;
  const db = getDb();
  
  // Use uploaded file path if available, otherwise use provided URL
  let finalVideoUrl = video_url;
  if (req.file) {
    finalVideoUrl = '/uploads/videos/' + req.file.filename;
  }
  
  if (!episode_number || !finalVideoUrl) {
    return res.redirect(`/admin/content/${contentId}/episodes?error=Episode number and video are required`);
  }
  
  db.run(
    'UPDATE episodes SET episode_number = ?, title = ?, description = ?, video_url = ?, duration = ? WHERE id = ? AND content_id = ?',
    [episode_number, title, description, finalVideoUrl, duration || null, episodeId, contentId],
    (err) => {
      if (err) {
        console.error('Error updating episode:', err);
        return res.redirect(`/admin/content/${contentId}/episodes?error=Error updating episode`);
      }
      res.redirect(`/admin/content/${contentId}/episodes?success=Episode updated successfully`);
    }
  );
});

// Delete episode
router.post('/content/:contentId/episodes/:episodeId/delete', ensureAdmin, (req, res) => {
  const { contentId, episodeId } = req.params;
  const db = getDb();
  
  db.run('DELETE FROM episodes WHERE id = ? AND content_id = ?', [episodeId, contentId], (err) => {
    if (err) {
      console.error('Error deleting episode:', err);
      return res.redirect(`/admin/content/${contentId}/episodes?error=Error deleting episode`);
    }
    res.redirect(`/admin/content/${contentId}/episodes?success=Episode deleted successfully`);
  });
});

module.exports = router;
