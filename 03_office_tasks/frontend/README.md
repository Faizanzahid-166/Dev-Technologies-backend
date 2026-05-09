# ⚡ TaskFlow — Office Task Management System

A full-stack MERN application for managing office tasks with role-based access control, real-time status updates, and a modern SaaS-style dashboard.

---

## 🖼️ Features

### Admin
- 📊 Dashboard with live statistics and completion rate bar
- ➕ Create tasks and assign to any employee
- 📋 View all tasks with search & filter (by status)
- 📄 Paginated task table with assignee info and reasons
- 👁️ Monitor employee task status in real time

### Employee
- 🏠 Personal dashboard with own task stats
- 📝 View all assigned tasks in a card grid
- 🔄 Update task status (Pending / Completed / Not Completed)
- ❗ Must select one of 5 predefined reasons if not completed
- 🔍 Search and filter own tasks

### System
- 🔐 JWT auth via HTTP-only cookies (no localStorage)
- 🛡️ Role-based protected routes (admin / employee)
- 🌙 Dark-mode-only premium UI with Tailwind CSS
- 📱 Fully responsive (mobile + desktop)
- 🍞 Toast notifications
- ⏳ Loading skeletons and empty states
- 🔒 Backend validation on every endpoint

---

## 🗂️ Project Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # register, login, logout, me
│   │   ├── taskController.js   # CRUD + status update
│   │   └── userController.js   # getEmployees
│   ├── middleware/
│   │   ├── authMiddleware.js   # protect + restrictTo
│   │   └── errorHandler.js     # global error handler
│   ├── models/
│   │   ├── User.js             # name, email, password, role
│   │   └── Task.js             # title, desc, status, reason...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── jwt.js              # token helpers
│   ├── seed.js                 # demo data seeder
│   ├── server.js               # Express app entry
│   └── .env.example
│
└── frontend/
    └── src/
        ├── api/
        │   └── index.js         # Axios instance + API helpers
        ├── components/
        │   ├── admin/
        │   │   ├── CreateTaskForm.jsx
        │   │   └── TaskTable.jsx
        │   ├── common/
        │   │   ├── EmptyState.jsx
        │   │   ├── Modal.jsx
        │   │   ├── SearchFilterBar.jsx
        │   │   ├── Skeleton.jsx
        │   │   └── StatusBadge.jsx
        │   └── employee/
        │       └── TaskCard.jsx
        ├── context/
        │   └── AuthContext.jsx  # useAuth hook + provider
        ├── layouts/
        │   └── DashboardLayout.jsx  # sidebar + topbar
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── AdminDashboard.jsx
        │   ├── AdminTasksPage.jsx
        │   ├── CreateTaskPage.jsx
        │   ├── EmployeeDashboard.jsx
        │   ├── EmployeeTasksPage.jsx
        │   └── NotFoundPage.jsx
        ├── routes/
        │   └── ProtectedRoute.jsx  # ProtectedRoute, RoleRoute, GuestRoute
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js v18+ (LTS recommended)
- MongoDB (local or MongoDB Atlas free tier)
- npm or yarn

---

### Step 1 — Clone / Download

```bash
# If using git:
git clone <repo-url>
cd taskflow

# Or just unzip the project folder
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=change_this_to_a_long_random_secret_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **MongoDB Atlas**: Replace `MONGO_URI` with your Atlas connection string.

---

### Step 3 — Frontend Setup

```bash
cd ../frontend
npm install
```

No `.env` needed for development — the Vite proxy forwards `/api` to `localhost:5000`.

---

### Step 4 — Seed Demo Data (Optional but Recommended)

```bash
cd ../backend
node ./src/seed.js
```

This creates:

| Role     | Email                  | Password   |
|----------|------------------------|------------|
| Admin    | admin@taskflow.com     | admin123   |
| Employee | emp@taskflow.com       | emp12345   |
| Employee | alex@taskflow.com      | emp12345   |
| Employee | priya@taskflow.com     | emp12345   |
| Employee | james@taskflow.com     | emp12345   |

Plus 10 sample tasks across all employees and statuses.

---

### Step 5 — Run the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

---

## 🔌 API Reference

### Auth Endpoints

| Method | Route              | Access  | Description         |
|--------|--------------------|---------|---------------------|
| POST   | /api/auth/register | Public  | Create account      |
| POST   | /api/auth/login    | Public  | Login (sets cookie) |
| POST   | /api/auth/logout   | Private | Clear cookie        |
| GET    | /api/auth/me       | Private | Get current user    |

### Task Endpoints

| Method | Route                    | Access   | Description              |
|--------|--------------------------|----------|--------------------------|
| POST   | /api/tasks               | Admin    | Create a task            |
| GET    | /api/tasks               | Admin    | Get all tasks (+ stats)  |
| GET    | /api/tasks/my            | Employee | Get own tasks (+ stats)  |
| PATCH  | /api/tasks/:id/status    | Employee | Update task status       |
| GET    | /api/tasks/reasons       | Private  | Get 5 predefined reasons |

**Query params for GET /api/tasks and /api/tasks/my:**
- `search` — search by title or description
- `status` — filter: `pending` | `completed` | `not_completed`
- `page` — page number (admin only)
- `limit` — results per page (admin only)

### User Endpoints

| Method | Route                | Access | Description       |
|--------|----------------------|--------|-------------------|
| GET    | /api/users/employees | Admin  | List all employees|

---

## ⚙️ Predefined Not-Completed Reasons

Employees must pick one of:
1. Work was not clear
2. Time was not enough
3. Technical problem
4. Waiting for approval
5. Personal / emergency issue

---

## 🔐 Security

- Passwords hashed with `bcryptjs` (12 salt rounds)
- JWT stored in `httpOnly; SameSite=Lax` cookies — not accessible to JavaScript
- All task mutation routes validate ownership server-side
- CORS restricted to `CLIENT_URL` origin with credentials
- Global error handler normalizes all error responses

---

## 🎨 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS        |
| Routing   | React Router DOM v6                 |
| State     | Context API + useState/useEffect    |
| HTTP      | Axios (withCredentials: true)       |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose                  |
| Auth      | JWT + HTTP-only cookies             |
| Hashing   | bcryptjs                            |
| Toasts    | react-hot-toast                     |
| Dates     | date-fns                            |

---

## 🛠️ Common Issues

**CORS error?**
Ensure `CLIENT_URL` in `.env` exactly matches the frontend URL (including port, no trailing slash).

**Cookie not being sent?**
Make sure Axios has `withCredentials: true` and the Vite dev server proxy is configured correctly in `vite.config.js`.

**MongoDB connection failed?**
Check that MongoDB is running locally (`mongod`) or your Atlas connection string and IP whitelist are correct.

**Port already in use?**
Change `PORT` in `.env` and update the Vite proxy target in `vite.config.js` to match.
