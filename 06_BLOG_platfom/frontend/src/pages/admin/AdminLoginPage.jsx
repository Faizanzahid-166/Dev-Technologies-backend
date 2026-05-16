import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import {authAPI} from '../../api/APIs.js'; //todo
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // NOTE: Connect to your existing auth endpoint
      const res = await authAPI.login(form);
      
      const token = res.data?.token;
      let user = res.data?.user;

      // If user isn't provided, attempt to decode the JWT payload for role/id.
      if (!user && token) {
        const parseJwt = (t) => {
          try {
            const payload = t.split('.')[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            return JSON.parse(jsonPayload);
          } catch (e) {
            return null;
          }
        };

        const payload = parseJwt(token);
        if (payload) {
          user = {
            id: payload.id || payload._id || payload.userId,
            role: payload.role,
            email: payload.email || form.email,
          };
        }
      }

      if (!user || user.role !== 'admin') {
        toast.error('Access denied. Admins only.');
        return;
      }

      login(user, token);
      toast.success('Welcome back! 👋');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-400/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-rose-400/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md mx-6 z-10"
      >
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-sky-900/5 ring-1 ring-slate-200/60 backdrop-blur-sm">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-tr from-sky-400 via-indigo-500 to-rose-400 flex items-center justify-center text-3xl font-black text-white mx-auto mb-6 shadow-xl shadow-sky-500/20 rotate-3 group-hover:rotate-0 transition-transform">
              B
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">
              Admin Access
            </h1>
            <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">
              Blitz Asia Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="admin@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 py-4 text-base font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm font-bold text-slate-400 transition-colors hover:text-sky-600">
              ← Back to Homepage
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] mt-8 text-slate-300">
          Secured by JWT & SSL
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;