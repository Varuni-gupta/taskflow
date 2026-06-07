import React from 'react';
import { format } from 'date-fns';
import './TaskCard.css';

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.2)' },
  'in-progress': { label: 'In Progress', color: '#6c63ff', bg: 'rgba(108,99,255,0.1)',  border: 'rgba(108,99,255,0.2)' },
  completed:   { label: 'Completed',   color: '#43e97b', bg: 'rgba(67,233,123,0.1)',  border: 'rgba(67,233,123,0.2)' },
};

const PRIORITY_CONFIG = {
  low:    { label: 'Low',    color: '#43e97b' },
  medium: { label: 'Medium', color: '#f59e0b' },
  high:   { label: 'High',   color: '#ff6584' },
};

export default function TaskCard({ task, onEdit, onDelete, onToggle, style }) {
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isCompleted = task.status === 'completed';

  return (
    <div className={`task-card animate-fadeIn ${isCompleted ? 'completed' : ''}`} style={style}>
      <div className="card-top">
        <div className="card-badges">
          <span className="priority-badge" style={{ color: priority.color }}>
            <span className="priority-dot-sm" style={{ background: priority.color }} />
            {priority.label}
          </span>
          <span className="status-badge" style={{
            color: status.color,
            background: status.bg,
            border: `1px solid ${status.border}`
          }}>
            {status.label}
          </span>
        </div>
        <button className="toggle-check" onClick={onToggle} title="Toggle status">
          <div className={`check-circle ${isCompleted ? 'checked' : ''}`}>
            {isCompleted && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
        </button>
      </div>

      <div className="card-body">
        <h3 className={`task-title ${isCompleted ? 'strikethrough' : ''}`}>{task.title}</h3>
        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
          {task.tags.length > 3 && <span className="tag-more">+{task.tags.length - 3}</span>}
        </div>
      )}

      <div className="card-footer">
        {task.dueDate && (
          <span className="due-date">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
        <span className="card-created">
          {format(new Date(task.createdAt), 'MMM d')}
        </span>
        <div className="card-actions">
          <button className="action-btn edit" onClick={onEdit} title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className="action-btn del" onClick={onDelete} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
