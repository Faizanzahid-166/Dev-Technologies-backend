import { X } from 'lucide-react';
import { useEffect } from 'react';

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={`${sizes[size]} ${className} animate-spin rounded-full border-2 border-ink-700 border-t-amber-500`} />
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    pending: 'badge-pending',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
  };
  const labels = { pending: '● Pending', 'in-progress': '◆ In Progress', completed: '✓ Completed' };
  return <span className={map[status] || 'tag'}>{labels[status] || status}</span>;
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
export const PriorityBadge = ({ priority }) => {
  const map = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
  const labels = { low: 'Low', medium: 'Medium', high: '↑ High' };
  return <span className={map[priority] || 'tag'}>{labels[priority] || priority}</span>;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`rounded-lg bg-ink-800 shimmer ${className}`} />
);

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`relative glass rounded-2xl w-full ${sizes[size]} animate-scale-in overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-800">
          <h2 className="section-title">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div className="mb-4 p-4 rounded-2xl bg-ink-800/50 text-ink-500">
        <Icon size={32} strokeWidth={1.5} />
      </div>
    )}
    <p className="section-title mb-1">{title}</p>
    {description && <p className="text-sm text-ink-500 mb-6 max-w-xs">{description}</p>}
    {action}
  </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ value, max = 100, label }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-ink-400">{label}</span>
          <span className="text-xs font-mono text-amber-400">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ src, name, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-2xl object-cover border border-ink-700`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-display font-700 text-ink-950`}>
      {initials}
    </div>
  );
};