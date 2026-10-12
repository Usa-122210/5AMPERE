import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { AuthProvider } from '../context/AuthContext';
import { createAppRouter } from './router';

/**
 * App — Root application component.
 *
 * Provides theme and authentication role context and renders the router.
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();

  const router = useMemo(
    () => createAppRouter({ theme, onToggleTheme: toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

