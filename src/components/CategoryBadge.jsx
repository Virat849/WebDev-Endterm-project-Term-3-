// src/components/CategoryBadge.jsx

const META = {
  event:        { label: 'Event',        icon: '🎉', cls: 'badge-event' },
  request:      { label: 'Request',      icon: '🙋', cls: 'badge-request' },
  offer:        { label: 'Offer',        icon: '🎁', cls: 'badge-offer' },
  announcement: { label: 'Announcement', icon: '📢', cls: 'badge-announcement' },
};

/**
 * Colored pill badge for a post category.
 * @param {string} category - 'event' | 'request' | 'offer' | 'announcement'
 */
export default function CategoryBadge({ category }) {
  const meta = META[category] || { label: category, icon: '📌', cls: 'badge-announcement' };
  return (
    <span className={meta.cls}>
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  );
}

export { META as CATEGORY_META };
