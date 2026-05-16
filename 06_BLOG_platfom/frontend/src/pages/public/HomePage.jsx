import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogAPI } from '../../api/APIs.js';
import BlogCard from '../../components/blog/BlogCard.jsx';
import { BlogCardSkeleton } from '../../components/common/Skeleton.jsx';
import { formatDate, getCategoryColor, formatViews } from '../../utils/helpers.js';

const HeroPost = ({ post }) => {
  if (!post) return null;
  return (
    <Link to={`/blog/${post.slug}`} className="group block relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-sky-900/10 min-h-[520px]">
      {/* Background */}
      <div className="absolute inset-0">
        {post.coverImage?.url ? (
          <img src={post.coverImage.url} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="flex items-center gap-4 mb-6">
            <span className="rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">★ Featured</span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white tracking-tighter max-w-3xl">
            {post.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl font-medium leading-relaxed text-slate-300 max-w-2xl">
            {post.excerpt}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black bg-sky-500 text-white shadow-lg shadow-sky-500/30">
                {post.author?.name?.[0] || 'A'}
              </div>
              <div>
                <p className="text-sm font-black text-white">{post.author?.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{formatDate(post.publishedAt)}</p>
              </div>
            </div>
            <span className="rounded-2xl bg-white px-8 py-3.5 text-sm font-black text-slate-900 shadow-xl shadow-white/10 transition-all hover:scale-110 active:scale-95">
              Explore Story →
            </span>
          </div>
        </motion.div>
      </div>
    </Link>
  );
};

const CategoryCard = ({ name, count, color }) => (
  <Link to={`/blogs?category=${name.toLowerCase()}`} className="group relative">
    <div className="bg-white rounded-3xl p-6 flex items-center gap-4 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/10">
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-50 transition-colors group-hover:bg-sky-50" style={{ color }}>
      {{'technology':'💻','design':'🎨','business':'📊','science':'🔬','health':'💪','travel':'✈️','food':'🍜','lifestyle':'🌿'}[name.toLowerCase()] || '📝'}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-black text-slate-900 group-hover:text-sky-600 transition-colors truncate">{name}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{count} pieces</p>
    </div>
    <span className="text-slate-200 font-bold group-hover:text-sky-400 group-hover:translate-x-1 transition-all">→</span>
    </div>
  </Link>
);

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, trendRes, latestRes, catRes] = await Promise.all([
          blogAPI.getFeatured(),
          blogAPI.getTrending(),
          blogAPI.getAll({ limit: 6, sort: '-publishedAt' }),
          blogAPI.getCategories(),
        ]);
        setFeatured(featRes.data.data);
        setTrending(trendRes.data.data);
        setLatest(latestRes.data.data);
        setCategories(catRes.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/blogs?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pt-24">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="h-[520px] rounded-[2.5rem] bg-slate-200 animate-pulse" />
              ) : (
                <HeroPost post={featured[0]} />
              )}
            </div>
            {/* Side featured */}
            <div className="flex flex-col gap-8">
              {loading ? (
                [...Array(2)].map((_, i) => <div key={i} className="flex-1 rounded-[2rem] bg-slate-200 animate-pulse min-h-[220px]" />)
              ) : (
                featured.slice(1, 3).map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-xl shadow-slate-900/5 flex-1 min-h-[220px]">
                    <div className="absolute inset-0">
                      {post.coverImage?.url && <img src={post.coverImage.url} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 p-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-2 block">{post.category}</span>
                      <h3 className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-sky-300 transition-colors">{post.title}</h3>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Search bar */}
        <section className="max-w-3xl mx-auto px-8 mb-20">
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onSubmit={handleSearch}
            className="flex gap-3 p-3 rounded-3xl bg-white shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100"
          >
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Explore the archives..."
              className="flex-1 px-6 py-4 bg-transparent outline-none text-lg font-bold text-slate-900 placeholder:text-slate-300"
            />
            <button type="submit" className="rounded-2xl bg-sky-500 px-10 py-4 text-sm font-black text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-95">
              Search
            </button>
          </motion.form>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-8 lg:px-16 mb-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black tracking-tighter text-slate-900">
                Editorial Channels
              </h2>
              <Link to="/blogs" className="text-xs font-black uppercase tracking-widest text-sky-600 hover:text-sky-700">Explore All →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 6).map((cat) => (
                <CategoryCard key={cat._id} name={cat._id} count={cat.count} color={getCategoryColor(cat._id)} />
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        <section className="max-w-7xl mx-auto px-8 lg:px-16 mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">
              Hot & Trending
            </h2>
            <Link to="/blogs?sort=-views" className="text-xs font-black uppercase tracking-widest text-sky-600">Leaderboard →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading
              ? [...Array(3)].map((_, i) => <BlogCardSkeleton key={i} />)
              : trending.slice(0, 3).map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)
            }
          </div>
        </section>

        {/* Latest */}
        <section className="max-w-7xl mx-auto px-8 lg:px-16 mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">
              Fresh Editorial Feed
            </h2>
            <Link to="/blogs" className="text-xs font-black uppercase tracking-widest text-sky-600">Full Archive →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading
              ? [...Array(6)].map((_, i) => <BlogCardSkeleton key={i} />)
              : latest.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)
            }
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-8 lg:px-16 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-16 md:p-24 text-center shadow-2xl shadow-sky-950/20"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.15),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter max-w-2xl mx-auto mb-8">
                Your gateway to Asia's tech & design stories.
              </h2>
              <p className="text-lg md:text-xl font-medium text-slate-400 max-w-xl mx-auto mb-12">
                Stay ahead of the curve with expert-led editorial content.
              </p>
              <Link to="/blogs" className="inline-block rounded-2xl bg-white px-12 py-5 text-lg font-black text-slate-900 shadow-xl transition-all hover:scale-105 active:scale-95">
                View Full Archive →
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;