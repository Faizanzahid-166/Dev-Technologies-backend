import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      <div
        className="text-8xl font-display font-bold mb-4"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        404
      </div>
      <h1 className="text-2xl font-display font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
        Page Not Found
      </h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
        The article or page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/" className="btn-primary">← Go Home</Link>
        <Link to="/blogs" className="btn-outline">Browse Articles</Link>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;