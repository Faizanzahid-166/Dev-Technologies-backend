import { useState, useEffect, useCallback, useRef } from 'react';
import { blogAPI } from '../api/APIs.js';

// Reading progress hook
export const useReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) setProgress(Math.round((scrollTop / docHeight) * 100));
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return progress;
};

// Debounce hook
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// Blogs fetch hook
export const useBlogs = (params) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await blogAPI.getAll(params);
      setBlogs(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { blogs, loading, pagination, error, refetch: fetch };
};

// Intersection observer hook (for lazy animations)
export const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
};

// Bookmark hook
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookmarks') || '[]'); } catch { return []; }
  });

  const toggle = useCallback((slug) => {
    setBookmarks((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((slug) => bookmarks.includes(slug), [bookmarks]);

  return { bookmarks, toggle, isBookmarked };
};