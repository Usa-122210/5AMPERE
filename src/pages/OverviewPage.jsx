import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Cpu,
  Flame,
  Leaf,
  Lightbulb,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { EnergyOverview } from '../components/dashboard/EnergyOverview';
import { useEnergyData } from '../context/EnergyDataContext';

export function OverviewPage() {
  const {
    loads,
    isSavingModeActive,
    toggleSavingMode,
    savingModeTargetPercent,
    alerts,
    formatINR,
    periodEstimate,
  } = useEnergyData();

  // Top 3 active appliances by draw
  const topActiveLoads = [...loads]
    .filter((l) => l.active)
    .sort((a, b) => b.drawKw - a.drawKw)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Home"
        title="Energy Dashboard"
        badge="Live Telemetry"
        badgeColor="var(--color-success)"
        description="Real-time household consumption, progressive electricity slab tracking, and intelligent bill management."
      >
        <Link to="/saving-mode">
          <Button variant={isSavingModeActive ? 'primary' : 'secondary'} size="sm">
            <Leaf size={14} />
            <span>Saving Mode: {isSavingModeActive ? 'Active (-15%)' : 'Configure'}</span>
          </Button>
        </Link>
      </PageHeader>

      {/* 1. Household Status Pill */}
      <div className="p-3 rounded-xl border bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          <span className="font-semibold text-[var(--color-text)]">
            Main Distribution Panel · Online
          </span>
          <span className="text-[var(--color-text-muted)]">·</span>
          <span className="text-[var(--color-text-secondary)]">
            5.0 kW Sanctioned Load (Single-Phase 230V · 50 Hz)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-text-muted)]">
          <span className="px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
            Calibrated Model Active
          </span>
        </div>
      </div>

      {/* 2. Primary Operational Metrics & Tariff Attribution */}
      <EnergyOverview />

      {/* 3. Operational Quick Cards Grid (Saving Mode, Alerts Preview, Top Loads) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card A: Saving Mode Status Widget */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Saving Mode Status
              </span>
              <Leaf size={16} className={isSavingModeActive ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'} />
            </div>

            <div className="pt-2">
              <span className={`text-base font-bold ${isSavingModeActive ? 'text-[var(--color-success)]' : 'text-[var(--color-text)]'}`}>
                {isSavingModeActive ? 'Active — Peak Curtailed' : 'Standard Baseline'}
              </span>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {isSavingModeActive
                  ? `Simulating ${savingModeTargetPercent}% consumption curtailment. Discretionary loads shed.`
                  : 'All circuits operating at standard baseline. Enable to simulate peak load reduction.'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
            <Link
              to="/saving-mode"
              className="text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Saving Mode</span>
              <ArrowRight size={13} />
            </Link>

            <button
              type="button"
              onClick={() => toggleSavingMode()}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold border cursor-pointer transition-all ${
                isSavingModeActive
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent)]'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text)] border-[var(--color-border)]'
              }`}
            >
              {isSavingModeActive ? 'Turn OFF' : 'Turn ON'}
            </button>
          </div>
        </Surface>

        {/* Card B: Active Alerts Snapshot */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                System Alerts ({alerts.length})
              </span>
              <Bell size={16} className="text-[var(--color-warning)]" />
            </div>

            <div className="pt-2 space-y-2">
              {alerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="text-xs p-2 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)]">
                  <span className="font-semibold text-[var(--color-text)] block truncate">
                    {alert.title}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] font-mono block">
                    {alert.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-border-subtle)]">
            <Link
              to="/alerts"
              className="text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Alerts &amp; Events</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </Surface>

        {/* Card C: Top Active Draw Circuits */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Top Active Loads
              </span>
              <Zap size={16} className="text-[var(--color-accent)]" />
            </div>

            <div className="pt-2 space-y-1.5">
              {topActiveLoads.map((l) => (
                <div key={l.id} className="flex items-center justify-between text-xs py-1 border-b border-[var(--color-border-subtle)] last:border-0">
                  <span className="font-medium text-[var(--color-text)] truncate max-w-[150px]">
                    {l.name}
                  </span>
                  <span className="font-mono font-bold text-[var(--color-accent)]">
                    {l.drawKw.toFixed(2)} kW
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-border-subtle)]">
            <Link
              to="/appliances"
              className="text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All Circuits ({loads.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </Surface>
      </div>
    </div>
  );
}

export default OverviewPage;

