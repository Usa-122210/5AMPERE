import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { createAppRouter } from './router';

/**
 * App — Root application component.
 *
 * Directly renders the energy management router and provides instant dashboard access.
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();

  const router = useMemo(
    () => createAppRouter({ theme, onToggleTheme: toggleTheme }),
    [theme, toggleTheme]
  );

  return <RouterProvider router={router} />;
}
