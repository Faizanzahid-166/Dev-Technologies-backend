import { Link } from 'react-router';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-10 shadow-lg">
        <p className="text-6xl font-extrabold text-amber-400 mb-2">404</p>
        <h1 className="text-2xl font-semibold text-slate-50 mb-3">Page not found</h1>
        <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-lg font-medium transition">
          <Home size={16} /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}