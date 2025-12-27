const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'database.sqlite');

let db;

function getDb() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH);
  }
  return db;
}

function initDb() {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          is_admin INTEGER NOT NULL DEFAULT 0
        )`,
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS genres (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          slug TEXT UNIQUE NOT NULL
        )`
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS content (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          genre_id INTEGER,
          year INTEGER,
          country TEXT,
          rating REAL DEFAULT 0,
          views INTEGER DEFAULT 0,
          image_url TEXT,
          video_url TEXT,
          is_featured INTEGER DEFAULT 0,
          is_banner INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (genre_id) REFERENCES genres(id)
        )`,
      );

      // Episodes table for series/anime with multiple parts
      db.run(
        `CREATE TABLE IF NOT EXISTS episodes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content_id INTEGER NOT NULL,
          episode_number INTEGER NOT NULL,
          title TEXT,
          description TEXT,
          video_url TEXT NOT NULL,
          duration INTEGER,
          views INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
        )`,
      );

      // Create default admin user if not exists
      db.get('SELECT * FROM users WHERE is_admin = 1 LIMIT 1', async (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          const username = 'admin';
          const password = 'admin123';
          const hash = await bcrypt.hash(password, 10);

          db.run(
            'INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, 1)',
            [username, hash],
            (insertErr) => {
              if (insertErr) {
                reject(insertErr);
                return;
              }
              console.log('Default admin created: username="admin", password="admin123"');
              initializeGenres(db, resolve, reject);
            },
          );
        } else {
          initializeGenres(db, resolve, reject);
        }
      });
    });
  });
}

function initializeGenres(db, resolve, reject) {
  const defaultGenres = [
    { name: 'Action', slug: 'action' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Animation', slug: 'animation' },
    { name: 'Sci-Fi', slug: 'sci-fi' },
    { name: 'Thriller', slug: 'thriller' },
    { name: 'Romance', slug: 'romance' },
    { name: 'Adventure', slug: 'adventure' }
  ];

  db.get('SELECT COUNT(*) as count FROM genres', (err, row) => {
    if (err) {
      reject(err);
      return;
    }

    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO genres (name, slug) VALUES (?, ?)');
      defaultGenres.forEach(genre => {
        stmt.run(genre.name, genre.slug);
      });
      stmt.finalize(() => {
        console.log('Default genres initialized');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  getDb,
  initDb,
};
