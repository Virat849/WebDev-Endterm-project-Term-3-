// src/components/CommentBox.jsx
import { useState, useRef, useCallback } from 'react';
import { useComments } from '../hooks/useComments';
import { useAuth } from '../hooks/useAuth';
import Avatar from './Avatar';
import Loader from './Loader';

function formatDate(ts) {
  if (!ts?.toDate) return '';
  return ts.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CommentBox({ postId }) {
  const { comments, loading, submitComment } = useComments(postId);
  const { currentUser } = useAuth();
  const [text,        setText]        = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const inputRef = useRef(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!text.trim()) return;
      setSubmitting(true);
      setError('');
      try {
        await submitComment({
          text,
          authorId:   currentUser.uid,
          authorName: currentUser.displayName || currentUser.email,
        });
        setText('');
        inputRef.current?.focus();
      } catch {
        setError('Failed to post comment. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [text, submitComment, currentUser]
  );

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-slate-100 mb-5 flex items-center gap-2">
        <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3 items-start">
          <Avatar
            displayName={currentUser?.displayName || currentUser?.email}
            photoURL={currentUser?.photoURL}
            size="md"
          />
          <div className="flex-1">
            <textarea
              ref={inputRef}
              id="comment-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment…"
              rows={2}
              className="input-field resize-none"
              disabled={submitting}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            <div className="flex justify-end mt-2">
              <button
                id="comment-submit-btn"
                type="submit"
                disabled={!text.trim() || submitting}
                className="btn-primary text-sm py-2"
              >
                {submitting ? 'Posting…' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <Loader size="sm" />
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-2xl mb-2">💬</p>
          <p className="text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 animate-fade-in">
              <Avatar displayName={comment.authorName} size="sm" />
              <div className="flex-1 bg-surface-800/60 rounded-xl px-4 py-3 border border-surface-700/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-200">{comment.authorName}</span>
                  <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
