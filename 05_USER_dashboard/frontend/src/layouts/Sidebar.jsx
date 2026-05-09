import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSliceTunk/authSlice.js';
import { Avatar } from '../components/UI.jsx';
import {
  LayoutDashboard, User, GitBranch, LogOut, Zap, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/dependencies', icon: GitBranch, label: 'Dependencies' },
];

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Signed out');
    navigate('/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`flex flex-col min-h-screen justify-between ${mobile ? '' : ''}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 mb-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
          <Zap size={18} className="text-slate-900" fill="currentColor" />
        </div>
        <span className="font-display font-semibold text-lg text-slate-50 tracking-tight">Nexus</span>
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto btn-ghost p-1.5">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-300 hover:text-slate-50 hover:bg-slate-800/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-3 border-t border-slate-700/60 bg-gradient-to-b from-transparent to-slate-900/20">
        <div className="flex items-center gap-3 px-2 py-1 rounded-xl mb-2">
          <Avatar src={user?.profileImage} name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-100 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-300 hover:text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
    
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 h-screen border-r border-ink-800/60 glass">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full glass border-r border-ink-800/60 animate-slide-in-right">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-ink-800/60 shrink-0">
          <button onClick={() => setMobileOpen(true)} className="btn-ghost p-2">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap size={14} className="text-ink-950" fill="currentColor" />
            </div>
            <span className="font-display font-700 text-lg text-ink-50">Nexus</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}