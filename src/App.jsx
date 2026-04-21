// src/App.jsx
import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';

// Lazy-load page components for code splitting
const Landing    = lazy(() => import('./pages/Landing'));
const Login      = lazy(() => import('./pages/Login'));
const Signup     = lazy(() => import('./pages/Signup'));
const Feed       = lazy(() => import('./pages/Feed'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const EditPost   = lazy(() => import('./pages/EditPost'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Profile    = lazy(() => import('./pages/Profile'));
const NotFound   = lazy(() => import('./pages/NotFound'));

// Pages that render their own full-screen layout (hide shared Navbar on login/signup)
const HIDE_NAVBAR_ROUTES = ['/login', '/signup'];

export default function App() {
  const location = useLocation();
  const showNavbar = !HIDE_NAVBAR_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen bg-surface-900">
      {showNavbar && <Navbar />}

      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="/"       element={<Landing />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/home" element={
            <ProtectedRoute><Feed /></ProtectedRoute>
          } />
          <Route path="/post/:id" element={
            <ProtectedRoute><PostDetail /></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute><CreatePost /></ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute><EditPost /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/profile/:uid" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}
