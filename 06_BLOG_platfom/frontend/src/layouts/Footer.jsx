import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { newsletterAPI } from '../api/APIs.js';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await newsletterAPI.subscribe(email);
      toast.success(res.data.message);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Technology', 'Design', 'Business', 'Science', 'Health', 'Travel'];
  const social = [
    { name: 'Twitter', href: '#', icon: '𝕏' },
    { name: 'GitHub', href: '#', icon: '⌥' },
    { name: 'LinkedIn', href: '#', icon: 'in' },
    { name: 'RSS', href: '#', icon: '◉' },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      {/* Newsletter section */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 pb-20 border-b border-slate-200">
          <div>
            <span className="inline-block rounded-full bg-sky-100 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-sky-600 mb-6">
              Newsletter
            </span>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">
              Stay in the loop
            </h3>
            <p className="text-lg font-medium text-slate-500 leading-relaxed max-w-md">
              Get the best articles delivered straight to your inbox. No spam, unsubscribe anytime.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="whitespace-nowrap rounded-2xl bg-sky-500 px-10 py-4 text-lg font-black text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-95 disabled:opacity-70"
            >
              {loading ? 'Subscribing...' : 'Subscribe →'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-lg group-hover:rotate-6 transition-transform">B</div>
              <span className="text-xl font-black tracking-tighter text-slate-900">Blitz News</span>
            </Link>
            <p className="text-sm font-medium leading-relaxed text-slate-500 mb-8">
              A modern blog platform for thinkers, creators, and explorers.
            </p>
            <div className="flex gap-4">
              {social.map(s => (
                <a key={s.name} href={s.href} title={s.name}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 transition-all hover:text-sky-500 hover:border-sky-300 hover:-translate-y-1 shadow-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Categories</h4>
            <ul className="space-y-4">
              {categories.map(c => (
                <li key={c}>
                  <Link to={`/blogs?category=${c.toLowerCase()}`} className="text-sm font-bold text-slate-600 transition-colors hover:text-sky-600"
                  >{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Platform</h4>
            <ul className="space-y-4">
              {[['/', 'Home'], ['/blogs', 'All Articles'], ['/admin', 'Admin Panel']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm font-bold text-slate-600 transition-colors hover:text-sky-600"
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm font-bold text-slate-600 transition-colors hover:text-sky-600"
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-10 border-t border-slate-200">
          <p className="text-sm font-bold text-slate-400">
            © {new Date().getFullYear()} Blitz. All rights reserved.
          </p>
          <p className="text-sm font-bold text-slate-400">
            Built with <span className="text-rose-500">❤️</span> using MERN
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;