import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { blogAPI } from '../../api/APIs.js';
import { formatDate } from '../../utils/helpers.js';
import { useDebounce } from '../../hooks/index.js';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const map = {
    published: { class: 'bg-emerald-50 text-emerald-600 ring-emerald-100', label: 'Published' },
    draft: { class: 'bg-amber-50 text-amber-600 ring-amber-100', label: 'Draft' },
    archived: { class: 'bg-slate-100 text-slate-600 ring-slate-200', label: 'Archived' },
  };
  const s = map[status] || map.draft;
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ring-1 ${s.class}`}>
      {s.label}
    </span>
  );
};

const ConfirmModal = ({ blog, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl ring-1 ring-slate-200"
      onClick={e => e.stopPropagation()}
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-rose-500/10">🗑️</div>
        <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-3">
          Delete Post?
        </h3>
        <p className="text-base font-medium text-slate-500 leading-relaxed px-2">
          "<span className="text-slate-900 font-bold">{blog?.title}</span>" will be permanently deleted along with all its comments.
        </p>
      </div>
      <div className="flex gap-4">
        <button onClick={onCancel} className="flex-1 rounded-2xl bg-slate-50 px-6 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 active:scale-95">Cancel</button>
        <button onClick={onConfirm} className="flex-1 rounded-2xl bg-rose-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-rose-500/20 transition-all hover:bg-rose-600 active:scale-95">Delete</button>
      </div>
    </motion.div>
  </motion.div>
);

const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected, setSelected] = useState([]);

  const debouncedSearch = useDebounce(search, 400);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogAPI.adminGetAll({
        page,
        limit: 10,
        ...(statusFilter && { status: statusFilter }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });
      setBlogs(Array.isArray(res.data?.data) ? res.data.data : []);
      setPagination(res.data?.pagination || null);
    } catch (e) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await blogAPI.delete(deleteTarget._id);
      toast.success('Post deleted');
      setBlogs(prev => prev.filter(b => b._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      const updated = await blogAPI.update(blog._id, {
        published: !blog.published,
        status: blog.published ? 'draft' : 'published',
      });
      setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, published: !b.published, status: blog.published ? 'draft' : 'published' } : b));
      toast.success(blog.published ? 'Post unpublished' : 'Post published');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleToggleFeatured = async (blog) => {
    try {
      await blogAPI.update(blog._id, { featured: !blog.featured });
      setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, featured: !b.featured } : b));
      toast.success(blog.featured ? 'Removed from featured' : 'Marked as featured');
    } catch {
      toast.error('Update failed');
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelected(prev => prev.length === blogs.length ? [] : blogs.map(b => b._id));
  };

  const STATUS_FILTERS = [
    { value: '', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Drafts' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Content Manager</h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
            {pagination ? `${pagination.total} posts total` : 'Manage your blog posts'}
          </p>
        </div>
        <Link to="/admin/blogs/create" className="rounded-2xl bg-sky-500 px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-95 flex items-center justify-center gap-2">
          <span className="text-lg">✚</span> New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] p-6 mb-10 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 flex flex-col lg:flex-row gap-4">
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Filter by title or tag..."
          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
        />
        <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl ring-1 ring-slate-200/60 overflow-x-auto scrollbar-hide">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`whitespace-nowrap px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === f.value ? 'bg-white text-sky-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-4 shadow-sm"
          >
            <span className="text-sm font-black text-sky-600">{selected.length} entries selected</span>
            <button
              onClick={async () => {
                for (const id of selected) await blogAPI.delete(id).catch(() => {});
                setBlogs(prev => prev.filter(b => !selected.includes(b._id)));
                setSelected([]);
                toast.success(`${selected.length} posts deleted`);
              }}
              className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
            >
              Delete Selected
            </button>
            <button onClick={() => setSelected([])} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-4 w-8">
                  <input
                    type="checkbox"
                    checked={selected.length === blogs.length && blogs.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content Entry</th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:table-cell">Channel</th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden md:table-cell">State</th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden lg:table-cell">Metrics</th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden xl:table-cell">Timeline</th>
                <th className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-10 py-6"><div className="h-6 w-full rounded-lg bg-slate-50 animate-pulse" /></td>
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="py-32 text-center bg-slate-50/20">
                      <div className="text-7xl mb-6">📝</div>
                      <p className="text-xl font-black text-slate-900 mb-2">No entries found</p>
                      <p className="text-sm font-medium text-slate-400 mb-8 uppercase tracking-widest">Adjust filters or create your first post</p>
                      <Link to="/admin/blogs/create" className="rounded-2xl bg-sky-500 px-10 py-4 text-sm font-black text-white shadow-xl shadow-sky-500/20 transition-all hover:bg-sky-600">Create Post Now</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className={`group transition-all ${loading ? 'opacity-50' : 'opacity-100 hover:bg-slate-50/50'}`}>
                    <td className="px-10 py-6">
                      <input
                        type="checkbox"
                        checked={selected.includes(blog._id)}
                        onChange={() => toggleSelect(blog._id)}
                        className="rounded border-slate-300 text-sky-500 focus:ring-sky-500/20 transition-all"
                      />
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 ring-1 ring-slate-200/50">
                          {blog.coverImage?.url ? (
                            <img src={blog.coverImage.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl grayscale">✍️</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate max-w-xs group-hover:text-sky-600 transition-colors">
                            {blog.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {blog.featured && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">★ Featured</span>
                            )}
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {blog.readTime || 1} min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-10 py-6">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                        {blog.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-10 py-6">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="hidden lg:table-cell px-10 py-6">
                      <span className="text-sm font-bold text-slate-600">
                        {(blog.views || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="hidden xl:table-cell px-10 py-6">
                      <span className="text-xs font-bold text-slate-400">
                        {formatDate(blog.createdAt)}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Featured toggle */}
                        <button
                          onClick={() => handleToggleFeatured(blog)}
                          title={blog.featured ? 'Remove featured' : 'Mark featured'}
                          className={`p-2 rounded-xl transition-all ${blog.featured ? 'text-sky-500 bg-sky-50' : 'text-slate-300 hover:text-sky-500 hover:bg-sky-50'}`}
                        >
                          ★
                        </button>

                        {/* Publish toggle */}
                        <button
                          onClick={() => handleTogglePublish(blog)}
                          title={blog.published ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-xl transition-all text-xs ${blog.published ? 'text-emerald-500 bg-emerald-50' : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'}`}
                        >
                          {blog.published ? '🌐' : '⭕'}
                        </button>

                        {/* View */}
                        {blog.published && (
                          <Link
                            to={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all"
                          >
                            ↗
                          </Link>
                        )}

                        {/* Edit */}
                        <Link
                          to={`/admin/blogs/edit/${blog._id}`}
                          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
                        >
                          Edit
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(blog)}
                          className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-10 py-8 border-t border-slate-100 bg-slate-50/20">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Page {page} of {pagination.pages} · {pagination.total} posts
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-5 py-2.5 rounded-xl text-sm font-black bg-white shadow-sm ring-1 ring-slate-200 text-slate-600 transition-all hover:text-sky-600 hover:ring-sky-200 disabled:opacity-30"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="px-5 py-2.5 rounded-xl text-sm font-black bg-white shadow-sm ring-1 ring-slate-200 text-slate-600 transition-all hover:text-sky-600 hover:ring-sky-200 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmModal
            blog={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBlogManager;