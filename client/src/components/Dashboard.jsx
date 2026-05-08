import React, { useState, useEffect, useMemo } from 'react';
import API from '../services/api';

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', project: '', priority: 'medium', dueDate: '' });
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects.');
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks.');
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project.');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.project) {
      setError('Please select a project for the task.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/tasks', newTask);
      setNewTask({ title: '', description: '', project: '', priority: 'medium', dueDate: '' });
      fetchTasks();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task.');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id, status) => {
    setStatusUpdate(true);
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      setError('Unable to update task status.');
    } finally {
      setStatusUpdate(false);
    }
  };

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
    const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed').length;

    return { totalProjects, totalTasks, completedTasks, overdueTasks };
  }, [projects.length, tasks]);

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'Pending': 'badge-pending',
      'In Progress': 'badge-in-progress',
      'Completed': 'badge-completed'
    };
    return statusMap[status] || 'badge-pending';
  };

  const getPriorityClass = (priority) => {
    const priorityMap = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return priorityMap[priority] || 'priority-medium';
  };

  const isOverdue = (dueDate, status) => {
    return dueDate && new Date(dueDate) < new Date() && status !== 'Completed';
  };

  return (
    <section>
      <div className="dashboard-hero card">
        <div>
          <h2>Welcome back, {user.name}</h2>
          <p>Manage your team projects, assign tasks, and track progress in real time.</p>
        </div>
        <div className="status-pill">Role: {user.role}</div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Projects</span>
          <strong>{stats.totalProjects}</strong>
        </div>
        <div className="stat-card">
          <span>Total Tasks</span>
          <strong>{stats.totalTasks}</strong>
        </div>
        <div className="stat-card">
          <span>Completed</span>
          <strong>{stats.completedTasks}</strong>
        </div>
        <div className="stat-card stat-warning">
          <span>Overdue</span>
          <strong>{stats.overdueTasks}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card panel-card">
          <h3>Projects</h3>
          {user.role === 'Admin' ? (
            <form onSubmit={handleProjectSubmit} className="form-grid compact-form">
              <label>
                Project name
                <input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Project name"
                  required
                />
              </label>
              <label>
                Description
                <input
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project description"
                />
              </label>
              <button className="button button-secondary" type="submit">Create project</button>
            </form>
          ) : (
            <p>Only admins can create new projects.</p>
          )}

          <div className="project-list">
            {projects.length === 0 ? (
              <p className="empty-state">No projects yet. Create one to get started.</p>
            ) : (
              projects.map((project) => (
                <div key={project._id} className="project-card">
                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.description || 'No description yet.'}</p>
                  </div>
                  <span>{project.members?.length || 0} members</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card panel-card">
          <h3>Tasks</h3>
          <form onSubmit={handleTaskSubmit} className="form-grid compact-form">
            <label>
              Task title
              <input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                required
              />
            </label>
            <label>
              Description
              <input
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task details"
              />
            </label>
            <label>
              Project
              <select
                value={newTask.project}
                onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
            </label>
            <label>
              Priority
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              Due date
              <input
                type="date"
                value={newTask.dueDate || ''}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </label>
            <button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add task'}</button>
          </form>

          <div className="task-table">
            {tasks.length === 0 ? (
              <p className="empty-state">No tasks have been created yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className={isOverdue(task.dueDate, task.status) ? 'row-overdue' : ''}>
                      <td style={{ fontWeight: 500 }}>{task.title}</td>
                      <td>{task.project?.name || 'No project'}</td>
                      <td>
                        <span className={`badge ${getPriorityClass(task.priority || 'medium')}`}>
                          {(task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1)}
                        </span>
                      </td>
                      <td>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                          disabled={statusUpdate}
                          className={getStatusBadgeClass(task.status)}
                          style={{ 
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td>
                        <span style={{ color: isOverdue(task.dueDate, task.status) ? '#dc2626' : '#64748b', fontWeight: isOverdue(task.dueDate, task.status) ? '600' : '400' }}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;