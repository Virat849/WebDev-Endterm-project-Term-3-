// src/components/PostCard.jsx
import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';
import Avatar from './Avatar';

/**
 * A compact card for displaying a post preview in the feed.
 */
export default function PostCard({ post }) {
  const {
    id, title, description, category, location,
    authorName, authorAvatar, createdAt, interestedUsers = [],
  } = post;

  const dateStr = createdAt?.toDate
    ? createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Just now';

  const excerpt = description?.length > 120 ? description.slice(0, 120) + '…' : description;

  return (
    <Link
      to={`/post/${id}`}
      className="card flex flex-col p-5 hover:border-brand-500/40 hover:-translate-y-1 hover:shadow-brand-900/30 transition-all duration-300 group cursor-pointer animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <CategoryBadge category={category} />
        <span className="text-xs text-slate-500 flex-shrink-0 mt-0.5">{dateStr}</span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-100 text-base leading-snug mb-2 group-hover:text-brand-300 transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed flex-1 line-clamp-3">
        {excerpt}
      </p>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-surface-700 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar displayName={authorName} photoURL={authorAvatar} size="sm" />
          <span className="text-xs text-slate-400 truncate">{authorName}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 flex-shrink-0">
          {location && (
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {location}
            </span>
          )}
          {interestedUsers.length > 0 && (
            <span className="flex items-center gap-1 text-brand-400">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              {interestedUsers.length}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
