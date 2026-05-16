import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDate, getCategoryColor } from '../../utils/helpers.js';
import { useBookmarks } from '../../hooks/index.js';

const ClockIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg width="14" height="14" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);

const BlogCard = ({ blog, index = 0, featured = false }) => {
  const { toggle, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(blog.slug);
  const catColor = getCategoryColor(blog.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`group relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/10 ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      {/* Cover image */}
      <Link to={`/blog/${blog.slug}`} className="block overflow-hidden">
        <div className={`overflow-hidden bg-slate-100 ${featured ? 'h-80' : 'h-56'}`}>
          {blog.coverImage?.url ? (
            <img
              src={blog.coverImage.url}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
            >
              <span className="text-5xl opacity-30">✍️</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-8">
        {/* Category + bookmark */}
        <div className="mb-5 flex items-center justify-between">
          <Link
            to={`/blogs?category=${blog.category}`}
            className="rounded-full bg-sky-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-sky-600 transition-colors hover:bg-sky-100"
          >
            {blog.category}
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); toggle(blog.slug); }}
            className={`rounded-xl p-2 transition-all duration-300 ${
              bookmarked 
                ? 'bg-rose-50 text-rose-500 shadow-sm shadow-rose-500/10' 
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
        </div>

        {/* Title */}
        <Link to={`/blog/${blog.slug}`}>
          <h2
            className={`font-display font-black leading-tight text-slate-900 transition-colors group-hover:text-sky-600 ${featured ? 'text-3xl' : 'text-xl'}`}
          >
            {blog.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="mt-4 line-clamp-2 text-sm font-medium leading-relaxed text-slate-500">
          {blog.excerpt}
        </p>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag) => (
              <Link key={tag} to={`/blogs?tag=${tag}`} className="rounded-lg bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-600 hover:ring-1 hover:ring-sky-200">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-[10px] font-black text-white shadow-lg shadow-sky-500/20">
              {blog.author?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {blog.author?.name || 'Author'}
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                {formatDate(blog.publishedAt || blog.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5 transition-colors hover:text-sky-500">
              <ClockIcon /> {blog.readTime || 1}m
            </span>
            <span className="flex items-center gap-1.5 transition-colors hover:text-sky-500">
              <EyeIcon /> {blog.views || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Featured badge */}
      {blog.featured && (
        <div className="absolute top-6 left-6 rounded-full bg-sky-500 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-sky-500/30">
          ★ Featured
        </div>
      )}
    </motion.article>
  );
};

export default BlogCard;