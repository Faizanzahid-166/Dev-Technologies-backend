// Blog Detail Page - Displays full blog content, author info, comments, and related posts
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogAPI, commentAPI, uploadAPI  } from '../../api/APIs.js';
import { BlogDetailSkeleton } from '../../components/common/Skeleton.jsx';
import BlogCard from '../../components/blog/BlogCard.jsx';
import { useReadingProgress, useBookmarks } from '../../hooks/index.js';
import { formatDate, formatRelativeDate, sharePost, stripHtml } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const progress = useReadingProgress();
  const { toggle, isBookmarked } = useBookmarks();

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [commentLoading, setCommentLoading] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await blogAPI.getBySlug(slug);
        console.log(res.data);
        setBlog(res.data.data);
        setRelated(res.data.related);
        setLikeCount(res.data.data.likes?.length || 0);
        // console.log(blog?.pdf?.url, "PDF URL");

        // Load comments
        const cRes = await commentAPI.getByBlog(res.data.data._id);
        setComments(cRes.data.data);
      } catch (e) {
        if (e.response?.status === 404) navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);
    setLikeCount(p => p + 1);
    try {
      await blogAPI.like(blog._id, { visitorId: Date.now() });
    } catch {}
  };

  const handleShare = async () => {
    await sharePost(blog.title, blog.slug);
    toast.success('Link copied to clipboard!');
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    try {
      const res = await commentAPI.add(blog._id, commentForm);
      setComments(prev => [res.data.data, ...prev]);
      setCommentForm({ name: '', email: '', content: '' });
      toast.success('Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) return <BlogDetailSkeleton />;
  if (!blog) return null;

  const bookmarked = isBookmarked(blog.slug);

  return (
    <>
      {/* Reading progress */}
      <div className="fixed top-0 left-0 h-1.5 bg-sky-500 z-[60] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />

      <article className="min-h-screen bg-slate-50 pt-24 pb-20">
        {/* Hero */}
        <div className="relative h-[520px] overflow-hidden bg-slate-900">
          {blog.coverImage?.url ? (
            <img src={blog.coverImage.url} alt={blog.title} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-8 lg:px-0 -mt-48">
          {/* Meta header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link to={`/blogs?category=${blog.category}`} className="rounded-full bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-sky-600 shadow-xl ring-1 ring-slate-100 transition-all hover:bg-sky-50">
                {blog.category}
              </Link>
              {blog.featured && <span className="rounded-full bg-sky-500 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">★ Featured</span>}
              {blog.tags?.map(t => (
                <Link key={t} to={`/blogs?tag=${t}`} className="rounded-full bg-white/80 backdrop-blur-md px-5 py-2 text-[10px] font-bold text-slate-500 shadow-sm ring-1 ring-slate-100 hover:text-sky-600 transition-colors">#{t}</Link>
              ))}
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-slate-900 leading-[1.1] mb-10">
              {blog.title}
            </h1>

            {/* Author + stats */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-10 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-sky-500/20">
                  {blog.author?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">{blog.author?.name}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {formatDate(blog.publishedAt)} <span className="mx-2 text-slate-200">|</span> {blog.readTime} min read <span className="mx-2 text-slate-200">|</span> {blog.views} views
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all hover:scale-105 active:scale-95 ${
                    liked ? 'bg-rose-50 text-rose-500 ring-1 ring-rose-100 shadow-lg shadow-rose-500/10' : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:ring-rose-200 hover:text-rose-500'
                  }`}
                >
                  ♥ {likeCount}
                </button>
                <button onClick={() => toggle(blog.slug)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all hover:scale-105 active:scale-95 ${
                    bookmarked ? 'bg-sky-50 text-sky-600 ring-1 ring-sky-100 shadow-lg shadow-sky-500/10' : 'bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:ring-sky-200 hover:text-sky-600'
                  }`}
                >
                  {bookmarked ? '🔖 Saved' : '📌 Save'}
                </button>
                <button onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-600 text-sm font-black shadow-sm ring-1 ring-slate-200 transition-all hover:scale-105 active:scale-95 hover:bg-slate-50"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-2xl md:text-3xl leading-relaxed mb-12 font-medium italic text-slate-500 border-l-4 border-sky-500 pl-10 py-2">
                {blog.excerpt}
              </p>
            )}

            {/* Main content */}
            <div
              className="prose prose-slate prose-lg md:prose-xl max-w-none mb-20 prose-headings:font-black prose-headings:tracking-tighter prose-a:text-sky-600 prose-img:rounded-[2.5rem] prose-blockquote:border-sky-500 prose-blockquote:bg-sky-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Video */}
            {blog.video?.url && (
              <div className="mb-20 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 overflow-hidden">
                <div className="px-8 py-5 flex items-center gap-3 bg-slate-50 border-b border-slate-100">
                  <span className="text-sky-500 font-bold">▶</span>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    {blog.video.title || 'Video'}
                  </span>
                </div>
                <video controls className="w-full max-h-[600px] bg-black">
                  <source src={blog.video.url} type="video/mp4" />
                </video>
              </div>
            )}

            {/* Image gallery */}
            {blog.images?.length > 0 && (
              <div className="mb-20">
                <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-8">Visual Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blog.images.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-slate-200 ring-1 ring-slate-100 group">
                      <img src={img.url} alt={img.caption || `Image ${i+1}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                      {img.caption && <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-6 py-4">{img.caption}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

       {/* PDF */}
{blog.pdf?.url && (
  <div className="mb-20 rounded-[2.5rem] bg-white p-10 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">

    {/* Header */}
    <div className="flex items-center justify-between flex-wrap gap-8">

      {/* Left */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-3xl shadow-inner">
          📄
        </div>

        <div>
          <p className="text-xl font-black text-slate-900">
            {blog.pdf.title || "Document"}
          </p>

          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            PDF ·{" "}
            {blog.pdf.size
              ? `${(
                  blog.pdf.size / 1024
                ).toFixed(1)} KB`
              : "Available"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">

        {/* Preview */}
        <button
          onClick={() =>
            setPdfOpen(!pdfOpen)
          }
          className="rounded-2xl bg-slate-50 px-8 py-4 text-sm font-black text-slate-600 transition-all hover:bg-slate-100"
        >
          {pdfOpen
            ? "Hide Preview"
            : "Preview"}
        </button>

        {/* Open */}
        <a
          href={blog.pdf.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-sky-50 px-8 py-4 text-sm font-black text-sky-600 transition-all hover:bg-sky-100"
        >
          Open
        </a>

        {/* Download */}
        <a
          href={blog.pdf.url}
          download
          className="rounded-2xl bg-rose-50 px-8 py-4 text-sm font-black text-rose-500 transition-all hover:bg-rose-100"
        >
          Download
        </a>

      </div>
    </div>

    {/* Preview Frame */}
    {pdfOpen && (
      <div
        className="mt-8 rounded-3xl overflow-hidden bg-slate-100"
        style={{
          height: "700px",
        }}
      >
        <iframe
  src={uploadAPI.getInlinePDF(blog.pdf.url)}
  className="w-full h-full border-0"
  title="PDF Preview"
/>
      </div>
    )}
  </div>
)}

            {/* Social share */}
            <div className="mb-20 p-10 rounded-[2.5rem] bg-white text-center shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Found this helpful? Spread the word</p>
              <div className="flex flex-wrap justify-center gap-4">
                {['Twitter', 'LinkedIn', 'Facebook', 'Copy Link'].map((platform) => (
                  <button key={platform} onClick={handleShare}
                    className="px-8 py-4 rounded-2xl bg-slate-50 text-slate-600 text-sm font-black shadow-sm ring-1 ring-slate-200 transition-all hover:scale-105 active:scale-95 hover:bg-white hover:text-sky-600 hover:ring-sky-200"
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Author bio */}
            <div className="mb-20 p-10 rounded-[2.5rem] bg-white flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-sky-400 via-indigo-500 to-rose-400 flex-shrink-0 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-sky-500/20">
                {blog.author?.name?.[0]}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 mb-2">About the Author</p>
                <p className="text-2xl font-black tracking-tight text-slate-900 mb-3">{blog.author?.name}</p>
                <p className="text-base font-medium leading-relaxed text-slate-500 max-w-2xl">
                  {blog.author?.bio || 'Writer and content creator passionate about sharing ideas and stories.'}
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className="mb-20">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-10">
                Conversation ({comments.length})
              </h2>

              {/* Comment form */}
              <form onSubmit={handleComment} className="p-10 rounded-[2.5rem] bg-white mb-12 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                <h3 className="text-xl font-black tracking-tight text-slate-900 mb-8">Leave your thoughts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <input
                    placeholder="Your professional name"
                    value={commentForm.name}
                    onChange={e => setCommentForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10" required
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={commentForm.email}
                    onChange={e => setCommentForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10" required
                  />
                </div>
                <textarea
                  placeholder="Join the discussion..."
                  value={commentForm.content}
                  onChange={e => setCommentForm(p => ({ ...p, content: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-base font-medium outline-none transition-all focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-500/10 mb-8"
                  rows={4} required
                />
                <button type="submit" className="rounded-2xl bg-slate-900 px-10 py-4 text-base font-black text-white shadow-xl shadow-slate-900/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50" disabled={commentLoading}>
                  {commentLoading ? 'Sending...' : 'Post Comment →'}
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-6">
                {comments.map((c) => (
                  <motion.div key={c._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-sm shadow-inner">
                        {c.author.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900">{c.author.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{formatRelativeDate(c.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-base font-medium leading-relaxed text-slate-600">{c.content}</p>
                  </motion.div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center py-16 text-sm font-bold text-slate-400 bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 ring-1 ring-slate-100 uppercase tracking-[0.2em]">No comments yet. Start the conversation!</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="bg-slate-100 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-24">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 mb-12">Recommended Reading</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {related.map((b, i) => <BlogCard key={b._id} blog={b} index={i} />)}
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
};

export default BlogDetailPage;