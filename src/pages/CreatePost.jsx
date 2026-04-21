// src/pages/CreatePost.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createPost } from '../services/firestore';

const CATEGORIES = [
  { value: 'event',        label: '🎉 Event' },
  { value: 'request',      label: '🙋 Request' },
  { value: 'offer',        label: '🎁 Offer' },
  { value: 'announcement', label: '📢 Announcement' },
];

export default function CreatePost() {
  const { currentUser } = useAuth();
  const navigate        = useNavigate();
  const titleRef        = useRef(null);

  const [form,    setForm]    = useState({ title: '', description: '', category: 'event', location: '', imageURL: '' });
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [apiErr,  setApiErr]  = useState('');

  useEffect(() => { titleRef.current?.focus(); }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: '' }));
    setApiErr('');
  }

  function validate() {
    const errs = {};
    if (!form.title.trim())       errs.title       = 'Title is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.category)           errs.category    = 'Please select a category.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setApiErr('');
    try {
      const postId = await createPost({
        title:       form.title.trim(),
        description: form.description.trim(),
        category:    form.category,
        location:    form.location.trim(),
        imageURL:    form.imageURL.trim(),
        authorId:    currentUser.uid,
        authorName:  currentUser.displayName || currentUser.email,
        authorAvatar: currentUser.photoURL || '',
      });
      navigate(`/post/${postId}`);
    } catch (err) {
      setApiErr(err.message || 'Failed to create post. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="page-container max-w-2xl">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2 text-sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        <div className="card p-6 sm:p-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-white mb-1">Create New Post</h1>
          <p className="text-slate-400 text-sm mb-8">Share something with your neighborhood</p>

          {apiErr && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm mb-5">
              {apiErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Category */}
            <div>
              <label htmlFor="category" className="label">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="label">Title</label>
              <input
                id="title"
                ref={titleRef}
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Give your post a clear title…"
                maxLength={120}
                className="input-field"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide details about your post…"
                rows={5}
                className="input-field resize-none"
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="label">
                Location <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Central Park, Main St…"
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageURL" className="label">
                Image URL <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                id="imageURL"
                type="url"
                name="imageURL"
                value={form.imageURL}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="input-field"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button
                id="create-post-submit-btn"
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 justify-center"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Publishing…
                  </>
                ) : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
