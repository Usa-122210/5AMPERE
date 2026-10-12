import { useState } from 'react';
import {
  BatteryCharging,
  Cpu,
  Flame,
  Info,
  Lightbulb,
  Power,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Tv,
  Waves,
  Wind,
  Zap,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { useEnergyData } from '../context/EnergyDataContext';

// Appliance icons map
const APPLIANCE_ICONS = {
  ac: Wind,
  refrigerator: Zap,
  geyser: Flame,
  fans_lighting: Lightbulb,
  washing_machine: Waves,
  entertainment: Tv,
  water_pump: Waves,
  ev: BatteryCharging,
};

export function AppliancesPage() {
  const {
    loadsWithCosts,
    requestRelayToggle,
    shedPeakLoads,
    restoreAllLoads,
    totalActiveKw,
    currentAmps,
    activeLoadCount,
    formatINR,
    metadata,
  } = useEnergyData();

  const [filter, setFilter] = useState('all'); // 'all' | 'heavy' | 'critical' | 'discretionary'

  const filteredLoads = loadsWithCosts.filter((l) => {
    if (filter === 'heavy') return l.isHeavy;
    if (filter === 'critical') return l.priority === 'Critical';
    if (filter === 'discretionary') return l.priority === 'Discretionary';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Circuits"
        title="Appliance Management &amp; Device Control"
        badge={`${activeLoadCount} of ${loadsWithCosts.length} Active`}
        description="Monitor individual sub-circuit loads, inspect estimated monthly appliance running costs, and simulate contactor relay switching with safety interlocks for critical circuits."
      >
        <Button variant="secondary" size="sm" onClick={shedPeakLoads}>
          <ShieldAlert size={14} className="text-[var(--color-warning)]" />
          <span>Shed Heavy Loads</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={restoreAllLoads}>
          <RotateCcw size={14} />
          <span>Restore All</span>
        </Button>
      </PageHeader>

      {/* Filter Toolbar & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `All Circuits (${loadsWithCosts.length})` },
            { id: 'heavy', label: 'Heavy Draw (>1 kW)' },
            { id: 'critical', label: 'Critical (Protected)' },
            { id: 'discretionary', label: 'Discretionary' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Real-Time Total Load Metric */}
        <div className="flex items-center gap-3 text-xs font-mono self-end sm:self-auto">
          <span className="text-[var(--color-text-muted)]">Active Circuit Draw:</span>
          <span className="text-sm font-extrabold text-[var(--color-accent)]">
            {totalActiveKw.toFixed(2)} kW
          </span>
          <span className="text-[var(--color-text-muted)]">
            ({currentAmps} A Est.)
          </span>
        </div>
      </div>

      {/* Appliances List */}
      <div className="space-y-3">
        {filteredLoads.map((item) => {
          const Icon = APPLIANCE_ICONS[item.id] || Zap;
          const currentLoadAmps = ((item.drawKw * 1000) / (metadata.nominalVoltage * (item.powerFactor || 0.95))).toFixed(1);
          const isCritical = item.priority === 'Critical';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.active
                  ? 'bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs'
                  : 'bg-[var(--color-surface-secondary)] border-[var(--color-border-subtle)] opacity-60'
              }`}
            >
              {/* Circuit Info */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: item.active ? 'var(--color-accent-subtle)' : 'var(--color-surface-secondary)',
                    borderColor: item.active ? 'var(--color-accent)' : 'var(--color-border)',
                  }}
                >
                  <Icon size={18} style={{ color: item.active ? 'var(--color-accent)' : 'var(--color-text-muted)' }} />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-[var(--color-text)]">
                      {item.name}
                    </h4>

                    {isCritical ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-[var(--color-danger)] text-white flex items-center gap-1">
                        <ShieldAlert size={10} />
                        <span>Critical Protected</span>
                      </span>
                    ) : (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                          item.priority === 'Essential'
                            ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                            : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                        }`}
                      >
                        {item.priority}
                      </span>
                    )}

                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      {item.room}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)] font-mono">
                    <span>{item.breaker}</span>
                    <span>·</span>
                    <span>PF {item.powerFactor || 0.95}</span>
                    <span>·</span>
                    <span className="text-[var(--color-text-muted)]">Rule: {item.automation}</span>
                  </div>
                </div>
              </div>

              {/* Individual Estimated Cost Breakdown & Relay Controls */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--color-border-subtle)]">
                
                {/* Cost Estimation in INR */}
                <div className="text-right font-mono">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-xs text-[var(--color-text-muted)]">Est. Cost:</span>
                    <span className="text-sm font-bold text-[var(--color-text)]">
                      {formatINR(item.monthlyCostInr)}/mo
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">
                    ~{item.dailyKwh} kWh/day ({formatINR(item.dailyCostInr)}/day)
                  </div>
                </div>

                {/* Draw in kW and Amps */}
                <div className="text-right font-mono min-w-[70px]">
                  <p className="text-sm font-extrabold" style={{ color: item.active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                    {item.active ? `${item.drawKw.toFixed(2)} kW` : '0.00 kW'}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    {item.active ? `~${currentLoadAmps} A` : 'OFFLINE'}
                  </p>
                </div>

                {/* Safe Relay Toggle Trigger */}
                <button
                  type="button"
                  onClick={() => requestRelayToggle(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    item.active
                      ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-surface-selected)]'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-secondary)]'
                  }`}
                  aria-label={`Switch contactor relay for ${item.name}`}
                  title={isCritical ? 'Protected circuit: requires confirmation' : 'Simulate relay switching'}
                >
                  <Power size={13} className={item.active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'} />
                  <span className="font-mono text-[11px]">{item.active ? 'RELAY ON' : 'RELAY SHED'}</span>
                  {item.active ? (
                    <ToggleRight size={18} className="text-[var(--color-accent)]" />
                  ) : (
                    <ToggleLeft size={18} className="text-[var(--color-text-muted)]" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hardware Safety Disclaimer */}
      <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] flex items-start gap-2">
        <Info size={16} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
        <span>
          <strong>Hardware Notice:</strong> Relay switches in this interface trigger an interactive local simulation model.
          Physical contactor switching will be executed via ESP32 GPIO / Modbus contactor modules upon backend integration.
          Critical circuits are guarded with safety confirmation prompts.
        </span>
      </div>
    </div>
  );
}

export default AppliancesPage;

