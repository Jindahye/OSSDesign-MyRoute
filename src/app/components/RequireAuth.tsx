import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { getStoredUser } from '../utils/auth';

interface RequireAuthProps {
  allowTempUser?: boolean;
}

export function RequireAuth({ allowTempUser = false }: RequireAuthProps) {
  const navigate = useNavigate();

  const user = getStoredUser();
  const tempUser = localStorage.getItem('temp_user');
  const authorized = !!user || (allowTempUser && !!tempUser);

  useEffect(() => {
    if (!authorized) {
      navigate('/', { replace: true });
    }
  }, [authorized, navigate]);

  if (!authorized) return null;

  return <Outlet />;
}
