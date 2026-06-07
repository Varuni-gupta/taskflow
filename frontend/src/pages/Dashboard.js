import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import StatsCard from '../components/StatsCard';
import './Dashboard.css';

const FILTERS = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITIES = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { tasks, stats, loading, pagination, fetchTasks, fetchStats, deleteTask, toggleTask } = useTasks();

  const [modal, setModal] = useState({ open: false, task: null });
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', search: '', page: 1 });
  const [searchInput, setSearchInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = useCallback(() => {
    const params = {};
    if (filters.status !== 'all') params.status = filters.status;
    if (filters.priority !== 'all') params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    params.page = filters.page;
    params.limit = 9;
    fetchTasks(params);
  }, [filters, fetchTasks]);

  useEffect(() => { load(); fetchStats(); }, [load, fetchStats]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(p => ({ ...p, search: searchInput, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      toast.success('Task deleted');
      setDeleteConfirm(null);
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon-sm">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="11" height="11" rx="3" fill="#6c63ff"/>
              <rect x="15" y="2" width="11" height="11" rx="3" fill="#6c63ff" opacity="0.5"/>
              <rect x="2" y="15" width="11" height="11" rx="3" fill="#6c63ff" opacity="0.5"/>
              <rect x="15" y="15" width="11" height="11" rx="3" fill="#ff6584"/>
            </svg>
          </div>
          <span>TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <p className="nav-label">Overview</p>
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`nav-item ${filters.status === f.value ? 'active' : ''}`}
                onClick={() => { setFilters(p => ({ ...p, status: f.value, page: 1 })); setSidebarOpen(false); }}
              >
                <span className={`status-dot dot-${f.value}`} />
                {f.label}
                <span className="nav-count">
                  {f.value === 'all' ? stats.total : f.value === 'pending' ? stats.pending : f.value === 'in-progress' ? stats.inProgress : stats.completed}
                </span>
              </button>
            ))}
          </div>

          <div className="nav-section">
            <p className="nav-label">Priority</p>
            {PRIORITIES.map(p => (
              <button
                key={p.value}
                className={`nav-item ${filters.priority === p.value ? 'active' : ''}`}
                onClick={() => { setFilters(prev => ({ ...prev, priority: p.value, page: 1 })); setSidebarOpen(false); }}
              >
                <span className={`priority-dot p-${p.value}`} />
                {p.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(p => !p)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <h1 className="page-title">
                {FILTERS.find(f => f.value === filters.status)?.label}
              </h1>
              <p className="page-sub">
                {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
          <button className="add-btn" onClick={() => setModal({ open: true, task: null })}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>New Task</span>
          </button>
        </header>

        {/* Stats */}
        <div className="stats-row">
          <StatsCard label="Total" value={stats.total} color="accent" icon="grid" />
          <StatsCard label="Pending" value={stats.pending} color="amber" icon="clock" />
          <StatsCard label="In Progress" value={stats.inProgress} color="purple" icon="zap" />
          <StatsCard label="Completed" value={stats.completed} color="green" icon="check" />
        </div>

        {/* Search */}
        <div className="search-bar">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button className="clear-search" onClick={() => { setSearchInput(''); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Tasks grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="task-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>No tasks found</h3>
            <p>
              {filters.search ? `No results for "${filters.search}"` : 'Create your first task to get started'}
            </p>
            {!filters.search && (
              <button className="empty-cta" onClick={() => setModal({ open: true, task: null })}>
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                style={{ animationDelay: `${i * 0.05}s` }}
                onEdit={() => setModal({ open: true, task })}
                onDelete={() => setDeleteConfirm(task._id)}
                onToggle={() => handleToggle(task._id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={filters.page <= 1}
              onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`page-num ${filters.page === i + 1 ? 'active' : ''}`}
                onClick={() => setFilters(p => ({ ...p, page: i + 1 }))}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={filters.page >= pagination.totalPages}
              onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {modal.open && (
        <TaskModal
          task={modal.task}
          onClose={() => setModal({ open: false, task: null })}
          onSuccess={() => { load(); setModal({ open: false, task: null }); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirm-modal animate-fadeIn" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <h3>Delete Task?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn-delete" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
