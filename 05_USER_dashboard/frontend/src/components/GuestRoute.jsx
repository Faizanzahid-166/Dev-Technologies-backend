import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function GuestRoute({ children }) {
  const { token } = useSelector((s) => s.auth);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}