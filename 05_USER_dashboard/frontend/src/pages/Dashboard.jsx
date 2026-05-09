import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { fetchStats } from '../redux/userSliceTunk/userSice.js';
import { StatusBadge, PriorityBadge, Skeleton, ProgressBar, Avatar } from '../components/UI.jsx';
import { GitBranch, CheckCircle2, Clock, Loader2, ArrowRight, TrendingUp } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, loading }) => (
  <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4 shadow-sm">
    {loading ? (
      <Skeleton className="h-16" />
    ) : (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-medium">{label}</p>
          <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-700/40">
          <Icon size={20} className={color} strokeWidth={2} />
        </div>
      </div>
    )}
  </div>
);

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { stats, recentDependencies, statsLoading } = useSelector((s) => s.user);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    { label: 'Total', value: stats?.total ?? '—', icon: GitBranch, color: 'text-ink-300' },
    { label: 'Pending', value: stats?.pending ?? '—', icon: Clock, color: 'text-amber-400' },
    { label: 'In Progress', value: stats?.inProgress ?? '—', icon: Loader2, color: 'text-blue-400' },
    { label: 'Completed', value: stats?.completed ?? '—', icon: CheckCircle2, color: 'text-sage-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-slate-400 mb-1 font-mono">{greeting()},</p>
          <h1 className="text-2xl font-bold text-slate-50">{user?.name?.split(' ')[0]} 👋</h1>
        </div>
        <Avatar src={user?.profileImage} name={user?.name} size="lg" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} loading={statsLoading} />
        ))}
      </div>

      {/* Progress + Quick Links */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Completion Rate */}
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-6 lg:col-span-2 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-50">Overall Progress</h2>
            <TrendingUp size={18} className="text-slate-400" />
          </div>
          {statsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <>
              <ProgressBar
                value={stats?.completed ?? 0}
                max={stats?.total || 1}
                label="Completion rate"
              />
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Pending', val: stats?.pending, color: 'bg-amber-500' },
                  { label: 'In Progress', val: stats?.inProgress, color: 'bg-blue-500' },
                  { label: 'Completed', val: stats?.completed, color: 'bg-emerald-500' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
                    <div>
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="font-mono text-slate-200 text-sm">{val ?? 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Quick Actions</h3>
          {[
            { to: '/dependencies', label: 'View all dependencies', icon: GitBranch },
            { to: '/profile', label: 'Edit your profile', icon: null },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/50 border border-transparent hover:border-slate-700 text-sm text-slate-200 hover:text-white transition-all group"
            >
              {label}
              <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-200 transition-all" />
            </Link>
          ))}
          {user?.skills?.length > 0 && (
            <div className="mt-auto pt-3 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.slice(0, 5).map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700/40 text-slate-200 text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Dependencies */}
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-50">Recent Dependencies</h2>
          <Link to="/dependencies" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {statsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : recentDependencies.length === 0 ? (
          <div className="py-8 text-center">
            <GitBranch size={28} className="text-slate-500 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-slate-400">No dependencies yet.</p>
            <Link to="/dependencies" className="text-sm text-amber-400 hover:text-amber-300 mt-1 inline-block transition-colors">
              Create your first one →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentDependencies.map((dep) => (
              <div
                key={dep._id}
                className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/50 border border-transparent hover:border-slate-700 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{dep.title}</p>
                  {dep.description && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{dep.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={dep.priority} />
                  <StatusBadge status={dep.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}