import React, { createContext, useContext, useState, useCallback } from 'react';
import API from '../utils/api';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 });

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await API.get('/tasks', { params });
      setTasks(data.tasks);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total
      });
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const { data } = await API.get('/tasks/stats');
    setStats(data.stats);
    return data.stats;
  }, []);

  const createTask = useCallback(async (taskData) => {
    const { data } = await API.post('/tasks', taskData);
    setTasks(prev => [data.task, ...prev]);
    fetchStats();
    return data.task;
  }, [fetchStats]);

  const updateTask = useCallback(async (id, taskData) => {
    const { data } = await API.put(`/tasks/${id}`, taskData);
    setTasks(prev => prev.map(t => t._id === id ? data.task : t));
    fetchStats();
    return data.task;
  }, [fetchStats]);

  const deleteTask = useCallback(async (id) => {
    await API.delete(`/tasks/${id}`);
    setTasks(prev => prev.filter(t => t._id !== id));
    fetchStats();
  }, [fetchStats]);

  const toggleTask = useCallback(async (id) => {
    const { data } = await API.patch(`/tasks/${id}/toggle`);
    setTasks(prev => prev.map(t => t._id === id ? data.task : t));
    fetchStats();
    return data.task;
  }, [fetchStats]);

  return (
    <TaskContext.Provider value={{
      tasks, stats, loading, pagination,
      fetchTasks, fetchStats, createTask, updateTask, deleteTask, toggleTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used inside TaskProvider');
  return ctx;
};
