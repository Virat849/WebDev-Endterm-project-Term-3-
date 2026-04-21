// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, subscribeToUserPosts } from '../services/firestore';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

export default function Profile() {
  const { uid }         = useParams();
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const isOwnProfile = currentUser?.uid === uid;

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const data = await getUserProfile(uid);
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [uid]);

  useEffect(() => {
    const unsub = subscribeToUserPosts(uid, (data) => {
      setPosts(data);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  const joinDate = profile?.createdAt?.toDate
    ? profile.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  if (loading && !profile) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="page-container">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm mb-5">
            {error}
          </div>
        )}

        {/* Profile header */}
        <div className="card p-6 sm:p-8 mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar
              displayName={profile?.displayName || currentUser?.displayName || 'User'}
              photoURL={profile?.photoURL}
              size="xl"
            />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {profile?.displayName || currentUser?.displayName || 'Community Member'}
              </h1>
              <p className="text-slate-400 text-sm">{profile?.email || currentUser?.email}</p>
              {joinDate && (
                <p className="text-slate-500 text-xs mt-2 flex items-center justify-center sm:justify-start gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
                  </svg>
                  Member since {joinDate}
                </p>
              )}
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{posts.length}</p>
                  <p className="text-xs text-slate-400">Posts</p>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <Link to="/dashboard" className="btn-secondary text-sm flex-shrink-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Posts grid */}
        <h2 className="text-lg font-semibold text-slate-200 mb-4">
          {isOwnProfile ? 'My Posts' : 'Posts'}
        </h2>

        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-5xl mb-3">📭</p>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No posts yet</h3>
            {isOwnProfile && (
              <Link to="/create" className="btn-primary mt-3">Create First Post</Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
