import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import StatCard from '../components/common/StatCard.jsx';
import TaskCard from '../components/employee/TaskCard.jsx';
import SearchFilterBar from '../components/common/SearchFilterBar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { SkeletonStat, SkeletonCard } from '../components/common/Skeleton.jsx';
import { tasksAPI } from '../api/APIs.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await tasksAPI.getMy({ search, status });
      setTasks(data.tasks);
      setStats(data.stats);
    } catch {
      toast.error('Failed to load your tasks');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const delay = setTimeout(fetchTasks, 300);
    return () => clearTimeout(delay);
  }, [fetchTasks]);

  const totalTasks = stats ? stats.pending + stats.completed + stats.not_completed : 0;
  const completionRate = totalTasks > 0 ? Math.round(((stats?.completed || 0) / totalTasks) * 100) : 0;

  // Recent 3 tasks for quick view
  const recentTasks = tasks.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="text-emerald-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-500 mt-1">Here's an overview of your assigned tasks.</p>
          </div>
          <Link to="/employee/tasks" className="btn-secondary self-start sm:self-auto text-sm">
            View All Tasks →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
          {loading && !stats ? (
            <><SkeletonStat /><SkeletonStat /><SkeletonStat /></>
          ) : (
            <>
              <StatCard label="Pending" value={stats?.pending} icon="⏳" color="amber" sub="Tasks to complete" />
              <StatCard label="Completed" value={stats?.completed} icon="✅" color="emerald" sub="Successfully done" />
              <StatCard label="Not Completed" value={stats?.not_completed} icon="❌" color="red" sub="With reasons" />
            </>
          )}
        </div>

        {/* Progress */}
        {stats && totalTasks > 0 && (
          <div className="glass-card p-5 animate-in">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-slate-400 text-sm font-medium">Your Completion Rate</p>
                <p className="text-white text-2xl font-bold mt-0.5">{completionRate}%</p>
              </div>
              <div className={`text-right text-xs px-3 py-1.5 rounded-full font-semibold
                ${completionRate >= 80 ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                  : completionRate >= 50 ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                  : 'bg-red-400/10 text-red-400 border border-red-400/20'
                }`}>
                {completionRate >= 80 ? '🌟 Excellent' : completionRate >= 50 ? '⚡ Good' : '📈 Keep going'}
              </div>
            </div>
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${completionRate}%`,
                  background: completionRate >= 80
                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : completionRate >= 50
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                }}
              />
            </div>
          </div>
        )}

        {/* Recent tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Recent Tasks</h2>
            <Link to="/employee/tasks" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : recentTasks.length === 0 ? (
            <EmptyState
              title="No tasks assigned yet"
              message="Your manager hasn't assigned any tasks to you yet. Check back soon!"
              icon="🎯"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTasks.map((task) => (
                <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
