import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import TaskCard from '../components/employee/TaskCard.jsx';
import SearchFilterBar from '../components/common/SearchFilterBar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { SkeletonCard } from '../components/common/Skeleton.jsx';
import { tasksAPI } from '../api/APIs.js';
import toast from 'react-hot-toast';

const EmployeeTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await tasksAPI.getMy({ search, status });
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const delay = setTimeout(fetchTasks, 300);
    return () => clearTimeout(delay);
  }, [fetchTasks]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            <p className="text-slate-500 mt-1">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you
            </p>
          </div>
          <button
            onClick={fetchTasks}
            className="btn-secondary text-sm self-start sm:self-auto flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Filters */}
        <SearchFilterBar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          placeholder="Search your tasks..."
        />

        {/* Tasks grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            message={search || status ? 'Try adjusting your search or filters.' : 'No tasks have been assigned to you yet.'}
            icon="🔍"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeTasksPage;
