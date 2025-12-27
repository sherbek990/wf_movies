const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  // Save the original URL to redirect back after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
}

// Home page - show banners, latest, most viewed, and featured content
router.get('/', (req, res) => {
  const db = getDb();
  
  // Get banner movies
  db.all('SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.is_banner = 1 ORDER BY created_at DESC LIMIT 5', (err, banners) => {
    if (err) banners = [];
    
    // Get latest movies
    db.all('SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id ORDER BY created_at DESC LIMIT 12', (err, latest) => {
      if (err) latest = [];
      
      // Get most viewed
      db.all('SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id ORDER BY views DESC LIMIT 12', (err, mostViewed) => {
        if (err) mostViewed = [];
        
        // Get featured movies
        db.all('SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.is_featured = 1 ORDER BY rating DESC LIMIT 12', (err, featured) => {
          if (err) featured = [];
          
          res.locals.pageTitle = 'WF Movies - Watch Latest Movies Online';
          res.render('index', { 
            banners, 
            latest, 
            mostViewed, 
            featured,
            error: null 
          });
        });
      });
    });
  });
});

// Search movies
router.get('/search', (req, res) => {
  const db = getDb();
  const query = req.query.q || '';
  
  if (!query) {
    return res.render('search', { content: [], query: '', error: null });
  }
  
  const searchPattern = `%${query}%`;
  db.all(
    'SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.title LIKE ? OR c.description LIKE ? ORDER BY views DESC',
    [searchPattern, searchPattern],
    (err, rows) => {
      if (err) {
        return res.render('search', { content: [], query, error: 'Error searching content.' });
      }
      res.locals.pageTitle = `Search: ${query} - WF Movies`;
      res.render('search', { content: rows, query, error: null });
    }
  );
});

// Genre listing
router.get('/genre/:slug', (req, res) => {
  const db = getDb();
  const slug = req.params.slug;
  
  db.get('SELECT * FROM genres WHERE slug = ?', [slug], (err, genre) => {
    if (err || !genre) {
      return res.status(404).render('404');
    }
    
    db.all(
      'SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.genre_id = ? ORDER BY created_at DESC',
      [genre.id],
      (err, rows) => {
        if (err) {
          return res.render('list', { error: 'Error loading content.', content: [], title: genre.name });
        }
        res.locals.pageTitle = `${genre.name} Movies - WF Movies`;
        res.render('list', { content: rows, error: null, title: genre.name, genre });
      }
    );
  });
});

// Movies list
router.get('/movies', (req, res) => {
  const db = getDb();
  const year = req.query.year;
  const country = req.query.country;
  
  let query = 'SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.category = ?';
  const params = ['movie'];
  
  if (year) {
    query += ' AND c.year = ?';
    params.push(year);
  }
  
  if (country) {
    query += ' AND c.country = ?';
    params.push(country);
  }
  
  query += ' ORDER BY created_at DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.render('list', { error: 'Error loading movies.', content: [], title: 'Movies' });
    }
    res.locals.pageTitle = 'Movies - WF Movies';
    res.render('list', { content: rows, error: null, title: 'Movies', selectedYear: year, selectedCountry: country });
  });
});

// Anime list
router.get('/anime', (req, res) => {
  const db = getDb();
  db.all('SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.category = ? ORDER BY created_at DESC', ['anime'], (err, rows) => {
    if (err) {
      return res.render('list', { error: 'Error loading anime.', content: [], title: 'Anime' });
    }
    res.locals.pageTitle = 'Anime - WF Movies';
    res.render('list', { content: rows, error: null, title: 'Anime' });
  });
});

// Series list
router.get('/series', (req, res) => {
  const db = getDb();
  db.all('SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.category = ? ORDER BY created_at DESC', ['series'], (err, rows) => {
    if (err) {
      return res.render('list', { error: 'Error loading series.', content: [], title: 'Series' });
    }
    res.locals.pageTitle = 'Series - WF Movies';
    res.render('list', { content: rows, error: null, title: 'Series' });
  });
});

// Single content page (requires login for watching)
router.get('/watch/:id', ensureAuthenticated, (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const episodeNumber = req.query.ep; // Get episode number from query parameter

  db.get('SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.id = ?', [id], (err, row) => {
    if (err || !row) {
      return res.status(404).render('404');
    }
    
    // Increment views
    db.run('UPDATE content SET views = views + 1 WHERE id = ?', [id]);
    
    // Get all episodes for this content
    db.all('SELECT * FROM episodes WHERE content_id = ? ORDER BY episode_number', [id], (err, episodes) => {
      // Initialize variables with default values
      if (err || !episodes) episodes = [];
      
      // Find current episode if specified
      let currentEpisode = null;
      if (episodeNumber && episodes.length > 0) {
        currentEpisode = episodes.find(ep => ep.episode_number == episodeNumber);
        if (currentEpisode) {
          // Increment episode views
          db.run('UPDATE episodes SET views = views + 1 WHERE id = ?', [currentEpisode.id]);
        }
      } else if (episodes.length > 0) {
        // Default to first episode if no episode specified and episodes exist
        currentEpisode = episodes[0];
        if (currentEpisode) {
          db.run('UPDATE episodes SET views = views + 1 WHERE id = ?', [currentEpisode.id]);
        }
      }
      
      // Get similar movies (same genre)
      db.all(
        'SELECT c.*, g.name as genre_name FROM content c LEFT JOIN genres g ON c.genre_id = g.id WHERE c.genre_id = ? AND c.id != ? ORDER BY RANDOM() LIMIT 6',
        [row.genre_id, id],
        (err, similar) => {
          if (err || !similar) similar = [];
          
          res.locals.pageTitle = `${row.title} - WF Movies`;
          res.locals.pageDescription = row.description || `Watch ${row.title} online`;
          res.render('watch', { 
            item: row, 
            similar: similar,
            episodes: episodes,
            currentEpisode: currentEpisode
          });
        }
      );
    });
  });
});

module.exports = router;
