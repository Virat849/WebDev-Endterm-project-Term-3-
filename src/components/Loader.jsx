// src/components/Loader.jsx

/**
 * Full-screen or inline centered loading spinner.
 * @param {boolean} fullScreen - if true, fills the viewport
 */
export default function Loader({ fullScreen = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-14 w-14 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full border-brand-600/30 border-t-brand-500 animate-spin`}
      />
      {size !== 'sm' && (
        <p className="text-slate-400 text-sm animate-pulse">Loading…</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface-900 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
}
