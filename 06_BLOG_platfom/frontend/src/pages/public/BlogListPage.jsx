import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogAPI } from '../../api/APIs.js';
import BlogCard from '../../components/blog/BlogCard.jsx';
import { BlogCardSkeleton } from '../../components/common/Skeleton.jsx';
import { useDebounce } from '../../hooks/index.js';
import { getCategoryColor } from '../../utils/helpers.js';

const CATEGORIES = ['All', 'Technology', 'Design', 'Business', 'Science', 'Health', 'Travel', 'Lifestyle'];
const SORTS = [
  { value: '-publishedAt', label: 'Latest' },
  { value: '-views', label: 'Most Viewed' },
  { value: '-createdAt', label: 'Newest' },
];

const BlogListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);

  const searchInput = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchInput);
  const debouncedSearch = useDebounce(localSearch, 400);

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || '-publishedAt';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentTag = searchParams.get('tag') || '';

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        sort: currentSort,
        ...(currentCategory && { category: currentCategory }),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(currentTag && { tag: currentTag }),
      };
      const res = await blogAPI.getAll(params);
      setBlogs(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentSort, currentCategory, debouncedSearch, currentTag]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  useEffect(() => {
    blogAPI.getCategories().then(res => setCategories(res.data.data)).catch(() => {});
  }, []);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const goToPage = (page) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', page);
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-5xl font-black tracking-tighter text-slate-900 md:text-6xl">
            {currentTag ? `#${currentTag}` : currentCategory || 'All Articles'}
          </h1>
          <p className="mt-4 text-xl font-medium text-slate-500">
            {pagination ? `${pagination.total} articles found` : 'Explore our curated collection of articles'}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="sticky top-[72px] z-40 border-y border-slate-200 bg-white/80 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <div className="w-full max-w-md md:flex-1">
              <input
                value={localSearch}
                onChange={e => { setLocalSearch(e.target.value); updateParam('search', e.target.value); }}
                placeholder="Search articles..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
              />
            </div>

            {/* Sort */}
            <select
              value={currentSort}
              onChange={e => updateParam('sort', e.target.value)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-700 outline-none transition-all hover:bg-white md:w-auto"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Category pills */}
          <div className="scrollbar-hide mt-6 flex gap-3 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => {
              const active = (cat === 'All' && !currentCategory) || currentCategory === cat;
              const color = getCategoryColor(cat.toLowerCase());
              return (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                  className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-sky-600 hover:ring-sky-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-7xl px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
            <div className="text-8xl">📭</div>
            <h3 className="mt-6 font-display text-2xl font-black text-slate-900">No articles found</h3>
            <p className="mt-2 text-slate-500">Try different keywords or remove filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-3">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:text-sky-600 hover:ring-sky-200 disabled:opacity-30 disabled:hover:ring-slate-200"
            >
              ← Prev
            </button>

            {[...Array(Math.min(pagination.pages, 7))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`h-12 w-12 rounded-2xl text-sm font-black transition-all ${
                    page === currentPage
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-sky-200 hover:text-sky-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:text-sky-600 hover:ring-sky-200 disabled:opacity-30 disabled:hover:ring-slate-200"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;