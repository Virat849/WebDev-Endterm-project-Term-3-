// src/pages/EditPost.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getPost, updatePost } from '../services/firestore';
import Loader from '../components/Loader';

const CATEGORIES = [
  { value: 'event',        label: '🎉 Event' },
  { value: 'request',      label: '🙋 Request' },
  { value: 'offer',        label: '🎁 Offer' },
  { value: 'announcement', label: '📢 Announcement' },
];

export default function EditPost() {
  const { id }          = useParams();
  const { currentUser } = useAuth();
  const navigate        = useNavigate();
  const titleRef        = useRef(null);

  const [form,     setForm]     = useState({ title: '', description: '', category: 'event', location: '', imageURL: '' });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [apiErr,   setApiErr]   = useState('');
  const [notAuth,  setNotAuth]  = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadPost() {
      try {
        const post = await getPost(id);
        if (cancelled) return;
        if (!post) { navigate('/home', { replace: true }); return; }
        if (post.authorId !== currentUser?.uid) { setNotAuth(true); setLoading(false); return; }
        setForm({
          title:       post.title       || '',
          description: post.description || '',
          category:    post.category    || 'event',
          location:    post.location    || '',
          imageURL:    post.imageURL    || '',
        });
        setLoading(false);
        setTimeout(() => titleRef.current?.focus(), 50);
      } catch (err) {
        if (!cancelled) { setApiErr(err.message); setLoading(false); }
      }
    }
    loadPost();
    return () => { cancelled = true; };
  }, [id, currentUser, navigate]);

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
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setApiErr('');
    try {
      await updatePost(id, {
        title:       form.title.trim(),
        description: form.description.trim(),
        category:    form.category,
        location:    form.location.trim(),
        imageURL:    form.imageURL.trim(),
      });
      navigate(`/post/${id}`);
    } catch (err) {
      setApiErr(err.message || 'Failed to save changes.');
      setSaving(false);
    }
  }

  if (loading) return <Loader fullScreen />;

  if (notAuth) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center card p-8">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-xl font-semibold text-slate-300 mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm mb-4">You can only edit your own posts.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-900">
      <div className="page-container max-w-2xl">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-2 text-sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        <div className="card p-6 sm:p-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-white mb-1">Edit Post</h1>
          <p className="text-slate-400 text-sm mb-8">Update your post details</p>

          {apiErr && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm mb-5">
              {apiErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="category" className="label">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="title" className="label">Title</label>
              <input
                id="title"
                ref={titleRef}
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength={120}
                className="input-field"
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                className="input-field resize-none"
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="location" className="label">
                Location <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="input-field"
              />
            </div>

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
                placeholder="https://…"
                className="input-field"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button
                id="edit-post-submit-btn"
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 justify-center"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving…
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
