const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const { initDb, getDb } = require('./db');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: 'wf-movies-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Make user available in views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Make genres available globally
app.use((req, res, next) => {
  const db = getDb();
  db.all('SELECT * FROM genres ORDER BY name', (err, genres) => {
    res.locals.genres = err ? [] : genres;
    next();
  });
});

// SEO middleware for meta tags
app.use((req, res, next) => {
  res.locals.pageTitle = 'WF Movies - Watch Movies Online';
  res.locals.pageDescription = 'Watch the latest movies, series and anime online. High quality streaming for free.';
  res.locals.pageKeywords = 'movies, online streaming, watch movies, cinema, films';
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', contentRoutes);
app.use('/admin', adminRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404');
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`WF Movies server running on http://localhost:${PORT}`);
      console.log(`Admin panel: http://localhost:${PORT}/admin`);
      console.log(`Default admin: username="admin", password="admin123"`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
