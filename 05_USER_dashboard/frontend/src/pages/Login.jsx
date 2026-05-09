import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/authSliceTunk/authSlice.js';
import { Spinner } from '../components/UI.jsx';
import { Eye, EyeOff, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    dispatch(clearError());
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-6">
      <div className="w-full max-w-md animate-slide-up">
        <header className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shadow-md">
            <Zap size={20} className="text-slate-900" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-50 tracking-tight">Nexus</h1>
        </header>

        <main className="bg-slate-800/60 border border-slate-700/40 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-50 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-6">Sign in to your account to continue</p>

          {error && (
            <div role="alert" aria-live="assertive" className="mb-6 px-4 py-3 rounded-lg bg-red-900/30 border border-red-800/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-slate-700/50 text-slate-50 placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  className="w-full bg-slate-700/50 text-slate-50 placeholder-slate-400 px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 pr-10 transition"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-pressed={showPass}
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-100 p-1 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="sr-only">{showPass ? 'Hide password' : 'Show password'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
            >
              {loading ? (<><Spinner size="sm" /> <span>Signing in...</span></>) : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}
