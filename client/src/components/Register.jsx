import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Register = ({ setUser }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' });
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
      const { data } = await API.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h2>Create your team account</h2>
      <p>Register as Admin or Member and start tracking work.</p>

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Full name
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </label>

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
            placeholder="Choose a password"
            required
          />
        </label>

        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </label>

        {error && <div className="alert alert-error">{error}</div>}

        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="small-note">
        Already a member? <Link to="/login">Login here</Link>
      </p>
    </section>
  );
};

export default Register;