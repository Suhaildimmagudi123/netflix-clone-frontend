import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MovieDetails from './MovieDetails';
import Auth from './Auth';
import './App.css';

const API_BASE = 'https://netflix-clone-078z.onrender.com/api';  
function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch movies
    axios.get(`${API_BASE}/movies/`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setMovies(response.data);
        } else if (response.data.results) {
          setMovies(response.data.results);
        } else {
          setMovies([]);
        }
      })
      .catch(error => {
        console.error('Movies error:', error);
        setMovies([]);
      });

    // Fetch logged user + watchlist
    const loggedUser = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (loggedUser && token) {
      setUsername(loggedUser);

      axios.get(`${API_BASE}/watchlist/`, {
        headers: { Authorization: `Token ${token}` }
      })
        .then(res => {
          if (Array.isArray(res.data)) {
            const ids = res.data
              .map(item => item.movie?.id)
              .filter(Boolean);
            setWatchlist(ids);
          }
        })
        .catch(err => {
          console.error('Watchlist error:', err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    setWatchlist([]);
    navigate('/auth');
  };

  const toggleWatchlist = (movieId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (watchlist.includes(movieId)) {
      axios.delete(`${API_BASE}/watchlist/${movieId}/`, {
        headers: { Authorization: `Token ${token}` }
      })
        .then(() => {
          setWatchlist(prev => prev.filter(id => id !== movieId));
        })
        .catch(err => console.error('Remove error:', err));
    } else {
      axios.post(`${API_BASE}/watchlist/`, { movie_id: movieId }, {
        headers: { Authorization: `Token ${token}` }
      })
        .then(() => {
          setWatchlist(prev => [...prev, movieId]);
        })
        .catch(err => console.error('Add error:', err));
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="navbar">
        <h1>NETFLIX</h1>
        <div className="navbar-right">
          <input
            type="text"
            placeholder="Search movies..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {username ? (
            <div className="user-section">
              <span className="username">Hi, {username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="login-btn"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <div className="movies-container">
        <h2>Popular Movies</h2>
        <div className="movies-grid">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`}>
                <img src={movie.thumbnail} alt={movie.title} />
              </Link>

              {username && (
                <button
                  className="favorite-btn"
                  onClick={() => toggleWatchlist(movie.id)}
                >
                  {watchlist.includes(movie.id) ? '❤️' : '🤍'}
                </button>
              )}

              <Link
                to={`/movie/${movie.id}`}
                style={{ textDecoration: 'none' }}
              >
                <h3>{movie.title}</h3>
                <p>{movie.genre} • {movie.release_year}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
