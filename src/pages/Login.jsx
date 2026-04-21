// src/pages/Login.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GOOGLE_ICON = (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-300">
      <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      {message}
    </div>
  );
}

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const emailRef  = useRef(null);

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [googleL, setGoogleL] = useState(false);

  const from = location.state?.from?.pathname || '/home';

  // Auto-focus email input
  useEffect(() => { emailRef.current?.focus(); }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleL(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setGoogleL(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-900">
      {/* Gradient blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-brand-700/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-violet-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="glass-card p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src="/logo2.png" alt="LocalLoop" className="h-16 w-auto object-contain mb-3 mix-blend-screen" />
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your LocalLoop account</p>
          </div>

          <ErrorAlert message={error} />

          {/* Google */}
          <button
            id="google-login-btn"
            onClick={handleGoogle}
            disabled={googleL || loading}
            className="btn-secondary w-full justify-center mb-5 mt-4"
          >
            {GOOGLE_ICON}
            {googleL ? 'Signing in…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-surface-700" />
            <span className="text-xs text-slate-500 font-medium">or</span>
            <div className="flex-1 h-px bg-surface-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                ref={emailRef}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="input-field"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading || googleL}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            New to LocalLoop?{' '}
            <Link to="/signup" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function friendlyError(code) {
  const map = {
    'auth/invalid-credential':       'Invalid email or password.',
    'auth/user-not-found':           'No account found with this email.',
    'auth/wrong-password':           'Incorrect password.',
    'auth/too-many-requests':        'Too many attempts. Please try again later.',
    'auth/invalid-email':            'Please enter a valid email address.',
    'auth/user-disabled':            'This account has been disabled.',
    'auth/popup-closed-by-user':     'Sign-in popup was closed.',
    'auth/popup-blocked':            'Popup blocked — please allow popups for this site.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}
