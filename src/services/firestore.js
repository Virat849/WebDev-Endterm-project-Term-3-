// src/services/firestore.js
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';

/* ─────────────────────────────── USER PROFILES ─────────────────────────── */

/**
 * Create or overwrite a user profile document.
 */
export async function createUserProfile(uid, data) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    displayName: data.displayName || '',
    email:       data.email || '',
    photoURL:    data.photoURL || '',
    createdAt:   serverTimestamp(),
  }, { merge: true });
}

/**
 * Fetch a single user profile.
 */
export async function getUserProfile(uid) {
  const ref  = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { uid, ...snap.data() } : null;
}

/* ──────────────────────────────────── POSTS ─────────────────────────────── */

/**
 * Subscribe to all posts ordered by newest first.
 * Returns an unsubscribe function.
 */
export function subscribeToPosts(callback) {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(posts);
  });
}

/**
 * Subscribe to posts by a specific author.
 */
export function subscribeToUserPosts(uid, callback) {
  const q = query(
    collection(db, 'posts'),
    where('authorId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(posts);
  });
}

/**
 * Fetch a single post by ID.
 */
export async function getPost(postId) {
  const ref  = doc(db, 'posts', postId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Create a new post document.
 */
export async function createPost(data) {
  const ref = await addDoc(collection(db, 'posts'), {
    ...data,
    interestedUsers: [],
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Update an existing post document.
 */
export async function updatePost(postId, data) {
  const ref = doc(db, 'posts', postId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/**
 * Delete a post and all its subcollection comments.
 */
export async function deletePost(postId) {
  // Delete comments first
  const commentsSnap = await getDocs(collection(db, 'posts', postId, 'comments'));
  const deletePromises = commentsSnap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletePromises);
  await deleteDoc(doc(db, 'posts', postId));
}

/**
 * Toggle "I'm In" interest on a post.
 */
export async function toggleInterest(postId, uid) {
  const postRef = doc(db, 'posts', postId);
  const snap    = await getDoc(postRef);
  if (!snap.exists()) return;

  const interested = snap.data().interestedUsers || [];
  const isIn       = interested.includes(uid);

  await updateDoc(postRef, {
    interestedUsers: isIn ? arrayRemove(uid) : arrayUnion(uid),
  });
  return !isIn;
}

/* ─────────────────────────────────── COMMENTS ───────────────────────────── */

/**
 * Subscribe to comments for a post, ordered oldest-first.
 */
export function subscribeToComments(postId, callback) {
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(comments);
  });
}

/**
 * Add a comment to a post.
 */
export async function addComment(postId, data) {
  await addDoc(collection(db, 'posts', postId, 'comments'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/**
 * Get total comment count across all posts by a user (for dashboard stats).
 */
export async function getUserCommentStats(uid) {
  // Get all posts by user first, then count comments on each
  const q    = query(collection(db, 'posts'), where('authorId', '==', uid));
  const snap = await getDocs(q);

  let totalComments = 0;
  await Promise.all(
    snap.docs.map(async (d) => {
      const commentsSnap = await getDocs(collection(db, 'posts', d.id, 'comments'));
      totalComments += commentsSnap.size;
    })
  );

  return { totalPosts: snap.size, totalComments };
}

/**
 * Get posts where a user has clicked "I'm In".
 */
export async function getJoinedPosts(uid) {
  const q    = query(collection(db, 'posts'), where('interestedUsers', 'array-contains', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
