import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import Health from './pages/Health.jsx'

// Layout
import Navbar from './layouts/Navbar.jsx';
import Footer from './layouts/Footer.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Public pages
import HomePage from './pages/public/HomePage.jsx';
import BlogListPage from './pages/public/BlogListPage.jsx';
import BlogDetailPage from './pages/public/BlogDetailPage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminBlogManager from './pages/admin/AdminBlogManager.jsx';
import AdminBlogEditor from './pages/admin/AdminBlogEditor.jsx';
import AdminSubscribers from './pages/admin/AdminSubscribers.jsx';

// Full-screen spinner
const Spinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
  </div>
);

// Public layout wrapper
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Health />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: 'var(--bg-card)' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: 'var(--bg-card)' },
              },
            }}
          />

          <Suspense fallback={<Spinner />}>
            <Routes>
              {/* ── Public routes ── */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <HomePage />
                  </PublicLayout>
                }
              />
              <Route
                path="/blogs"
                element={
                  <PublicLayout>
                    <BlogListPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/blog/:slug"
                element={
                  <PublicLayout>
                    <BlogDetailPage />
                  </PublicLayout>
                }
              />

              {/* ── Admin auth ── */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* ── Protected admin routes ── */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminBlogManager />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/create"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminBlogEditor />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/edit/:id"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminBlogEditor />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subscribers"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout>
                      <AdminSubscribers />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* ── 404 ── */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;