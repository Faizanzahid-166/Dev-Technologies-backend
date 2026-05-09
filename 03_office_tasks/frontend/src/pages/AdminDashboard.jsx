import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import StatCard from '../components/common/StatCard.jsx';
import TaskTable from '../components/admin/TaskTable.jsx';
import SearchFilterBar from '../components/common/SearchFilterBar.jsx';
import { SkeletonStat } from '../components/common/Skeleton.jsx';
import { tasksAPI } from '../api/APIs.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [total, setTotal] = useState(0);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await tasksAPI.getAll({ search, status, limit: 10 });
      setTasks(data.tasks);
      setStats(data.stats);
      setTotal(data.total);
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

  const totalTasks = stats ? stats.pending + stats.completed + stats.not_completed : 0;
  const completionRate = totalTasks > 0 ? Math.round((stats?.completed / totalTasks) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
              <span className="text-blue-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-500 mt-1">Here's what's happening in your workspace today.</p>
          </div>
          <Link to="/admin/create-task" className="btn-primary whitespace-nowrap self-start sm:self-auto">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </span>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger-children">
          {loading && !stats ? (
            <>
              <SkeletonStat /><SkeletonStat /><SkeletonStat /><SkeletonStat />
            </>
          ) : (
            <>
              <StatCard label="Total Tasks" value={totalTasks} icon="📋" color="blue" sub="All tasks" />
              <StatCard label="Pending" value={stats?.pending} icon="⏳" color="amber" sub="Awaiting action" />
              <StatCard label="Completed" value={stats?.completed} icon="✅" color="emerald" sub="Successfully done" />
              <StatCard label="Not Completed" value={stats?.not_completed} icon="❌" color="red" sub="Needs attention" />
            </>
          )}
        </div>

        {/* Completion rate bar */}
        {stats && totalTasks > 0 && (
          <div className="glass-card p-5 animate-in">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-400 text-sm font-medium">Overall Completion Rate</p>
                <p className="text-white text-2xl font-bold mt-0.5">{completionRate}%</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs">{stats?.completed} of {totalTasks} tasks done</p>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="flex gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending: {stats?.pending}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed: {stats?.completed}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Not Completed: {stats?.not_completed}
              </span>
            </div>
          </div>
        )}

        {/* Tasks table */}
        <div className="glass-card">
          <div className="p-5 border-b border-slate-800/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-white font-semibold text-lg">Recent Tasks</h2>
                <p className="text-slate-500 text-sm mt-0.5">{total} task{total !== 1 ? 's' : ''} total</p>
              </div>
              <Link to="/admin/tasks" className="btn-secondary text-sm self-start">
                View All →
              </Link>
            </div>
            <div className="mt-4">
              <SearchFilterBar
                search={search}
                onSearch={setSearch}
                status={status}
                onStatus={setStatus}
              />
            </div>
          </div>
          <TaskTable tasks={tasks} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
