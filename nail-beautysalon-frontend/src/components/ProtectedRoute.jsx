import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Only lets logged-in users with one of the given roles in; everyone else is sent to the login page. */
function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homePathFor(user.role)} replace />;
  }
  return children;
}

export function homePathFor(role) {
  if (role === 'ROLE_ADMIN') return '/admin';
  if (role === 'ROLE_EMPLOYEE') return '/employee/dashboard';
  return '/customer/dashboard';
}

export default ProtectedRoute;
