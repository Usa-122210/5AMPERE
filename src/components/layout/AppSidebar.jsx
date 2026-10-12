import { NavLink } from 'react-router-dom';
import {
  Activity,
  Bell,
  CheckCircle2,
  Cpu,
  CreditCard,
  Gauge,
  Home,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Palette,
  Power,
  Receipt,
  Settings,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEnergyData } from '../../context/EnergyDataContext';

export function AppSidebar({ isOpen, onClose }) {
  const { isSavingModeActive, toggleSavingMode, unreadAlertCount } = useEnergyData();

  const navigationItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/monitoring', label: 'Live Monitoring', icon: Activity },
    { to: '/appliances', label: 'Appliances', icon: Cpu },
    {
      to: '/saving-mode',
      label: 'Saving Mode',
      icon: Leaf,
      badge: isSavingModeActive ? 'ON' : null,
      badgeColor: 'var(--color-success)',
    },
    { to: '/billing', label: 'Bill & Tariff', icon: Receipt },
    { to: '/analytics', label: 'Analytics', icon: TrendingUp },
    { to: '/recommendations', label: 'Recommendations', icon: Lightbulb },
    {
      to: '/alerts',
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertCount > 0 ? unreadAlertCount : null,
      badgeColor: 'var(--color-warning)',
    },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/preview', label: 'Design System', icon: Palette, isSecondary: true },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-150"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Navigation Links List */}
        <div className="p-3 space-y-1 overflow-y-auto flex-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold tracking-wider text-[var(--color-text-muted)]">
            Energy Management
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--color-surface-selected)] text-[var(--color-accent)] font-bold shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold"
                    style={{
                      backgroundColor: 'var(--color-surface-secondary)',
                      color: item.badgeColor || 'var(--color-text)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer — Saving Mode Quick Status & Telemetry Mode */}
        <div className="p-3 border-t border-[var(--color-border)] space-y-2.5">
          {/* Quick Saving Mode Toggle Pill */}
          <div className="p-2.5 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Leaf
                size={14}
                className={isSavingModeActive ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'}
              />
              <div>
                <span className="text-[11px] font-bold block text-[var(--color-text)]">Saving Mode</span>
                <span className="text-[9px] font-mono text-[var(--color-text-muted)]">
                  {isSavingModeActive ? 'Active (-15%)' : 'Disabled'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSavingMode()}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all border ${
                isSavingModeActive
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
              }`}
            >
              {isSavingModeActive ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Telemetry Status Indicator */}
          <div className="px-2 py-1 text-[10px] font-mono text-[var(--color-text-muted)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse shrink-0" />
            <span className="truncate">Calibrated Simulation Engine</span>
          </div>
        </div>
      </aside>
    </>
  );
}

