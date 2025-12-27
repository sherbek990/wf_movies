# WF Movies - Modern Movie Streaming Website

A fully functional, modern movie streaming website with a sleek dark theme design.

## Features

### User Features
- **Home Page**
  - Dynamic banner/slider with featured movies
  - Latest releases section
  - Most viewed movies
  - Recommended/featured content

- **Browse & Search**
  - Browse by category (Movies, Series, Anime)
  - Browse by genre (Action, Comedy, Drama, Fantasy, Horror, Animation, etc.)
  - Fast search functionality
  - Filter by year and country

- **Movie Details**
  - Full movie information (title, description, rating, year, country, genre)
  - Integrated video player (supports YouTube, Vimeo, direct video links)
  - View counter
  - Similar movies recommendations

- **Modern UI/UX**
  - Dark mode design
  - Responsive (works on mobile, tablet, desktop)
  - Smooth animations and transitions
  - Fast loading times

- **User Authentication**
  - User registration and login
  - Secure password hashing
  - Session management

### Admin Features
- **Content Management**
  - Add, edit, delete movies/series/anime
  - Set featured content
  - Set banner/slider content
  - Manage ratings and metadata

- **Genre Management**
  - Add new genres
  - Delete genres
  - SEO-friendly URLs

- **Dashboard**
  - View all content in organized table
  - Quick edit and delete actions
  - Visual indicators for featured/banner content

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Templating**: EJS
- **Authentication**: bcryptjs + express-session
- **Styling**: Modern CSS with CSS Variables

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

### First Run

When you first run the application:
- Database will be automatically created
- Default admin account will be created
- Default genres will be initialized

### Default Admin Account

- **Username**: `admin`
- **Password**: `admin123`
- **Admin Panel**: `http://localhost:3000/admin`

**Important**: Change the default password after first login!

### Adding Sample Data

To populate the website with sample movies for testing:

```bash
node seed-data.js
```

This will add 15 sample movies/series/anime with proper metadata.

## Usage

### For Regular Users

1. **Register an Account**
   - Go to `http://localhost:3000/register`
   - Create your account
   - Login to start watching

2. **Browse Content**
   - Use the navigation menu to browse Movies, Series, or Anime
   - Click on genres in the dropdown to filter by genre
   - Use the search bar to find specific content

3. **Watch Movies**
   - Click on any movie card
   - Click "Watch" button (requires login)
   - Enjoy streaming!

### For Administrators

1. **Login to Admin Panel**
   - Go to `http://localhost:3000/admin/login`
   - Use admin credentials

2. **Add Content**
   - Click "Add Content" button
   - Fill in all required fields:
     - Title, Description, Category
     - Genre, Year, Country, Rating
     - Poster Image URL
     - Video URL (YouTube, Vimeo, or direct link)
   - Check "Featured" to show in recommended section
   - Check "Banner" to show in homepage slider
   - Click "Create Content"

3. **Manage Genres**
   - Click "Manage Genres"
   - Add new genres with name and URL slug
   - Delete unused genres

4. **Edit/Delete Content**
   - From the dashboard, click "Edit" to modify
   - Click "Delete" to remove (with confirmation)

## Video URL Formats

The player supports multiple video sources:

- **YouTube**: `https://www.youtube.com/watch?v=VIDEO_ID`
- **Vimeo**: `https://vimeo.com/VIDEO_ID`
- **Direct MP4**: `https://example.com/video.mp4`

## SEO Features

- Dynamic meta titles and descriptions
- SEO-friendly URLs for genres
- Proper HTML structure
- Fast loading times

## File Structure

```
kino sayt/
├── public/
│   └── css/
│       └── styles.css          # Modern dark theme CSS
├── routes/
│   ├── admin.js                # Admin panel routes
│   ├── auth.js                 # Authentication routes
│   └── content.js              # Content browsing routes
├── views/
│   ├── layout.ejs              # Main layout template
│   ├── index.ejs               # Homepage
│   ├── watch.ejs               # Movie player page
│   ├── list.ejs                # Content listing page
│   ├── search.ejs              # Search results page
│   ├── login.ejs               # User login
│   ├── register.ejs            # User registration
│   ├── admin-login.ejs         # Admin login
│   ├── admin-dashboard.ejs     # Admin dashboard
│   ├── admin-content-form.ejs  # Add/Edit content form
│   ├── admin-genres.ejs        # Genre management
│   └── 404.ejs                 # 404 page
├── app.js                      # Main application file
├── db.js                       # Database configuration
├── seed-data.js                # Sample data seeder
├── package.json                # Dependencies
└── database.sqlite             # SQLite database (auto-generated)
```

## Customization

### Changing Colors

Edit `public/css/styles.css` and modify the CSS variables:

```css
:root {
  --primary: #e50914;        /* Main brand color */
  --primary-dark: #b20710;   /* Darker shade */
  --secondary: #f59e0b;      /* Accent color */
  --dark-bg: #0a0a0a;        /* Background */
  --card-bg: #141414;        /* Card background */
  --text-primary: #ffffff;   /* Primary text */
  --text-secondary: #b3b3b3; /* Secondary text */
}
```

### Adding New Genres

1. Login to admin panel
2. Go to "Manage Genres"
3. Add genre name and URL-friendly slug
4. New genre will appear in navigation

## Troubleshooting

### Database Issues

If you encounter database errors:
1. Delete `database.sqlite`
2. Restart the server (database will be recreated)
3. Run `node seed-data.js` to add sample data

### Port Already in Use

Change the port in `app.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to another port
```

## Security Notes

- Change default admin password immediately
- Use HTTPS in production
- Keep dependencies updated
- Don't expose database file
- Use environment variables for sensitive data

## License

This project is open source and available for educational purposes.

---

**WF Movies** - Watch movies, series, and anime online in high quality!
