import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const icons = {
  dashboard: '▦',
  blogs: '✍',
  create: '✚',
  media: '🖼',
  comments: '💬',
  subscribers: '📧',
  settings: '⚙',
};

const nav = [
  { to: '/admin', label: 'Dashboard', icon: icons.dashboard, exact: true },
  { to: '/admin/blogs', label: 'All Posts', icon: icons.blogs },
  { to: '/admin/blogs/create', label: 'New Post', icon: icons.create },
  { to: '/admin/subscribers', label: 'Newsletter', icon: icons.subscribers },
];

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-rose-400 flex items-center justify-center font-black text-white text-lg flex-shrink-0 shadow-lg shadow-sky-500/20">B</div>
        {!collapsed && <span className="font-black text-xl tracking-tighter text-slate-900">Blitz<span className="text-sky-500">.</span></span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2">
        {nav.map((item) => {
          const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to) && item.to !== '/admin';
          const isActive = item.exact ? location.pathname === '/admin' : active;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-bold ${
                isActive 
                  ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-sky-600'
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-black bg-gradient-to-tr from-sky-400 to-indigo-500 text-white">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">{user?.email}</p>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <Link to="/" className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 hover:bg-white transition-all">
            {collapsed ? '↗' : 'View Site'}
          </Link>
          <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:bg-white transition-all">
            {collapsed ? '⏻' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 transition-all duration-500 sticky top-0 h-screen overflow-hidden border-r border-slate-200 ${
          collapsed ? 'w-24' : 'w-72'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-8 -right-3 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-xs z-10 transition-all hover:text-sky-500 hover:scale-110 shadow-sm"
        >
          {collapsed ? '›' : '‹'}
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden flex flex-col bg-white border-r border-slate-200"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl bg-slate-100 text-slate-600 transition-all active:scale-90">
            ☰
          </button>
          <span className="font-black text-slate-900 tracking-tighter">Blitz Admin</span>
          <div />
        </div>
        <div className="p-8 sm:p-12 lg:p-16">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;