import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="skeleton w-12 h-12 rounded-full" /></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center"><div className="skeleton w-12 h-12 rounded-full" /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/home" />;
  return children;
};
