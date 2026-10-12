import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  ChevronRight,
  Cpu,
  Layers,
  Lightbulb,
  Palette,
  Receipt,
  Settings,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { PageHeader } from '../components/common/PageHeader';
import { useEnergyData } from '../context/EnergyDataContext';

export function MorePage() {
  const { unreadAlertCount, alerts } = useEnergyData();

  const sections = [
    {
      category: 'Detailed Reports & Intelligence',
      items: [
        {
          to: '/analytics',
          title: 'Energy Analytics & History',
          description: 'Explore 24-hour hourly graphs, diurnal load curves, and day-by-day consumption history.',
          icon: TrendingUp,
          iconColor: 'var(--color-accent)',
          badge: 'Detailed',
        },
        {
          to: '/recommendations',
          title: 'AI Recommendations & Tips',
          description: 'Actionable tips and interactive simulator to reduce electricity waste and save money under your tariff.',
          icon: Lightbulb,
          iconColor: '#eab308',
          badge: 'Smart Tips',
        },
        {
          to: '/alerts',
          title: 'Alerts & Safety Notifications',
          description: 'Review overload alerts, excessive standby power warnings, and unusual usage notices.',
          icon: Bell,
          iconColor: '#f97316',
          badge: unreadAlertCount > 0 ? `${unreadAlertCount} New` : 'All Clear',
          badgeColor: unreadAlertCount > 0 ? 'var(--color-warning)' : 'var(--color-success)',
        },
      ],
    },
    {
      category: 'Technical & System Tools',
      items: [
        {
          to: '/monitoring',
          title: 'Live Line Telemetry',
          description: 'Detailed technical view of voltage, line current, power factor, and 50 Hz grid frequency.',
          icon: Activity,
          iconColor: 'var(--color-success)',
          badge: 'Technical',
        },
        {
          to: '/settings',
          title: 'Settings & Household Profile',
          description: 'Configure your sanctioned load capacity, electricity board (DISCOM), spending targets, and alerts.',
          icon: Settings,
          iconColor: 'var(--color-text-secondary)',
          badge: 'Configuration',
        },
        {
          to: '/preview',
          title: 'Design System & Foundation',
          description: 'Preview brand marks, color tokens, and UI components used across the application.',
          icon: Palette,
          iconColor: 'var(--color-text-muted)',
          badge: 'Design Preview',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Navigation"
        title="More Features &amp; Advanced Tools"
        badge="Secondary Tools"
        description="Access detailed energy analytics, safety alerts, saving recommendations, technical line telemetry, and household settings."
      />

      {/* Sections List */}
      {sections.map((sec, secIdx) => (
        <div key={secIdx} className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-1">
            {sec.category}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sec.items.map((item, itemIdx) => {
              const Icon = item.icon;

              return (
                <Link key={itemIdx} to={item.to} className="group block focus:outline-none">
                  <Surface
                    variant="primary"
                    padding="md"
                    className="h-full border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all duration-200 flex flex-col justify-between group-hover:shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[var(--color-border)]"
                          style={{ backgroundColor: 'var(--color-surface-secondary)' }}
                        >
                          <Icon size={18} style={{ color: item.iconColor }} />
                        </div>

                        {item.badge && (
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border"
                            style={{
                              backgroundColor: 'var(--color-surface-secondary)',
                              borderColor: item.badgeColor ? item.badgeColor : 'var(--color-border)',
                              color: item.badgeColor || 'var(--color-text-secondary)',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs font-semibold text-[var(--color-accent)]">
                      <span>Open Section</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Surface>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MorePage;
