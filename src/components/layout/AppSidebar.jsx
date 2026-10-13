import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  Bell,
  ChevronDown,
  Cpu,
  Home,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  MoreHorizontal,
  Palette,
  Receipt,
  Settings,
  TrendingUp,
  Package,
  Wrench,
  Layers,
  Building,
  School,
  Factory,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { useEnergyData } from '../../context/EnergyDataContext';
import { useAuth } from '../../context/AuthContext';

export function AppSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { isSavingModeActive, toggleSavingMode, unreadAlertCount } = useEnergyData();
  const { activeCustomerProperty, currentUser } = useAuth();

  // Determine if current route is part of "More"
  const moreRoutePaths = ['/more', '/appliances', '/analytics', '/recommendations', '/preview'];
  const isMoreRouteActive = moreRoutePaths.some((p) =>
    p === '/' ? location.pathname === '/' : location.pathname.startsWith(p)
  );

  const [isMoreExpanded, setIsMoreExpanded] = useState(false);

  const pendingRequestsCount = activeCustomerProperty?.requestedDevices?.length || 0;

  // Primary Navigation Sections (Standardized for Public & User Experience)
  const primaryNavigation = [
    { to: '/', label: 'Public Homepage', icon: Home, exact: true },
    { to: '/dashboard', label: 'User Dashboard', icon: LayoutDashboard },
    ...(currentUser?.role === 'developer' || currentUser?.role === 'technician'
      ? [{ to: '/developer', label: 'Developer Portal', icon: Code2 }]
      : []),
    ...(currentUser?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin Portal', icon: ShieldCheck }]
      : []),
    { to: '/monitoring', label: 'Energy Monitoring', icon: Activity },
    { to: '/rooms-appliances', label: 'Rooms & Appliances', icon: Layers },
    { to: '/devices', label: 'Devices & Hardware', icon: Package },
    { to: '/billing', label: 'Electricity Bill', icon: Receipt },
    {
      to: '/saving-mode',
      label: 'Savings & Recommendations',
      icon: Leaf,
      badge: isSavingModeActive ? 'ON' : null,
      badgeColor: 'var(--color-success)',
    },
    {
      to: '/alerts',
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertCount > 0 ? unreadAlertCount : null,
      badgeColor: 'var(--color-warning)',
    },
    {
      to: '/installation',
      label: 'Installation & Support',
      icon: Wrench,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} PENDING` : null,
      badgeColor: 'var(--color-warning)',
    },
    { to: '/settings', label: 'Property Settings', icon: Settings },
    {
      to: '/more',
      label: 'More',
      icon: MoreHorizontal,
      isMoreTrigger: true,
    },
  ];

  // Secondary tools grouped under "More"
  const moreSubItems = [
    { to: '/appliances', label: 'Appliance Relays', icon: Cpu },
    { to: '/analytics', label: 'Analytics & Trends', icon: TrendingUp },
    { to: '/recommendations', label: 'Energy Advice', icon: Lightbulb },
    { to: '/preview', label: 'Design System Preview', icon: Palette },
  ];

  const propType = activeCustomerProperty?.propertyType || 'home';
  const PropIcon =
    propType === 'school'
      ? School
      : propType === 'office'
      ? Building
      : propType === 'industry'
      ? Factory
      : Home;

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
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold tracking-wider text-(--color-text-muted)">
            Workspace
          </div>

          {primaryNavigation.map((item) => {
            const Icon = item.icon;
            const isItemActive = item.isMoreTrigger
              ? isMoreRouteActive
              : item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <div key={item.to} className="space-y-1">
                <NavLink
                  to={item.to}
                  end={item.exact}
                  onClick={() => {
                    if (item.isMoreTrigger) {
                      setIsMoreExpanded(!isMoreExpanded);
                    }
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isItemActive
                      ? 'bg-(--color-surface-selected) text-(--color-accent) font-bold shadow-xs'
                      : 'text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary)'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
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

                    {item.isMoreTrigger && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsMoreExpanded(!isMoreExpanded);
                        }}
                        className="p-1 rounded text-(--color-text-muted) hover:text-(--color-text) cursor-pointer"
                        title={isMoreExpanded ? 'Collapse sub-menu' : 'Expand sub-menu'}
                        aria-label="Toggle More menu"
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isMoreExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>
                </NavLink>

                {/* Sub-items nested under "More" */}
                {item.isMoreTrigger && isMoreExpanded && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-(--color-border) ml-4 mt-1">
                    {moreSubItems.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-(--color-accent-subtle) text-(--color-accent) font-bold'
                                : 'text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary)'
                            }`
                          }
                        >
                          <div className="flex items-center gap-2">
                            <SubIcon size={14} />
                            <span className="truncate">{sub.label}</span>
                          </div>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer — Property Info & Saving Mode Toggle */}
        <div className="p-3 border-t border-(--color-border) space-y-2.5">
          {/* Active Property Card */}
          <div className="p-2.5 rounded-xl border bg-(--color-surface-secondary) border-(--color-border)">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-(--color-accent-subtle) text-(--color-accent) flex items-center justify-center shrink-0 border border-(--color-accent)/20">
                <PropIcon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold block text-(--color-text) truncate">
                  {activeCustomerProperty?.propertyName || 'Customer Property'}
                </span>
                <span className="text-[9px] font-mono text-(--color-text-muted) block truncate uppercase">
                  {propType} · {activeCustomerProperty?.sanctionedLoadKw || 5} kW Sanctioned
                </span>
              </div>
            </div>
          </div>

          {/* Quick Saving Mode Toggle Pill */}
          <div className="p-2.5 rounded-xl border bg-(--color-surface-secondary) border-(--color-border) flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Leaf
                size={14}
                className={isSavingModeActive ? 'text-(--color-success)' : 'text-(--color-text-muted)'}
              />
              <div>
                <span className="text-[11px] font-bold block text-(--color-text)">Savings Mode</span>
                <span className="text-[9px] font-mono text-(--color-text-muted)">
                  {isSavingModeActive ? 'Active (-15%)' : 'Disabled'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleSavingMode()}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all border ${
                isSavingModeActive
                  ? 'bg-(--color-accent-subtle) text-(--color-accent) border-(--color-accent)'
                  : 'bg-(--color-surface) text-(--color-text-secondary) border-(--color-border) hover:border-(--color-accent)'
              }`}
            >
              {isSavingModeActive ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
