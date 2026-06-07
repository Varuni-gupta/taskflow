import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTasks } from '../context/TaskContext';
import './TaskModal.css';

const DEFAULT_FORM = {
  title: '', description: '',
  status: 'pending', priority: 'medium',
  dueDate: '', tags: ''
};

export default function TaskModal({ task, onClose, onSuccess }) {
  const { createTask, updateTask } = useTasks();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(task);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        tags: task.tags ? task.tags.join(', ') : ''
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        dueDate: form.dueDate || null
      };
      if (isEdit) {
        await updateTask(task._id, payload);
        toast.success('Task updated!');
      } else {
        await createTask(payload);
        toast.success('Task created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal animate-fadeIn" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label>Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={set('title')}
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label>Description</label>
            <textarea
              placeholder="Add some details..."
              value={form.description}
              onChange={set('description')}
              rows={3}
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Status</label>
              <div className="select-wrap">
                <select value={form.status} onChange={set('status')}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <svg className="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            <div className="modal-field">
              <label>Priority</label>
              <div className="select-wrap">
                <select value={form.priority} onChange={set('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <svg className="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Due Date</label>
              <input type="date" value={form.dueDate} onChange={set('dueDate')} />
            </div>

            <div className="modal-field">
              <label>Tags</label>
              <input
                type="text"
                placeholder="design, ui, backend"
                value={form.tags}
                onChange={set('tags')}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="btn-spinner-sm" /> : (isEdit ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
