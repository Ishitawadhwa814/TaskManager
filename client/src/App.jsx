import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import API from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/verify')
        .then(({ data }) => setUser(data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="app-shell"><div className="loading-card">Loading application...</div></div>;
  }

  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>Team Task Manager</h1>
            <p>Track projects, assign tasks, and manage teams with Admin/Member access.</p>
          </div>
          <nav>
            {user ? (
              <>
                <span className="nav-user">{user.name} ({user.role})</span>
                <button className="button button-secondary" onClick={logout}>Logout</button>
              </>
            ) : (
              <div className="nav-links">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>
            )}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
