import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, User, LogOut, LayoutDashboard, UserPlus, LogIn } from 'lucide-react';
import { BrandWordmark } from '../brand/BrandWordmark';
import { ThemeToggle } from './ThemeToggle';
import { useEnergyData } from '../../context/EnergyDataContext';
import { useAuth } from '../../context/AuthContext';

export function AppHeader({ theme, onToggleTheme, isSidebarOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const { activeTariff, openTariffModal } = useEnergyData();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'developer' || currentUser?.role === 'technician'
      ? '/developer'
      : '/dashboard';

  return (
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
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary) lg:hidden transition-colors cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none rounded-lg shrink-0"
          >
            <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
          </Link>
        </div>

        {/* Right: Tariff Pill, Auth Controls (Login / Sign Up OR User Session + Logout), Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Active Utility Tariff Pill */}
          <button
            type="button"
            onClick={openTariffModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all hover:border-(--color-accent) cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            title="Configure Indian State Electricity Tariff and DISCOM Slabs"
          >
            <Zap size={13} className="text-(--color-accent)" />
            <span className="font-semibold">{activeTariff.discom.split(' ')[0]}</span>
            <span className="text-(--color-text-secondary)">
              (₹{activeTariff.slabs[0]?.ratePerKWh.toFixed(2)}–₹{activeTariff.slabs[activeTariff.slabs.length - 1]?.ratePerKWh.toFixed(2)})
            </span>
          </button>

          {/* Authenticated vs Public Navbar Controls */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <Link
                to={dashboardPath}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold hover:border-(--color-accent) transition-all bg-(--color-accent-subtle) text-(--color-accent) border-(--color-accent)/40"
                title="Open Role Dashboard"
              >
                <LayoutDashboard size={13} />
                <span className="hidden sm:inline">
                  {currentUser.role === 'admin'
                    ? 'Admin Dashboard'
                    : currentUser.role === 'developer'
                    ? 'Developer Dashboard'
                    : 'User Dashboard'}
                </span>
              </Link>

              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <User size={13} className="text-(--color-accent)" />
                <span className="font-semibold truncate max-w-30">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-(--color-surface-secondary) text-(--color-accent) font-bold border border-(--color-border)">
                  {currentUser.role}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs font-semibold text-(--color-text-secondary) hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-accent) transition-colors"
              >
                <LogIn size={13} className="text-(--color-accent)" />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-(--color-accent) text-white hover:opacity-90 transition-opacity shadow-xs"
              >
                <UserPlus size={13} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Theme Mode Toggle */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
