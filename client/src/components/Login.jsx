import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h2>Welcome Back</h2>
      <p>Login to manage your team, projects, and tasks.</p>

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </label>

        {error && <div className="alert alert-error">{error}</div>}

        <button type="submit" className="button button-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="small-note">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
};

export default Login;