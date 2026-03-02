import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';
const API_BASE =
  process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000/api';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/movies/${id}/`)
      .then(res => {
        setMovie(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading movie:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back
      </button>

      <div className="details-container">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="detail-img"
        />

        <div className="info-section">
          <h1>{movie.title}</h1>

          <div className="meta">
            <span>{movie.release_year}</span>
            <span>{movie.duration} min</span>
            <span>{movie.genre}</span>
          </div>

          <p className="description">{movie.description}</p>

          {movie.video_url && (
            <a
              href={movie.video_url}
              target="_blank"
              rel="noreferrer"
              className="watch-btn"
            >
              ▶ Watch Trailer
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
