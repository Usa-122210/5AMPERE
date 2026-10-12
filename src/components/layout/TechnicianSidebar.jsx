import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Cpu,
  Sliders,
  Shield,
  LogOut,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function TechnicianSidebar({ isOpen, onClose }) {
  const { currentUser, switchRole } = useAuth();

  const navigation = [
    { to: '/technician', label: 'Operations Overview', icon: LayoutDashboard, exact: true },
    { to: '/technician/customers', label: 'Customers & Homes', icon: Users },
    { to: '/technician/appointments', label: 'Field Appointments', icon: Calendar },
    { to: '/technician/service-requests', label: 'Service Requests', icon: ClipboardList },
    { to: '/technician/catalogue', label: 'Hardware Catalogue', icon: Cpu },
    { to: '/technician/configure', label: 'Home Configurator', icon: Sliders },
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
        <div className="p-3 space-y-1 overflow-y-auto flex-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold tracking-wider text-[var(--color-text-muted)] flex items-center justify-between">
            <span>Staff Operations</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              Staff Only
            </span>
          </div>

          {navigation.map((item) => {
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
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--color-surface-selected)] text-[var(--color-accent)] font-bold shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]'
                  }`
                }
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer with Technician Info & Quick Customer Switch */}
        <div className="p-3 border-t border-[var(--color-border)] space-y-2.5">
          {/* Active Technician Profile */}
          <div className="p-2.5 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] text-white flex items-center justify-center font-bold text-xs shrink-0">
                RK
              </div>
              <div className="truncate">
                <span className="text-[11px] font-bold block text-[var(--color-text)] truncate">
                  Rajesh Kumar
                </span>
                <span className="text-[9px] font-mono text-[var(--color-text-muted)] block truncate">
                  5AMP-TECH-042 · Senior Tech
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo Switcher Button to Customer View */}
          <button
            type="button"
            onClick={() => switchRole('customer')}
            className="w-full p-2 rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Sparkles size={13} />
            <span>Switch to Customer Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default TechnicianSidebar;
