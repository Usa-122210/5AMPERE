import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  MapPin,
  LogOut,
} from 'lucide-react';
import { BrandWordmark } from '../brand/BrandWordmark';
import { ThemeToggle } from './ThemeToggle';
import { EnergyFlowBackground } from '../motion/EnergyFlowBackground';
import { TechnicianSidebar } from './TechnicianSidebar';
import { EvaluatorControls } from '../common/EvaluatorControls';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

export function TechnicianShell({ theme: propTheme, onToggleTheme: propToggleTheme }) {
  const hookTheme = useTheme();
  const theme = propTheme || hookTheme.theme;
  const onToggleTheme = propToggleTheme || hookTheme.toggleTheme;

  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div id="top" className="relative min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <EnergyFlowBackground intensity="subtle" />

      {/* Staff Application Header */}
      <header
        className="sticky top-0 z-50 w-full border-b transition-colors duration-200 h-16"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 95%, transparent)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Developer Workspace Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary) lg:hidden transition-colors cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/developer" className="flex items-center gap-2.5">
              <BrandWordmark size="sm" showBadge={true} badgeText="Developer Workspace" />
            </Link>
          </div>

          {/* Right: Zone Pill, Developer Badge, Public Site Link, Theme, Logout */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text) hover:border-(--color-accent) transition-all"
            >
              <span>Public Website</span>
            </Link>

            {/* Zone Tag */}
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <MapPin size={13} className="text-(--color-accent)" />
              <span>{currentUser?.zone || 'Gautam Buddha Nagar (Noida)'}</span>
            </div>

            {/* Developer Identification */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-(--color-success)" />
              <span>{currentUser?.name || 'Developer'}</span>
              <span className="text-[10px] font-mono text-(--color-text-muted) hidden sm:inline">
                ({currentUser?.staffId || '5AMP-DEV-001'})
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs font-medium text-(--color-text-secondary) hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex">
        <TechnicianSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="relative z-10 flex-1 lg:pl-64 w-full min-w-0 transition-all duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Evaluator Controls */}
      <EvaluatorControls />
    </div>
  );
}

export default TechnicianShell;
