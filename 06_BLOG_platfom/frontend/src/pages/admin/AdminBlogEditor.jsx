import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogAPI } from '../../api/APIs.js';
import { useAuth } from '../../context/AuthContext.jsx';
import RichTextEditor from '../../components/admin/RichTextEditor.jsx';
import UploadBox from '../../components/admin/UploadBox.jsx';
import { slugify } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Design', 'Business', 'Science', 'Health', 'Travel', 'Food', 'Lifestyle', 'Education', 'Entertainment'];

const TabBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2.5 text-sm font-black tracking-tight rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-white text-sky-600 shadow-sm ring-1 ring-slate-200' 
        : 'text-slate-500 hover:text-sky-600 hover:bg-white/50'
    }`}
  >
    {children}
  </button>
);

const SectionLabel = ({ children }) => (
  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
    {children}
  </label>
);

const AdminBlogEditor = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    coverImage: { url: '', publicId: '' },
    video: { url: '', publicId: '', title: '' },
    pdf: { url: '', publicId: '', title: '', size: 0 },
    images: [],
    featured: false,
    published: false,
    status: 'draft',
    seo: { metaTitle: '', metaDescription: '', metaKeywords: '' },
  });

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await blogAPI.getById(id);
        const blog = res.data.data;
        setForm({
          title: blog.title || '',
          slug: blog.slug || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          category: blog.category || '',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
          coverImage: blog.coverImage || { url: '', publicId: '' },
          video: blog.video || { url: '', publicId: '', title: '' },
          pdf: blog.pdf || { url: '', publicId: '', title: '', size: 0 },
          images: blog.images || [],
          featured: blog.featured || false,
          published: blog.published || false,
          status: blog.status || 'draft',
          seo: {
            metaTitle: blog.seo?.metaTitle || '',
            metaDescription: blog.seo?.metaDescription || '',
            metaKeywords: Array.isArray(blog.seo?.metaKeywords)
              ? blog.seo.metaKeywords.join(', ')
              : blog.seo?.metaKeywords || '',
          },
        });
        setAutoSlug(false);
      } catch (err) {
        toast.error('Failed to load post for editing');
        navigate('/admin/blogs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, navigate]);

  const set = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleTitleChange = (e) => {
    const title = e.target.value;
    set('title', title);
    if (autoSlug) set('slug', slugify(title));
  };

  const handleSubmit = async (publish = false) => {
    if (!form.title) return toast.error('Title is required');
    if (!form.content) return toast.error('Content is required');
    if (!form.category) return toast.error('Category is required');

    setSaving(true);
    try {
      const payload = {
        ...form,
        published: publish,
        status: publish ? 'published' : 'draft',
        tags: typeof form.tags === 'string'
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : form.tags,
        author: { name: user?.name || 'Admin', id: user?.id },
        seo: {
          ...form.seo,
          metaKeywords: typeof form.seo.metaKeywords === 'string'
            ? form.seo.metaKeywords.split(',').map((k) => k.trim())
            : form.seo.metaKeywords,
        },
      };

      if (isEdit) {
        await blogAPI.update(id, payload);
        toast.success('Post updated!');
      } else {
        const res = await blogAPI.create(payload);
        toast.success(publish ? 'Post published! 🎉' : 'Draft saved!');
        navigate(`/admin/blogs/edit/${res.data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-16 w-full rounded-2xl bg-slate-100 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${form.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {form.status === 'published' ? 'Live on site' : 'Drafting Mode'}
            {form.featured && <span className="ml-2 px-2 py-0.5 bg-sky-100 text-sky-600 rounded text-[10px] uppercase font-black">★ Featured</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:text-sky-600 hover:ring-sky-200 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="rounded-2xl bg-sky-500 px-8 py-3 text-sm font-black text-white shadow-xl shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : isEdit ? 'Update Post' : 'Publish Now'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Main editor */}
        <div className="xl:col-span-2 space-y-8">
          {/* Title */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
            <SectionLabel>Title *</SectionLabel>
            <input
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Enter your article title..."
              className="w-full bg-transparent text-3xl font-black tracking-tighter text-slate-900 outline-none placeholder:text-slate-200"
            />
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-[1.25rem] ring-1 ring-slate-200/50 w-fit">
            {['content', 'media', 'seo'].map((tab) => (
              <TabBtn key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
                {tab === 'content' ? 'Content' : tab === 'media' ? 'Media' : 'SEO'}
              </TabBtn>
            ))}
          </div>

          {/* Content tab */}
          {activeTab === 'content' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 space-y-8">
              <div>
                <SectionLabel>Content *</SectionLabel>
                <RichTextEditor value={form.content} onChange={(v) => set('content', v)} />
              </div>
              <div>
                <SectionLabel>Excerpt (Short Description)</SectionLabel>
                <textarea
                  value={form.excerpt}
                  onChange={e => set('excerpt', e.target.value)}
                  placeholder="Write a short summary (auto-generated if left blank)..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
                  rows={3}
                  maxLength={500}
                />
                <p className={`text-[10px] mt-2 font-black text-right uppercase tracking-widest ${(form.excerpt?.length || 0) > 450 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {form.excerpt?.length || 0}/500
                </p>
              </div>
            </motion.div>
          )}
{/* =======================================================
   Media Tab
======================================================= */}
{activeTab === "media" && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 space-y-10"
  >
    {/* ===================================================
        COVER IMAGE
    =================================================== */}
    <UploadBox
      type="image"
      label="Cover Image"
      accept="image/*"
      current={form.coverImage}
      onUpload={(data) =>
        set(
          "coverImage",
          data
            ? {
                url: data.url,
                publicId: data.publicId,
                resourceType:
                  data.resourceType,
                originalName:
                  data.originalName,
              }
            : null
        )
      }
    />

    {/* ===================================================
        VIDEO
    =================================================== */}
    <div className="space-y-4">
      <SectionLabel>
        Video
      </SectionLabel>

      <input
        type="text"
        value={form.video?.title || ""}
        onChange={(e) =>
          set("video", {
            ...form.video,
            title: e.target.value,
          })
        }
        placeholder="Video title (optional)"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400"
      />

      <UploadBox
        type="video"
        label=""
        accept="video/mp4,video/webm,video/ogg"

        current={form.video}

        onUpload={(data) =>
          set(
            "video",
            data
              ? {
                  url: data.url,

                  publicId:
                    data.publicId,

                  resourceType:
                    data.resourceType,

                  originalName:
                    data.originalName,

                  bytes:
                    data.bytes,

                  format:
                    data.format,

                  title:
                    form.video?.title ||
                    "",
                }
              : null
          )
        }
      />
    </div>

    {/* ===================================================
        PDF
    =================================================== */}
    <div className="space-y-4">
      <SectionLabel>
        PDF Document
      </SectionLabel>

      <input
        type="text"
        value={form.pdf?.title || ""}
        onChange={(e) =>
          set("pdf", {
            ...form.pdf,
            title: e.target.value,
          })
        }
        placeholder="Document title (optional)"
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400"
      />

      <UploadBox
        type="pdf"
        label=""
        accept=".pdf"

        current={form.pdf}

        onUpload={(data) =>
          set(
            "pdf",
            data
              ? {
                  url: data.url,

                  publicId:
                    data.publicId,

                  resourceType:
                    data.resourceType,

                  originalName:
                    data.originalName,

                  bytes:
                    data.bytes,

                  format:
                    data.format,

                  title:
                    form.pdf?.title ||
                    "",
                }
              : null
          )
        }
      />
    </div>
  </motion.div>
)}
          {/* SEO tab */}
          {activeTab === 'seo' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 space-y-6">
              <div>
                <SectionLabel>Meta Title</SectionLabel>
                <input
                  value={form.seo.metaTitle}
                  onChange={e => set('seo', { ...form.seo, metaTitle: e.target.value })}
                  placeholder={form.title || 'SEO title...'}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white"
                  maxLength={60}
                />
                <p className={`text-[10px] mt-2 font-black text-right uppercase tracking-widest ${(form.seo?.metaTitle?.length || 0) > 55 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {form.seo?.metaTitle?.length || 0}/60 characters
                </p>
              </div>
              <div>
                <SectionLabel>Meta Description</SectionLabel>
                <textarea
                  value={form.seo.metaDescription}
                  onChange={e => set('seo', { ...form.seo, metaDescription: e.target.value })}
                  placeholder="Search engine description..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white"
                  rows={3}
                  maxLength={160}
                />
                <p className={`text-[10px] mt-2 font-black text-right uppercase tracking-widest ${(form.seo?.metaDescription?.length || 0) > 155 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {form.seo?.metaDescription?.length || 0}/160 characters
                </p>
              </div>
              <div>
                <SectionLabel>Meta Keywords (comma-separated)</SectionLabel>
                <input
                  value={form.seo.metaKeywords}
                  onChange={e => set('seo', { ...form.seo, metaKeywords: e.target.value })}
                  placeholder="react, javascript, web development..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white"
                />
              </div>

              {/* SEO Preview */}
              <div className="p-6 rounded-3xl bg-slate-50 ring-1 ring-slate-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Google Preview
                </p>
                <p className="text-lg font-bold text-sky-600 mb-1 truncate">
                  {form.seo.metaTitle || form.title || 'Page Title'}
                </p>
                <p className="text-xs text-emerald-600 font-medium mb-2">
                  yourdomain.com/blog/{form.slug || 'post-slug'}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {form.seo.metaDescription || form.excerpt || 'Meta description will appear here...'}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar settings */}
        <div className="space-y-8">
          {/* Publish settings */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 space-y-6">
          {/* Category & Tags */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
              Classification
            </h3>

            <div>
              <SectionLabel>Category *</SectionLabel>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer hover:bg-white transition-all"
              >
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <SectionLabel>Tags (comma-separated)</SectionLabel>
              <input
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="react, javascript, tutorial..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10"
              />
              {form.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {form.tags.split(',').filter(Boolean).map((t, i) => (
                    <span key={i} className="rounded-lg bg-sky-50 px-3 py-1 text-[10px] font-bold text-sky-600 ring-1 ring-sky-100">{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              URL Slug
            </h3>
            <div className="flex items-center gap-2">
              <input
                value={form.slug}
                onChange={e => { setAutoSlug(false); set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
                placeholder="post-url-slug"
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:bg-white"
              />
              <button
                onClick={() => { setAutoSlug(true); set('slug', slugify(form.title)); }}
                title="Auto-generate from title"
                className="p-3 rounded-2xl bg-slate-100 text-slate-400 hover:text-sky-600 transition-colors"
              >
                ↺
              </button>
            </div>
            <p className="text-[10px] font-bold text-slate-400 truncate px-2">
              /blog/{form.slug || 'post-url'}
            </p>
          </div>

          {/* Save actions */}
          <div className="space-y-2">
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="w-full rounded-2xl bg-sky-500 py-4 text-sm font-black text-white shadow-xl shadow-sky-500/20 transition-all hover:bg-sky-600 active:scale-95"
            >
              {saving ? 'Publishing...' : 'Publish Now'}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="w-full rounded-2xl bg-white py-4 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:text-sky-600 hover:ring-sky-200"
            >
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              onClick={() => navigate('/admin/blogs')}
              className="w-full py-3 text-xs font-black text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
            >
              Discard Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default AdminBlogEditor;