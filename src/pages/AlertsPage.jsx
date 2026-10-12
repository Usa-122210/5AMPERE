import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Flame,
  Info,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Trash2,
  Wind,
  Zap,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { useEnergyData } from '../context/EnergyDataContext';

export function AlertsPage() {
  const { alerts, dismissAlert, unreadAlertCount, metadata } = useEnergyData();

  const [filter, setFilter] = useState('all'); // 'all' | 'warning' | 'info'
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());

  const handleAcknowledge = (id) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'warning') return alert.severity === 'warning';
    if (filter === 'info') return alert.severity === 'info';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Safety &amp; Auditing"
        title="Alerts &amp; Threshold Notifications"
        badge={unreadAlertCount > 0 ? `${unreadAlertCount} Active Notifications` : 'All Clear'}
        badgeColor={unreadAlertCount > 0 ? 'var(--color-warning)' : 'var(--color-success)'}
        description="Real-time threshold alerts, peak demand warnings, and standby power observations detected by the household telemetry monitoring model."
      >
        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          {[
            { id: 'all', label: `All (${alerts.length})` },
            { id: 'warning', label: 'Warnings' },
            { id: 'info', label: 'Info' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-bold shadow-xs border border-[var(--color-border)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* 1. Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-center mx-auto text-[var(--color-success)]">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                No active notifications
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-md mx-auto">
                All electrical parameters, standby floors, and sanctioned capacity boundaries are within nominal thresholds.
              </p>
            </div>
          </Surface>
        ) : (
          filteredAlerts.map((alert) => {
            const isAcknowledged = acknowledgedIds.has(alert.id);
            const isWarning = alert.severity === 'warning';

            return (
              <Surface
                key={alert.id}
                variant="primary"
                padding="md"
                className={`border transition-all space-y-3 ${
                  isAcknowledged
                    ? 'border-[var(--color-border)] opacity-75'
                    : isWarning
                    ? 'border-[var(--color-warning)] shadow-xs'
                    : 'border-[var(--color-accent)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5"
                      style={{
                        backgroundColor: isWarning
                          ? 'var(--color-warning-subtle, rgba(234, 179, 8, 0.1))'
                          : 'var(--color-accent-subtle)',
                        borderColor: isWarning ? 'var(--color-warning)' : 'var(--color-accent)',
                      }}
                    >
                      {isWarning ? (
                        <AlertTriangle size={18} className="text-[var(--color-warning)]" />
                      ) : (
                        <Info size={18} className="text-[var(--color-accent)]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[var(--color-text)]">
                          {alert.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                            isWarning
                              ? 'bg-[var(--color-warning-subtle, rgba(234, 179, 8, 0.1))] text-[var(--color-warning)]'
                              : 'bg-[var(--color-surface-secondary)] text-[var(--color-accent)]'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        {isAcknowledged && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                            Acknowledged
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                        {alert.message}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-[var(--color-text-muted)] mt-2">
                        <span>Timestamp: {alert.timestamp}</span>
                        {alert.circuitId && (
                          <span>· Circuit Target: #{alert.circuitId}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pt-2 sm:pt-0">
                    {alert.circuitId && (
                      <Link to="/appliances">
                        <Button variant="ghost" size="sm">
                          <span>Inspect</span>
                          <ArrowRight size={12} />
                        </Button>
                      </Link>
                    )}

                    {!isAcknowledged && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <CheckCircle2 size={12} />
                        <span>Ack</span>
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      aria-label="Dismiss alert"
                    >
                      <Trash2 size={13} className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]" />
                    </Button>
                  </div>
                </div>
              </Surface>
            );
          })
        )}
      </div>

      {/* 2. Configured Threshold Rules Documentation */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Active System Surveillance Rules
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Automatic triggers monitoring household telemetry against utility thresholds and equipment ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--color-warning)]">
              Rule 01: Sanctioned Demand
            </span>
            <div className="text-xs font-bold text-[var(--color-text)]">
              &gt; 50% Sanctioned Capacity
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Triggers when active demand exceeds 2.5 kW (50% of 5.0 kW Sanctioned Load) to protect against utility penalty surcharges.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--color-accent)]">
              Rule 02: Vampire Standby
            </span>
            <div className="text-xs font-bold text-[var(--color-text)]">
              &gt; 50W Idle Night Floor
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Detects continuous power draw exceeding 50W between 00:00 and 06:00 on non-essential entertainment and workstation circuits.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--color-text-secondary)]">
              Rule 03: Slab Threshold
            </span>
            <div className="text-xs font-bold text-[var(--color-text)]">
              Within 20 kWh of Slab Boundary
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Warns homeowner when monthly consumption approaches within 20 units of crossing into a higher progressive slab rate tier.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--color-success)]">
              Rule 04: Critical Circuit
            </span>
            <div className="text-xs font-bold text-[var(--color-text)]">
              Refrigerator Protection Lock
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              Guarantees food safety by preventing automated shedding or unconfirmed contactor disconnection of vital refrigeration.
            </p>
          </div>

        </div>
      </Surface>
    </div>
  );
}
export default AlertsPage;

