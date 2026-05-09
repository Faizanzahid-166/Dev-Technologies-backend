import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute, RoleRoute, GuestRoute } from './routes/ProtectedRoute.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminTasksPage from './pages/AdminTasksPage.jsx';
import CreateTaskPage from './pages/CreateTaskPage.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import EmployeeTasksPage from './pages/EmployeeTasksPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Health from './pages/Health.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#1e293b' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#1e293b' },
            },
          }}
        />

        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Health check */}
          <Route path="/health" element={<Health />} />

          {/* Guest routes (redirect to dashboard if logged in) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<RoleRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tasks" element={<AdminTasksPage />} />
            <Route path="/admin/create-task" element={<CreateTaskPage />} />
          </Route>

          {/* Employee routes */}
          <Route element={<RoleRoute role="employee" />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/tasks" element={<EmployeeTasksPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
