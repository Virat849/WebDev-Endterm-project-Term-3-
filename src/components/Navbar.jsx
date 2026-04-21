// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Avatar from './Avatar';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef   = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/');
  }

  const isLanding = location.pathname === '/';

  return (
    <header className={`sticky top-0 z-50 ${isLanding ? 'bg-transparent' : 'bg-surface-900/80 backdrop-blur-lg border-b border-surface-700/50'}`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={currentUser ? '/home' : '/'} className="flex items-center group">
          <img
            src="/logo1.png"
            alt="LocalLoop"
            className="h-10 w-auto object-contain drop-shadow-lg group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <Link to="/home"         className="btn-ghost hidden sm:flex text-sm">Feed</Link>
              <Link to="/dashboard"    className="btn-ghost hidden sm:flex text-sm">Dashboard</Link>
              <Link to="/create"       className="btn-primary text-sm py-2 px-4">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Post
              </Link>

              {/* User menu */}
              <div className="relative" ref={menuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2 hover:bg-surface-800 p-1.5 rounded-xl transition-colors"
                >
                  <Avatar
                    displayName={currentUser.displayName || currentUser.email}
                    photoURL={currentUser.photoURL}
                    size="sm"
                  />
                  <svg
                    className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-52 card py-1 animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-surface-700">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {currentUser.displayName || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                      to={`/profile/${currentUser.uid}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-surface-700 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-surface-700 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                      Dashboard
                    </Link>
                    <div className="border-t border-surface-700 mt-1">
                      <button
                        id="logout-btn"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"  className="btn-ghost text-sm">Log In</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
