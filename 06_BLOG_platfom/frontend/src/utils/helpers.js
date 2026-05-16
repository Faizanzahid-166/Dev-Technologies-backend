import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatViews = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

export const truncate = (str, len = 120) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const getInitials = (name) =>
  name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

export const getCategoryColor = (category) => {
  const colors = {
    technology: '#3b82f6',
    design: '#8b5cf6',
    business: '#10b981',
    science: '#06b6d4',
    health: '#ef4444',
    travel: '#f59e0b',
    food: '#f97316',
    lifestyle: '#ec4899',
    default: '#d4a853',
  };
  return colors[category?.toLowerCase()] || colors.default;
};

export const sharePost = async (title, slug) => {
  const url = `${window.location.origin}/blog/${slug}`;
  if (navigator.share) {
    await navigator.share({ title, url });
  } else {
    navigator.clipboard.writeText(url);
  }
};