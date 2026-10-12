import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, Sparkles, User, Wrench } from 'lucide-react';
import { BrandWordmark } from '../brand/BrandWordmark';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import { useEnergyData } from '../../context/EnergyDataContext';
import { useAuth } from '../../context/AuthContext';

export function AppHeader({ theme, onToggleTheme, onOpenSizing, onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const { activeTariff, openTariffModal } = useEnergyData();
  const { currentUser, switchRole } = useAuth();

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
            className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] lg:hidden transition-colors cursor-pointer"
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

        {/* Right: Tariff Pill, Electrical State, Role Switcher, Theme, Login */}
        <div className="flex items-center gap-2.5">
          {/* Active Utility Tariff Pill */}
          <button
            type="button"
            onClick={openTariffModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all hover:border-[var(--color-accent)] cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            title="Configure Indian State Electricity Tariff and DISCOM Slabs"
          >
            <Zap size={13} className="text-[var(--color-accent)]" />
            <span className="font-semibold">{activeTariff.discom.split(' ')[0]}</span>
            <span className="text-[var(--color-text-secondary)]">
              (₹{activeTariff.slabs[0]?.ratePerKWh.toFixed(2)}–₹{activeTariff.slabs[activeTariff.slabs.length - 1]?.ratePerKWh.toFixed(2)})
            </span>
            <span
              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                activeTariff.verified
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)]'
              }`}
            >
              {activeTariff.verified ? 'Verified' : 'Demo'}
            </span>
          </button>

          {/* Quick Staff Workspace Switcher (Evaluation Helper) */}
          <button
            type="button"
            onClick={() => {
              switchRole('technician');
              navigate('/technician');
            }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
            title="Switch demo role to Technician workspace"
          >
            <Sparkles size={12} />
            <span>Staff Portal</span>
          </button>

          {/* User Profile / Login Link */}
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium hover:border-[var(--color-accent)] transition-all"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            title="Switch user account or sign in"
          >
            <User size={13} className="text-[var(--color-accent)]" />
            <span className="font-semibold hidden sm:inline">
              {currentUser?.name ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </Link>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenSizing}
            className="shadow-xs font-semibold text-xs hidden lg:inline-flex"
          >
            <span>Panel Config</span>
          </Button>
        </div>
      </div>
    </header>
  );
}


