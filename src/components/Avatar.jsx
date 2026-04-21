// src/components/Avatar.jsx

/**
 * Generates a deterministic hue from a string so each user gets a unique color.
 */
function stringToHue(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

/**
 * Avatar component.
 * Shows a photoURL if available, otherwise renders initials with a unique background color.
 *
 * @param {string}  displayName
 * @param {string}  photoURL
 * @param {string}  size        - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string}  className
 */
export default function Avatar({ displayName = '', photoURL = '', size = 'md', className = '' }) {
  const sizeClasses = {
    sm:  'h-7 w-7 text-xs',
    md:  'h-9 w-9 text-sm',
    lg:  'h-12 w-12 text-base',
    xl:  'h-20 w-20 text-2xl',
  };

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const hue = stringToHue(displayName);
  const bg  = `hsl(${hue}, 60%, 32%)`;
  const fg  = `hsl(${hue}, 80%, 85%)`;

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={displayName}
        referrerPolicy="no-referrer"
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-surface-700 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold ring-2 ring-surface-700 flex-shrink-0 ${className}`}
      style={{ backgroundColor: bg, color: fg }}
      aria-label={displayName}
    >
      {initials}
    </div>
  );
}
