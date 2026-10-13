import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Cpu,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function TechnicianSidebar({ isOpen, onClose }) {
  const { currentUser } = useAuth();

  const navigation = [
    { to: '/developer', label: 'Developer Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/developer/customers', label: 'Projects & Properties', icon: Users },
    { to: '/developer/appointments', label: 'Installation Schedule', icon: Calendar },
    { to: '/developer/service-requests', label: 'Installation Requests', icon: ClipboardList },
    { to: '/developer/catalogue', label: 'Device & Product Catalogue', icon: Cpu },
    { to: '/developer/configure', label: 'Panel & System Configurator', icon: Sliders },
  ];

  const initials = (currentUser?.name || 'Developer')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold tracking-wider text-(--color-text-muted) flex items-center justify-between">
            <span>Developer Workspace</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              Developer
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
                      ? 'bg-(--color-surface-selected) text-(--color-accent) font-bold shadow-xs'
                      : 'text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary)'
                  }`
                }
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer with Developer Info */}
        <div className="p-3 border-t border-(--color-border) space-y-2.5">
          <div className="p-2.5 rounded-xl border bg-(--color-surface-secondary) border-(--color-border)">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-(--color-accent) text-white flex items-center justify-center font-bold text-xs shrink-0">
                {initials}
              </div>
              <div className="truncate">
                <span className="text-[11px] font-bold block text-(--color-text) truncate">
                  {currentUser?.name || 'Developer'}
                </span>
                <span className="text-[9px] font-mono text-(--color-text-muted) block truncate">
                  {currentUser?.staffId || '5AMP-DEV-001'} · {currentUser?.specialization || 'Systems Developer'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default TechnicianSidebar;
