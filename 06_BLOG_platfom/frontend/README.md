# 🖋️ Inkwell — MERN Blog Platform

A full-stack, production-ready blogging platform built with MongoDB, Express, React, and Node.js. Features a premium UI with dark/light mode, rich text editor, media uploads, and a complete admin CMS.

---

## 📁 Project Structure

```
blog-platform/
├── backend/                  # Express + Node.js API
│   ├── controllers/          # Business logic
│   │   ├── blogController.js
│   │   ├── uploadController.js
│   │   ├── commentController.js
│   │   └── newsletterController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT protect / adminOnly
│   │   ├── upload.js         # Multer config
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Blog.js           # Full blog schema
│   │   ├── Comment.js
│   │   └── Newsletter.js
│   ├── routes/
│   │   ├── blogRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── commentRoutes.js
│   │   └── newsletterRoutes.js
│   ├── utils/connectDB.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/                 # React + Tailwind
    ├── public/index.html
    └── src/
        ├── components/
        │   ├── admin/
        │   │   ├── AdminLayout.jsx     # Sidebar + responsive nav
        │   │   ├── RichTextEditor.jsx  # Quill-based editor
        │   │   └── UploadBox.jsx       # Drag & drop file upload
        │   ├── blog/
        │   │   └── BlogCard.jsx        # Card with bookmark, tags, meta
        │   ├── common/
        │   │   ├── Skeleton.jsx        # Loading skeletons
        │   │   └── ProtectedRoute.jsx
        │   └── layout/
        │       ├── Navbar.jsx          # Responsive + search
        │       └── Footer.jsx          # Newsletter subscribe
        ├── context/
        │   ├── AuthContext.jsx         # JWT auth state
        │   └── ThemeContext.jsx        # Dark/light mode
        ├── hooks/index.js              # useReadingProgress, useBookmarks, etc.
        ├── pages/
        │   ├── public/
        │   │   ├── HomePage.jsx        # Hero, trending, categories, latest
        │   │   ├── BlogListPage.jsx    # Grid + filters + pagination
        │   │   ├── BlogDetailPage.jsx  # Full post + video + PDF + comments
        │   │   └── NotFoundPage.jsx
        │   └── admin/
        │       ├── AdminLoginPage.jsx
        │       ├── AdminDashboard.jsx  # Stats, chart, recent posts
        │       ├── AdminBlogManager.jsx # Table, bulk actions, toggle publish
        │       ├── AdminBlogEditor.jsx  # Full post editor with SEO
        │       └── AdminSubscribers.jsx
        ├── services/api.js             # Axios + all API calls
        ├── utils/helpers.js
        ├── App.jsx                     # All routes
        ├── index.js
        └── index.css                   # CSS variables, dark/light mode
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env        # Fill in your values
npm install
npm run dev                 # Starts on :5000
```

**Required `.env` values:**
```
MONGODB_URI=mongodb://localhost:27017/inkwell
JWT_SECRET=your_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
STORAGE_TYPE=local
NODE_ENV=development
```

### 2. Frontend

```bash
cd frontend
npm install
npm start                   # Starts on :3000
```

---

## 🔌 API Reference

### Public Blog Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | List published blogs (pagination, filters) |
| GET | `/api/blogs/featured` | Featured posts for hero |
| GET | `/api/blogs/trending` | Most viewed posts |
| GET | `/api/blogs/categories` | Category breakdown |
| GET | `/api/blogs/:slug` | Single post + increments views |
| POST | `/api/blogs/:id/like` | Like a post |

### Admin Blog Endpoints (JWT required, role: admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs/admin/all` | All posts including drafts |
| GET | `/api/blogs/admin/stats` | Dashboard stats |
| POST | `/api/blogs` | Create post |
| PUT | `/api/blogs/:id` | Update post |
| DELETE | `/api/blogs/:id` | Delete post + comments |

### Upload Endpoints (JWT required, role: admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/image` | Upload single image |
| POST | `/api/upload/images` | Upload multiple images |
| POST | `/api/upload/video` | Upload MP4/WebM |
| POST | `/api/upload/pdf` | Upload PDF |

### Comment Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:blogId` | Get post comments |
| POST | `/api/comments/:blogId` | Add comment |
| DELETE | `/api/comments/:id` | Delete comment (admin) |

### Newsletter Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter/subscribe` | Subscribe email |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe |
| GET | `/api/newsletter/subscribers` | List (admin) |

---

## 🔐 Authentication Integration

Since auth is already built, connect it in two places:

**Backend** — the `protect` middleware reads `Authorization: Bearer <token>` and decodes it:
```js
// middleware/auth.js — expects token payload: { id, role, name }
jwt.verify(token, process.env.JWT_SECRET)
```

**Frontend** — `AdminLoginPage.jsx` calls `POST /api/auth/login` (your existing endpoint).
Store the token + user in `AuthContext`:
```js
const res = await API.post('/auth/login', { email, password });
login(res.data.user, res.data.token);
```

Make sure your auth route returns `{ user: { id, name, email, role }, token }`.

---

## 🎨 Features

### Public Site
- **Homepage**: Hero featured post, trending section, category browser, search, latest articles
- **Blog Listing**: Grid layout, category pills, sort options, search, pagination
- **Blog Detail**: Reading progress bar, cover image, rich HTML content, embedded video player, PDF preview/download, image gallery, comments, like/bookmark/share, related posts, author bio
- **Dark/Light Mode**: Persisted across sessions
- **Bookmarks**: Client-side via localStorage

### Admin Panel
- **Dashboard**: Stats cards (posts, views, subscribers), weekly views chart, category breakdown, recent posts table
- **Blog Manager**: Searchable/filterable table, bulk delete, publish/unpublish toggle, featured toggle, inline preview
- **Blog Editor**: Quill rich text editor, drag-drop media upload (image/video/PDF), SEO fields with live Google preview, slug auto-generation, category/tags, featured toggle
- **Subscribers**: List with stats and subscription date

### Media Support
- Images: JPG, PNG, WebP (max 10MB)
- Videos: MP4, WebM (max 50MB) — plays inline in post
- PDFs: Preview in iframe + download button

---

## 🧩 Adding Your Auth System

If your auth lives at `/api/auth`:
1. Set `"proxy": "http://localhost:5000"` in frontend `package.json` ✅ (already done)
2. Your login endpoint should return `{ user: { id, name, email, role: 'admin' }, token }`
3. The blog backend's `protect` middleware will validate the same JWT secret

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Framer Motion, Tailwind CSS |
| Editor | React Quill (Quill.js) |
| State | Context API (Auth + Theme) |
| HTTP | Axios with interceptors |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) |
| Uploads | Multer (local) |
| Notifications | react-hot-toast |
| Fonts | Playfair Display + DM Sans + JetBrains Mono |