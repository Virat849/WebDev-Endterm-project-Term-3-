// src/hooks/useComments.js
import { useState, useEffect, useCallback } from 'react';
import { subscribeToComments, addComment } from '../services/firestore';

/**
 * Hook that subscribes to comments for a given post.
 *
 * @param {string} postId - Firestore post ID
 */
export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    const unsubscribe = subscribeToComments(postId, (data) => {
      setComments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [postId]);

  const submitComment = useCallback(
    async ({ text, authorId, authorName }) => {
      if (!text.trim()) return;
      try {
        await addComment(postId, { text: text.trim(), authorId, authorName });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [postId]
  );

  return { comments, loading, error, submitComment };
}
