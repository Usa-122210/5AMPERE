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
          {/* Left: Mobile Toggle & Staff Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] lg:hidden transition-colors cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/technician" className="flex items-center gap-2.5">
              <BrandWordmark size="sm" showBadge={true} badgeText="Staff Operations" />
            </Link>
          </div>

          {/* Right: Zone Pill, Lead Tech Badge, Theme, Logout */}
          <div className="flex items-center gap-2.5">
            {/* Zone Tag */}
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <MapPin size={13} className="text-[var(--color-accent)]" />
              <span>Gautam Buddha Nagar (Noida)</span>
            </div>

            {/* Technician Identification */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
              <span>{currentUser?.name || 'Rajesh Kumar'}</span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] hidden sm:inline">
                (5AMP-TECH-042)
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut size={14} />
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
