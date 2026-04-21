// src/pages/Feed.jsx
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

const FILTERS = [
  { value: 'all',          label: 'All',          icon: '✦' },
  { value: 'event',        label: 'Events',       icon: '🎉' },
  { value: 'request',      label: 'Requests',     icon: '🙋' },
  { value: 'offer',        label: 'Offers',       icon: '🎁' },
  { value: 'announcement', label: 'Announcements', icon: '📢' },
];

export default function Feed() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery,  setSearchQuery]  = useState('');

  const { posts, loading, error } = usePosts(activeFilter, searchQuery);

  const handleFilterChange = useCallback((value) => {
    setActiveFilter(value);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-surface-900">
      {/* Page header */}
      <div className="bg-surface-800/50 border-b border-surface-700/50">
        <div className="page-container py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Community Feed</h1>
              <p className="text-slate-400 text-sm mt-0.5">See what's happening in your neighborhood</p>
            </div>
            <Link to="/create" className="btn-primary self-start sm:self-auto">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* Filter + Search bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-16 z-30 pt-4 pb-3 bg-surface-900/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                id={`filter-${f.value}`}
                onClick={() => handleFilterChange(f.value)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all duration-200 ${
                  activeFilter === f.value
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                    : 'bg-surface-800 text-slate-400 hover:text-slate-200 hover:bg-surface-700 border border-surface-700'
                }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.804 16.804z" />
            </svg>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search posts…"
              className="input-field pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24 animate-fade-in">
            <div className="text-6xl mb-4">🏘️</div>
            <h2 className="text-xl font-semibold text-slate-300 mb-2">
              {searchQuery || activeFilter !== 'all' ? 'No posts match your search' : 'No posts yet — be the first!'}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {searchQuery || activeFilter !== 'all'
                ? 'Try adjusting your filters or search term.'
                : 'Start the conversation in your neighborhood.'}
            </p>
            {!searchQuery && (
              <Link to="/create" className="btn-primary">
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          /* Posts grid */
          <>
            <p className="text-xs text-slate-500 mb-5">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating "+" button (mobile) */}
      <Link
        to="/create"
        id="fab-create-post"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-2xl shadow-brand-700/50 transition-all hover:-translate-y-1 animate-pulse-glow sm:hidden z-40"
        aria-label="Create new post"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Link>
    </div>
  );
}
