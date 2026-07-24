import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '@/services';

function ProtectedRoute() {
  if (!authService.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;