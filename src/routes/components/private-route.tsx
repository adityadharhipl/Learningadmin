import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from 'src/store/hooks';

// ----------------------------------------------------------------------

type PrivateRouteProps = {
  children: React.ReactNode;
};

/**
 * Wraps any route that requires an authenticated admin.
 * If no token is present the user is redirected to /sign-in,
 * and the original location is saved so we can send them back
 * after a successful login.
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
