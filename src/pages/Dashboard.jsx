// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  subscribeToUserPosts,
  getJoinedPosts,
  getUserCommentStats,
  deletePost,
} from '../services/firestore';
import CategoryBadge from '../components/CategoryBadge';
import Avatar from '../components/Avatar';
import Loader from '../components/Loader';

const TABS = [
  { id: 'posts',  label: 'My Posts',      icon: '📝' },
  { id: 'joined', label: 'Joined Events', icon: '🎉' },
];

function StatCard({ value, label, icon }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-slate-400 text-sm">{label}</p>
      </div>
    </div>
  );
}

function PostRow({ post, onDelete }) {
  const navigate  = useNavigate();
  const [del, setDel] = useState(false);

  const dateStr = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Just now';

  async function handleDelete(e) {
    e.stopPropagation();
    if (!window.confirm('Delete this post?')) return;
    setDel(true);
    await onDelete(post.id);
  }

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      className="card p-4 flex items-center gap-4 cursor-pointer hover:border-brand-500/30 hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <CategoryBadge category={post.category} />
          <span className="text-xs text-slate-500">{dateStr}</span>
        </div>
        <p className="text-slate-100 font-medium truncate group-hover:text-brand-300 transition-colors">{post.title}</p>
        {post.location && (
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {post.location}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <Link
          to={`/edit/${post.id}`}
          className="btn-secondary text-xs py-1.5 px-3"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={del}
          className="btn-danger text-xs py-1.5 px-3"
        >
          {del ? '…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [activeTab,    setActiveTab]    = useState('posts');
  const [myPosts,      setMyPosts]      = useState([]);
  const [joinedPosts,  setJoinedPosts]  = useState([]);
  const [stats,        setStats]        = useState({ totalPosts: 0, totalComments: 0 });
  const [loading,      setLoading]      = useState(true);
  const [joinedLoad,   setJoinedLoad]   = useState(false);
  const [joinedFetched, setJoinedFetched] = useState(false);

  // Subscribe to own posts
  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeToUserPosts(currentUser.uid, (posts) => {
      setMyPosts(posts);
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  // Fetch stats
  useEffect(() => {
    if (!currentUser) return;
    getUserCommentStats(currentUser.uid).then(setStats).catch(console.error);
  }, [currentUser, myPosts.length]);

  // Fetch joined events (lazy — only when tab selected)
  useEffect(() => {
    if (activeTab !== 'joined' || joinedFetched) return;
    setJoinedLoad(true);
    getJoinedPosts(currentUser.uid)
      .then((posts) => { setJoinedPosts(posts); setJoinedFetched(true); })
      .catch(console.error)
      .finally(() => setJoinedLoad(false));
  }, [activeTab, currentUser, joinedFetched]);

  const handleDelete = useCallback(async (postId) => {
    await deletePost(postId);
    setJoinedFetched(false); // refresh joined tab next time
  }, []);

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar
            displayName={currentUser?.displayName || currentUser?.email}
            photoURL={currentUser?.photoURL}
            size="lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              {currentUser?.displayName || 'My Dashboard'}
            </h1>
            <p className="text-slate-400 text-sm">{currentUser?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-8">
          <StatCard value={stats.totalPosts}    label="Total Posts"     icon="📝" />
          <StatCard value={stats.totalComments} label="Comments Received" icon="💬" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-800 rounded-xl p-1 mb-6 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'posts' && (
          loading ? <Loader /> : myPosts.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-5xl mb-3">📭</p>
              <h2 className="text-lg font-semibold text-slate-300 mb-2">No posts yet</h2>
              <p className="text-slate-500 text-sm mb-5">Share something with your community!</p>
              <Link to="/create" className="btn-primary">Create First Post</Link>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              {myPosts.map((post) => (
                <PostRow key={post.id} post={post} onDelete={handleDelete} />
              ))}
            </div>
          )
        )}

        {activeTab === 'joined' && (
          joinedLoad ? <Loader /> : joinedPosts.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-5xl mb-3">🙅</p>
              <h2 className="text-lg font-semibold text-slate-300 mb-2">No joined events</h2>
              <p className="text-slate-500 text-sm mb-5">Browse events and tap "I'm In"!</p>
              <Link to="/home" className="btn-primary">Browse Feed</Link>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              {joinedPosts.map((post) => (
                <PostRow key={post.id} post={post} onDelete={handleDelete} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
