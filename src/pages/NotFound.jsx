// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function NotFound() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-violet-700/10 blur-3xl" />
      </div>

      <div className="relative text-center animate-fade-in">
        <div className="relative inline-block">
          <p className="text-[10rem] font-black text-surface-800 leading-none select-none">404</p>
          <p className="absolute inset-0 flex items-center justify-center text-7xl">🏚️</p>
        </div>
        <h1 className="text-3xl font-bold text-white mt-4 mb-3">Page Not Found</h1>
        <p className="text-slate-400 max-w-md mx-auto mb-8 text-base leading-relaxed">
          Looks like this neighborhood doesn't exist. The page you're looking for may have been
          moved, deleted, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={currentUser ? '/home' : '/'}
            id="not-found-home-btn"
            className="btn-primary"
          >
            {currentUser ? 'Back to Feed' : 'Go Home'}
          </Link>
          {currentUser && (
            <Link to="/create" className="btn-secondary">
              Create a Post
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
