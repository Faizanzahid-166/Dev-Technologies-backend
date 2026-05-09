import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NotFoundPage = () => {
  const { user } = useAuth();
  const home = user ? (user.role === 'admin' ? '/admin' : '/employee') : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center animate-in">
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link to={home} className="btn-primary">
          ← Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
