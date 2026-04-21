// src/pages/PostDetail.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getPost, deletePost, toggleInterest } from '../services/firestore';
import CategoryBadge from '../components/CategoryBadge';
import Avatar from '../components/Avatar';
import CommentBox from '../components/CommentBox';
import Loader from '../components/Loader';

export default function PostDetail() {
  const { id }          = useParams();
  const { currentUser } = useAuth();
  const navigate        = useNavigate();

  const [post,      setPost]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [deleting,  setDeleting]  = useState(false);
  const [toggling,  setToggling]  = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchPost() {
      try {
        const data = await getPost(id);
        if (!cancelled) {
          setPost(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) { setError(err.message); setLoading(false); }
      }
    }
    fetchPost();
    return () => { cancelled = true; };
  }, [id]);

  const isAuthor   = currentUser?.uid === post?.authorId;
  const isInterested = post?.interestedUsers?.includes(currentUser?.uid) || false;

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deletePost(id);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }, [id, navigate]);

  const handleToggle = useCallback(async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await toggleInterest(id, currentUser.uid);
      // Re-fetch post to update interest count
      const updated = await getPost(id);
      setPost(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setToggling(false);
    }
  }, [id, currentUser, toggling]);

  const dateStr = post?.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Just now';

  if (loading) return <Loader fullScreen />;

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-semibold text-slate-300 mb-2">Post not found</h2>
        <Link to="/home" className="btn-primary mt-4">Back to Feed</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="page-container max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost mb-6 -ml-2 text-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm mb-5">
            {error}
          </div>
        )}

        <article className="card p-6 sm:p-8 animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <CategoryBadge category={post.category} />
            {isAuthor && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/edit/${id}`}
                  id="edit-post-btn"
                  className="btn-secondary text-sm py-1.5 px-3"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                  Edit
                </Link>
                <button
                  id="delete-post-btn"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-danger text-sm py-1.5 px-3"
                >
                  {deleting ? (
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                  ) : (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  )}
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-surface-700">
            <Link to={`/profile/${post.authorId}`} className="flex items-center gap-2 hover:text-slate-200 transition-colors">
              <Avatar displayName={post.authorName} photoURL={post.authorAvatar} size="sm" />
              <span className="font-medium">{post.authorName}</span>
            </Link>
            {post.location && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {post.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              {dateStr}
            </span>
          </div>

          {/* Body */}
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base mb-6">{post.description}</p>

          {/* Optional image */}
          {post.imageURL && (
            <img
              src={post.imageURL}
              alt={post.title}
              className="w-full rounded-xl object-cover max-h-96 mb-6"
            />
          )}

          {/* I'm In button */}
          {post.category === 'event' && (
            <div className="flex items-center gap-4 mt-2">
              <button
                id="interested-btn"
                onClick={handleToggle}
                disabled={toggling}
                className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl border transition-all duration-200 ${
                  isInterested
                    ? 'bg-brand-600/30 border-brand-500/50 text-brand-300 hover:bg-brand-600/20'
                    : 'bg-surface-700 border-surface-600 text-slate-300 hover:border-brand-500/50 hover:text-brand-300'
                }`}
              >
                <svg
                  className="h-4 w-4"
                  fill={isInterested ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                {toggling ? 'Updating…' : isInterested ? "I'm In!" : "I'm In"}
              </button>
              {post.interestedUsers?.length > 0 && (
                <span className="text-sm text-slate-400">
                  {post.interestedUsers.length} {post.interestedUsers.length === 1 ? 'person' : 'people'} interested
                </span>
              )}
            </div>
          )}
        </article>

        {/* Comments */}
        <div className="mt-6">
          <CommentBox postId={id} />
        </div>
      </div>
    </div>
  );
}
