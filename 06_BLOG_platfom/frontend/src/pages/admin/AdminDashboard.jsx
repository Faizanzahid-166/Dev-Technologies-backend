import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogAPI, newsletterAPI } from '../../api/APIs.js';
import { formatDate } from '../../utils/helpers.js';
import { DashboardStatSkeleton } from '../../components/common/Skeleton.jsx';

const StatCard = ({ label, value, icon, trend, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
  >
    <div className="flex items-start justify-between mb-6">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner bg-slate-50"
        style={{ color }}
      >
        {icon}
      </div>
      {trend !== undefined && (
        <span
          className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}
        >
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-4xl font-black tracking-tighter text-slate-900 mb-1">
      {value}
    </p>
    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
      {label}
    </p>
  </motion.div>
);

const MiniChart = ({ data }) => {
  if (!data?.length) return null;
  const max = Math.max(...data.map((d) => d.views));
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-full transition-all duration-500 ${
              i === data.length - 1 ? 'bg-sky-500 shadow-lg shadow-sky-500/20' : 'bg-slate-100'
            }`}
            style={{
              height: `${(d.views / max) * 100}%`,
              minHeight: '4px',
            }}
          />
          <span className="text-slate-300 font-bold" style={{ fontSize: '9px' }}>
            {d.date}
          </span>
        </div>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    published: { class: 'bg-emerald-50 text-emerald-600 ring-emerald-100', label: 'Published' },
    draft: { class: 'bg-amber-50 text-amber-600 ring-amber-100', label: 'Draft' },
    archived: { class: 'bg-slate-100 text-slate-600 ring-slate-200', label: 'Archived' },
  };
  const s = map[status] || map.draft;
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ring-1 ${s.class}`}>
      {s.label}
    </span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, subRes] = await Promise.all([
          blogAPI.getStats(),
          newsletterAPI.getSubscribers().catch(() => ({ data: { total: 0 } })),
        ]);
        setStats(statsRes.data?.data || {});
        setSubscriberCount(subRes.data.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Platform Analytics
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/admin/blogs/create" className="rounded-2xl bg-sky-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-95 flex items-center gap-2">
          <span className="text-lg">✚</span> New Article
        </Link>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[...Array(4)].map((_, i) => <DashboardStatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard label="Total Posts" value={stats?.totalBlogs ?? 0} icon="✍️" color="#f59e0b" trend={12} delay={0} />
          <StatCard label="Published" value={stats?.publishedBlogs ?? 0} icon="🌐" color="#10b981" trend={8} delay={0.05} />
          <StatCard label="Total Views" value={(stats?.totalViews ?? 0).toLocaleString()} icon="👁" color="#0ea5e9" trend={23} delay={0.1} />
          <StatCard label="Subscribers" value={subscriberCount} icon="📧" color="#6366f1" trend={5} delay={0.15} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
        {/* Views chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] p-10 lg:col-span-2 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black tracking-tight text-slate-900">
                Views — Last 7 Days
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                Daily article views
              </p>
            </div>
            <span
              className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg ring-1 ring-emerald-100"
            >
              ↑ Live
            </span>
          </div>
          {stats?.viewsChart ? (
            <MiniChart data={stats.viewsChart} />
          ) : (
            <div className="h-16 w-full rounded-full bg-slate-50 animate-pulse" />
          )}
        </motion.div>

        {/* Categories breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
        >
          <h3 className="text-xl font-black tracking-tight text-slate-900 mb-8">
            Topic Distribution
          </h3>
          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => <div key={i} className="h-4 w-full rounded-full bg-slate-50 animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-6">
              {stats?.categories?.slice(0, 6).map((cat) => {
                const total = stats?.publishedBlogs || 1;
                const pct = Math.round((cat.count / total) * 100);
                return (
                  <div key={cat._id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize text-xs font-black text-slate-500 uppercase tracking-widest">
                        {cat._id}
                      </span>
                      <span className="text-xs font-black text-slate-900">{cat.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sky-500 shadow-sm"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
        {[
          { to: '/admin/blogs/create', label: 'New Post', icon: '✚', bg: 'bg-sky-50', text: 'text-sky-600' },
          { to: '/admin/blogs', label: 'Manage Posts', icon: '✍', bg: 'bg-indigo-50', text: 'text-indigo-600' },
          { to: '/admin/subscribers', label: 'Newsletter', icon: '📧', bg: 'bg-violet-50', text: 'text-violet-600' },
          { to: '/', label: 'View Site', icon: '↗', bg: 'bg-emerald-50', text: 'text-emerald-600' },
        ].map((action, i) => (
          <motion.div key={action.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
            <Link
              to={action.to}
              className="bg-white rounded-3xl p-6 flex flex-col items-center gap-3 text-center group shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${action.bg} ${action.text}`}
              >
                {action.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                {action.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent posts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden"
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100">
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            Latest Editorial Content
          </h3>
          <Link to="/admin/blogs" className="text-xs font-black uppercase tracking-widest text-sky-600 hover:text-sky-700 transition-colors">
            Full Archive →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Title</th>
                <th className="text-left hidden sm:table-cell">Status</th>
                <th className="text-left hidden md:table-cell">Views</th>
                <th className="text-left hidden lg:table-cell">Date</th>
                <th className="px-10 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-10 py-6"><div className="h-6 w-full rounded-lg bg-slate-50 animate-pulse" /></td>
                  </tr>
                ))
              ) : Array.isArray(stats?.recentBlogs) && stats.recentBlogs.length > 0 ? (
                stats.recentBlogs.map((post) => (
                  <tr key={post._id} className="group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden bg-slate-100 ring-1 ring-slate-200/50"
                        >
                          {post.coverImage?.url && (
                            <img src={post.coverImage.url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-black text-slate-900 truncate max-w-xs group-hover:text-sky-600 transition-colors"
                          >
                            {post.title}
                          </p>
                          {post.featured && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">★ Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="text-sm font-bold text-slate-600">
                        {post.views?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="text-xs font-bold text-slate-400">
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all"
                        >
                          ↗
                        </Link>
                        <Link
                          to={`/admin/blogs/edit/${post._id}`}
                          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-slate-50/20">
                  <td colSpan={5} className="text-center py-20 px-10">
                    <p className="text-sm font-bold text-slate-400">No content entries found in your database.</p>
                    <Link to="/admin/blogs/create" className="inline-block mt-6 px-8 py-3 rounded-2xl bg-sky-500 text-sm font-black text-white shadow-xl shadow-sky-500/20">
                      Create Your First Post →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;