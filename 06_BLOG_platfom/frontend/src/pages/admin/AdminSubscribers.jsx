import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { newsletterAPI } from '../../api/APIs.js';
import { formatDate } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await newsletterAPI.getSubscribers();
        setSubscribers(Array.isArray(res.data?.data) ? res.data.data : []);
        setTotal(res.data?.total || 0);
      } catch {
        toast.error('Failed to load subscribers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Reader Community
          </h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
            {total} active subscribers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'Total Audience', value: total, icon: '📧', color: '#6366f1' },
          { label: 'Growth (30d)', value: (subscribers || []).filter(s => s.subscribedAt && new Date(s.subscribedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: '📈', color: '#10b981' },
          { label: 'Verified Active', value: total, icon: '✅', color: '#0ea5e9' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-slate-50 shadow-inner" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-4xl font-black tracking-tighter text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100">
          <h3 className="text-xl font-black tracking-tight text-slate-900">Subscriber Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">#</th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Address</th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:table-cell">Join Date</th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-10 py-6"><div className="h-6 w-full rounded-lg bg-slate-50 animate-pulse" /></td>
                  </tr>
                ))
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No active subscribers yet</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub, i) => (
                  <tr key={sub._id}>
                    <td className="px-10 py-6"><span className="text-xs font-bold text-slate-300">{i + 1}</span></td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black bg-gradient-to-tr from-sky-400 to-indigo-500 text-white shadow-lg shadow-sky-500/10">
                          {sub.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-black text-slate-900">{sub.email}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-10 py-6">
                      <span className="text-xs font-bold text-slate-500">
                        {formatDate(sub.subscribedAt)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-10 py-6">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                      >
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscribers;