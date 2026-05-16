import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/blogs?search=${encodeURIComponent(query)}`);

    setSearchOpen(false);
    setSearchQuery('');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/blogs', label: 'Articles' },
    { to: '/blogs?category=technology', label: 'Tech' },
    { to: '/blogs?category=design', label: 'Design' },
  ];

  const isActiveLink = (to) => {
    return location.pathname + location.search === to;
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-sky-100 bg-white/80 py-3 shadow-lg shadow-sky-500/5 backdrop-blur-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-8 lg:px-16">
        <div className="flex h-12 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-rose-400 text-2xl font-black text-white shadow-xl shadow-sky-500/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
              B
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 transition-colors duration-300 group-hover:text-sky-600">
              Blitz.
              <span className="text-sky-500 transition-colors duration-300 group-hover:text-sky-600">
                 Asia News
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center rounded-3xl bg-slate-100/50 p-1.5 ring-1 ring-slate-200/50 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-2xl px-6 py-2.5 text-sm font-bold tracking-tight transition-all duration-300 ${
                  isActiveLink(link.to)
                    ? 'bg-white text-sky-600 shadow-sm shadow-sky-500/10 ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-sky-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="rounded-2xl bg-white p-3 text-slate-500 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:scale-110 hover:text-sky-600 hover:ring-sky-200"
            >
              <SearchIcon />
            </button>

            {/* Auth */}
            {user ? (
              <div className="ml-2 flex items-center gap-4">
                <Link
                  to="/admin"
                  className="hidden text-sm font-bold text-slate-700 transition-colors hover:text-sky-600 sm:block"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="rounded-2xl bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-600 active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="hidden rounded-2xl bg-slate-900 px-8 py-3 text-sm font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 sm:block"
              >
                Admin Login
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              aria-label="Toggle Menu"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-2xl bg-slate-100 p-3 text-slate-900 md:hidden"
            >
              <div className="flex w-6 flex-col gap-1.5">
                <span
                  className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                    menuOpen ? 'translate-y-2 rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                    menuOpen ? '-translate-y-2 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="border-t border-sky-100 bg-white/90 px-8 py-10 shadow-2xl backdrop-blur-2xl"
          >
            <form
              onSubmit={handleSearch}
              className="mx-auto flex max-w-2xl gap-3"
            >
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you curious about today?"
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-lg font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
              />
              <button
                type="submit"
                className="rounded-2xl bg-sky-500 px-10 py-4 text-lg font-black text-white shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-600"
              >
                Search
              </button>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;