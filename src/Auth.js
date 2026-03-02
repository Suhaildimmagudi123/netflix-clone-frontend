import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_BASE = 'http://localhost:8000/api';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isLogin
      ? `${API_BASE}/auth/login/`
      : `${API_BASE}/auth/signup/`;

    try {
      const response = await axios.post(url, formData);

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        navigate('/');
      } else {
        setIsLogin(true);
        setError('Account created! Please login.');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>NETFLIX</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="auth-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <p className="toggle-text">
            {isLogin ? 'New to Netflix? ' : 'Already have an account? '}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up now' : 'Sign in'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Auth;
