// src/hooks/usePosts.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import { subscribeToPosts, deletePost, toggleInterest } from '../services/firestore';

/**
 * Hook that subscribes to all posts from Firestore.
 * Provides filtered + searched posts via useMemo.
 *
 * @param {string} filterCategory - 'all' or a category string
 * @param {string} searchQuery    - search term matched against title
 */
export function usePosts(filterCategory = 'all', searchQuery = '') {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (filterCategory && filterCategory !== 'all') {
      result = result.filter((p) => p.category === filterCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [posts, filterCategory, searchQuery]);

  const handleDelete = useCallback(async (postId) => {
    try {
      await deletePost(postId);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleToggleInterest = useCallback(async (postId, uid) => {
    try {
      return await toggleInterest(postId, uid);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return { posts: filteredPosts, allPosts: posts, loading, error, handleDelete, handleToggleInterest };
}
