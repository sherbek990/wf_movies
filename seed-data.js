// Sample data seeder for WF Movies
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH);

const sampleMovies = [
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    category: 'movie',
    genre_id: 1, // Action
    year: 2008,
    country: 'USA',
    rating: 9.0,
    image_url: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    is_featured: 1,
    is_banner: 1
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    category: 'movie',
    genre_id: 7, // Sci-Fi
    year: 2010,
    country: 'USA',
    rating: 8.8,
    image_url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    is_featured: 1,
    is_banner: 1
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    category: 'movie',
    genre_id: 3, // Drama
    year: 1994,
    country: 'USA',
    rating: 9.3,
    image_url: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    is_featured: 1,
    is_banner: 1
  },
  {
    title: 'Interstellar',
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    category: 'movie',
    genre_id: 7, // Sci-Fi
    year: 2014,
    country: 'USA',
    rating: 8.6,
    image_url: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    is_featured: 1,
    is_banner: 1
  },
  {
    title: 'Spirited Away',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    category: 'anime',
    genre_id: 6, // Animation
    year: 2001,
    country: 'Japan',
    rating: 8.6,
    image_url: 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=ByXuk9QqQkk',
    is_featured: 1
  },
  {
    title: 'Your Name',
    description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    category: 'anime',
    genre_id: 9, // Romance
    year: 2016,
    country: 'Japan',
    rating: 8.4,
    image_url: 'https://m.media-amazon.com/images/M/MV5BODRmZDVmNzUtZDA4ZC00NjhkLWI2M2UtN2M0ZDIzNDcxYThjL2ltYWdlXkEyXkFqcGdeQXVyNTk0MzMzODA@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=xU47nhruN-Q',
    is_featured: 1
  },
  {
    title: 'Breaking Bad',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    category: 'series',
    genre_id: 3, // Drama
    year: 2008,
    country: 'USA',
    rating: 9.5,
    image_url: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    is_featured: 1
  },
  {
    title: 'Stranger Things',
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
    category: 'series',
    genre_id: 5, // Horror
    year: 2016,
    country: 'USA',
    rating: 8.7,
    image_url: 'https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTZiZjhhN2Q2XkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    is_featured: 1
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    category: 'movie',
    genre_id: 7, // Sci-Fi
    year: 1999,
    country: 'USA',
    rating: 8.7,
    image_url: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    is_featured: 0
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    category: 'movie',
    genre_id: 8, // Thriller
    year: 1994,
    country: 'USA',
    rating: 8.9,
    image_url: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    is_featured: 0
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
    category: 'movie',
    genre_id: 3, // Drama
    year: 1994,
    country: 'USA',
    rating: 8.8,
    image_url: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
    is_featured: 0
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    category: 'movie',
    genre_id: 3, // Drama
    year: 1972,
    country: 'USA',
    rating: 9.2,
    image_url: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=UaVTIH8mujA',
    is_featured: 0
  },
  {
    title: 'Attack on Titan',
    description: 'After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the earth of the giant humanoid Titans.',
    category: 'anime',
    genre_id: 1, // Action
    year: 2013,
    country: 'Japan',
    rating: 9.0,
    image_url: 'https://m.media-amazon.com/images/M/MV5BNzc5MTczNjQtNDVkYS00YTk0LThjMzgtNGFmZTljNTkwNmZhXkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=MGRm4IzK1SQ',
    is_featured: 0
  },
  {
    title: 'The Hangover',
    description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.',
    category: 'movie',
    genre_id: 2, // Comedy
    year: 2009,
    country: 'USA',
    rating: 7.7,
    image_url: 'https://m.media-amazon.com/images/M/MV5BNGQwZjg5YmYtY2VkNC00NzliLTljYTctNzI5NmU3MjE2ODQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=tcdUhdOlz9M',
    is_featured: 0
  },
  {
    title: 'Game of Thrones',
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    category: 'series',
    genre_id: 4, // Fantasy
    year: 2011,
    country: 'USA',
    rating: 9.2,
    image_url: 'https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg',
    video_url: 'https://www.youtube.com/watch?v=KPLWWIOCOOQ',
    is_featured: 0
  }
];

console.log('Adding sample movies to database...\n');

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT INTO content (title, description, category, genre_id, year, country, rating, image_url, video_url, is_featured, is_banner, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  sampleMovies.forEach((movie, index) => {
    const views = Math.floor(Math.random() * 10000) + 100; // Random views between 100-10100
    stmt.run(
      movie.title,
      movie.description,
      movie.category,
      movie.genre_id,
      movie.year,
      movie.country,
      movie.rating,
      movie.image_url,
      movie.video_url,
      movie.is_featured,
      movie.is_banner || 0,
      views,
      (err) => {
        if (err) {
          console.error(`✗ Error adding "${movie.title}":`, err.message);
        } else {
          console.log(`✓ Added: ${movie.title} (${movie.year}) - ${movie.category}`);
        }
      }
    );
  });

  stmt.finalize(() => {
    console.log('\n✓ Sample data added successfully!');
    console.log(`Total movies added: ${sampleMovies.length}`);
    console.log('\nYou can now start the server with: npm start');
    db.close();
  });
});
