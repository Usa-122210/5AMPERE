import { useState } from 'react';
import {
  BatteryCharging,
  Flame,
  Lightbulb,
  Power,
  RotateCcw,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  Tv,
  Waves,
  Wind,
  Zap,
} from 'lucide-react';
import { Surface } from '../ui/Surface';
import { Button } from '../ui/Button';
import { useEnergyData } from '../../context/EnergyDataContext';

// Appliance icons map
const APPLIANCE_ICONS = {
  ac: Wind,
  refrigerator: Zap,
  geyser: Flame,
  fans_lighting: Lightbulb,
  washing_machine: Waves,
  entertainment: Tv,
  water_pump: DropletsIcon,
  ev: BatteryCharging,
};

function DropletsIcon(props) {
  return <Waves {...props} />;
}

/**
 * HouseholdLoads — Indian Residential Sub-Circuit Monitoring & Contactor Relays.
 *
 * Real energy management loads panel:
 *   - Circuit breaker channels with real-time amperage (at 230V) and kilowatt draw
 *   - Contactor relay toggle control (demo state simulation updating all dashboard totals)
 *   - Automated load shedding triggers during peak demand or service capacity limits
 *   - Priority classification (Critical, Essential, Discretionary)
 *   - Realistic Indian residential appliances (Inverter AC, Geyser, Fridge, BLDC Fans, Pump)
 */
export function HouseholdLoads() {
  const {
    loads,
    toggleLoad,
    shedPeakLoads,
    restoreAllLoads,
    totalActiveKw,
    currentAmps,
    activeLoadCount,
    metadata,
  } = useEnergyData();

  const [filter, setFilter] = useState('all'); // 'all' | 'heavy' | 'automated'

  // Filtered list
  const filteredLoads = loads.filter((l) => {
    if (filter === 'heavy') return l.isHeavy;
    if (filter === 'automated') return l.automation && !l.automation.includes('Non-Sheddable');
    return true;
  });

  return (
    <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-6">
      {/* Header and Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-(--color-border)">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-(--color-text)">
              Household Loads &amp; Circuit Relays
            </h3>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded border font-semibold bg-(--color-surface-secondary) border-(--color-border) text-(--color-accent)"
            >
              {activeLoadCount} of {loads.length} Circuits Active
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-0.5 text-(--color-text-secondary)">
            Sub-circuit DIN-rail contactors. Toggle switches to simulate hardware load shedding; totals propagate immediately.
          </p>
        </div>

        {/* Quick Automation Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={shedPeakLoads}
            className="text-xs font-medium cursor-pointer"
          >
            <ShieldAlert size={14} className="text-(--color-warning)" />
            <span>Shed Heavy Loads</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={restoreAllLoads}
            className="text-xs text-(--color-text-secondary) hover:text-(--color-text) cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Restore All</span>
          </Button>
        </div>
      </div>

      {/* Filter Pills and Total Active Load Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-(--color-surface-secondary) border border-(--color-border)">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: `All Circuits (${loads.length})` },
            { id: 'heavy', label: 'Heavy Draw (>1 kW)' },
            { id: 'automated', label: 'Automated Rules' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-(--color-surface) text-(--color-text) shadow-xs font-semibold'
                  : 'text-(--color-text-secondary) hover:text-(--color-text)'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Active Power Summary */}
        <div className="flex items-center gap-3 text-xs font-mono self-end sm:self-auto">
          <span className="text-(--color-text-muted)">Active Circuit Power:</span>
          <span className="text-sm font-extrabold text-(--color-accent)">
            {totalActiveKw.toFixed(2)} kW
          </span>
          <span className="text-(--color-text-muted)">
            ({currentAmps} A @ 230V)
          </span>
        </div>
      </div>

      {/* Circuit Devices List */}
      <div className="space-y-3">
        {filteredLoads.map((item) => {
          const Icon = APPLIANCE_ICONS[item.id] || Zap;
          const currentLoadAmps = ((item.drawKw * 1000) / metadata.nominalVoltage).toFixed(1);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.active
                  ? 'bg-(--color-surface) border-(--color-border) shadow-xs'
                  : 'bg-(--color-surface-secondary) border-(--color-border-subtle) opacity-60'
              }`}
            >
              {/* Circuit Info & Breaker */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors border"
                  style={{
                    backgroundColor: item.active ? 'var(--color-accent-subtle)' : 'var(--color-surface-secondary)',
                    borderColor: item.active ? 'var(--color-accent)' : 'var(--color-border)',
                  }}
                >
                  <Icon size={18} style={{ color: item.active ? 'var(--color-accent)' : 'var(--color-text-muted)' }} />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-(--color-text)">
                      {item.name}
                    </h4>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                        item.priority === 'Critical'
                          ? 'bg-(--color-danger) text-white'
                          : item.priority === 'Essential'
                          ? 'bg-(--color-accent-subtle) text-(--color-accent)'
                          : 'bg-(--color-surface-secondary) text-(--color-text-secondary) border border-(--color-border)'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-(--color-surface-secondary) text-(--color-text-muted) border border-(--color-border)">
                      {item.room}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-(--color-text-secondary)">
                    <span className="font-mono text-[11px] text-(--color-text-muted)">{item.breaker}</span>
                    <span>·</span>
                    <span>{item.category}</span>
                  </div>

                  {/* Automation rule note */}
                  <p className="text-[11px] text-(--color-text-muted) font-mono flex items-center gap-1 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent) shrink-0" />
                    <span>Rule: {item.automation}</span>
                  </p>
                </div>
              </div>

              {/* Power Metrics & Interactive Contactor Switch */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-(--color-border-subtle)">
                {/* Wattage & Amperage */}
                <div className="text-right font-mono">
                  <p className="text-base font-extrabold" style={{ color: item.active ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                    {item.active ? `${item.drawKw.toFixed(2)} kW` : '0.00 kW'}
                  </p>
                  <p className="text-[11px] text-(--color-text-muted)">
                    {item.active ? `${currentLoadAmps} A` : 'OFFLINE'}
                  </p>
                </div>

                {/* Contactor Relay Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleLoad(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150 ${
                    item.active
                      ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent) hover:bg-(--color-surface-selected)'
                      : 'bg-(--color-surface) border-(--color-border) text-(--color-text-muted) hover:border-(--color-text-secondary)'
                  }`}
                  aria-label={`Toggle contactor relay for ${item.name}`}
                  title="Simulate contactor relay toggle (illustrative frontend state)"
                >
                  <Power size={14} className={item.active ? 'text-(--color-accent)' : 'text-(--color-text-muted)'} />
                  <span>{item.active ? 'RELAY ON' : 'RELAY SHED'}</span>
                  {item.active ? (
                    <ToggleRight size={18} className="text-(--color-accent)" />
                  ) : (
                    <ToggleLeft size={18} className="text-(--color-text-muted)" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration readiness footer note */}
      <div className="p-2.5 rounded-lg border bg-(--color-surface-secondary) border-(--color-border) text-[11px] text-(--color-text-muted) flex items-center justify-between">
        <span>
          <strong>Hardware Integration Notice:</strong> Relay switches currently toggle local illustrative state. Physical circuit switching will be managed via DIN-rail contactor drivers upon hardware onboarding.
        </span>
      </div>
    </Surface>
  );
}
