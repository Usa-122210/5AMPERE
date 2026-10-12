import {
  Activity,
  ArrowDownRight,
  ChevronRight,
  Clock,
  Gauge,
  Info,
  ShieldCheck,
  Sun,
  Zap,
} from 'lucide-react';
import { Surface } from '../ui/Surface';
import { useEnergyData } from '../../context/EnergyDataContext';

/**
 * EnergyOverview — Real-Time Indian Household Consumption, Bill & Generation Metrics.
 *
 * Fully integrated with the unified EnergyDataContext:
 *   - Live kW & Amps at 230V AC (Nominal 50 Hz True-RMS)
 *   - Cumulative consumption (kWh) responding to load switching & time periods
 *   - Progressive slab-calculated electricity cost in Indian Rupees (₹ / INR)
 *   - Transparent DISCOM attribution (UPPCL / State regulatory schedules)
 *   - Optional rooftop solar generation & grid import split
 */
export function EnergyOverview() {
  const {
    metadata,
    totalActiveKw,
    currentAmps,
    selectedPeriodKwh,
    periodEstimate,
    projectedMonthlyBill,
    projectedBillingCycleKwh,
    timeRange,
    setTimeRange,
    activeTariff,
    isTariffVerified,
    openTariffModal,
    solarEnabled,
    setSolarEnabled,
    solarKw,
    gridKw,
    selfSufficiency,
    formatINR,
  } = useEnergyData();

  // Period label for billing display
  const periodLabel = timeRange === 'today' ? 'Today (Est.)' : timeRange === 'week' ? 'This Week (Est.)' : '30-Day Billing Cycle';


  return (
    <div className="space-y-4">
      {/* Top Application Bar with Status & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text)]">
              Energy Overview
            </h2>
          </div>
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded border text-[var(--color-text-secondary)] bg-[var(--color-surface-secondary)] border-[var(--color-border)]"
          >
            Simulated 3BHK Profile · 230V AC
          </span>
        </div>

        {/* Time Window Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] self-start sm:self-auto">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeRange(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeRange === tab.id
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Primary Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Real-Time Active Power */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Power In Use Now</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--color-accent-subtle)]"
              >
                <Zap size={15} style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tight text-[var(--color-text)]">
                {totalActiveKw.toFixed(2)}
              </span>
              <span className="text-xs font-mono font-bold text-[var(--color-text-secondary)]">kW</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] pt-1">
              <span className="font-mono font-medium">{currentAmps} A</span>
              <span>·</span>
              <span className="text-[var(--color-success)] font-medium">Safe Load Level</span>
            </div>
          </div>

          {/* Reference load bar based on Sanctioned Load (5.0 kW) */}
          <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)] space-y-1">
            <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (totalActiveKw / metadata.contractedLoadKw) * 100)}%`,
                  backgroundColor: totalActiveKw > metadata.contractedLoadKw * 0.9 ? 'var(--color-warning)' : 'var(--color-accent)',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
              <span>0 kW</span>
              <span>Meter Limit: {metadata.contractedLoadKw.toFixed(1)} kW</span>
            </div>
          </div>
        </Surface>

        {/* Metric 2: Cumulative Energy */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Electricity Used Today</span>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--color-surface-secondary)]"
              >
                <Activity size={15} style={{ color: 'var(--color-accent)' }} />
              </div>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tight text-[var(--color-text)]">
                {selectedPeriodKwh.toFixed(1)}
              </span>
              <span className="text-xs font-mono font-bold text-[var(--color-text-secondary)]">kWh (Units)</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[var(--color-success)] font-medium pt-1">
              <ArrowDownRight size={14} />
              <span>{periodLabel}</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
            <span>Standby idle draw:</span>
            <span className="font-mono font-bold text-[var(--color-text)]">95 Watts</span>
          </div>
        </Surface>

        {/* Metric 3: Cost & DISCOM Tariff */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {timeRange === 'month' ? 'Projected Monthly Bill' : 'Estimated Electricity Bill'}
              </span>
              <div className="flex items-center gap-1">
                {!isTariffVerified && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[var(--color-warning-subtle)] text-[var(--color-warning)] font-semibold">
                    Demo
                  </span>
                )}
                <button
                  type="button"
                  onClick={openTariffModal}
                  className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-accent)] hover:underline cursor-pointer"
                  title="Change utility or edit rates"
                >
                  {activeTariff.discom.split(' ')[0]} ⚙
                </button>
              </div>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tight text-[var(--color-text)]">
                {formatINR(periodEstimate.allocatedTotal)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] pt-1">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isTariffVerified ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'}`} />
              <span className="truncate">
                Average Rate: <strong>{formatINR(periodEstimate.effectiveEnergyRate)}/unit</strong>
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
            <span>30-Day Estimated Total:</span>
            <span className="font-mono font-bold text-[var(--color-text)]">
              {formatINR(projectedMonthlyBill.totalBill)}
            </span>
          </div>
        </Surface>

        {/* Metric 4: Solar Generation & Self-Sufficiency */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Rooftop Solar</span>
              <button
                type="button"
                onClick={() => setSolarEnabled(!solarEnabled)}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                  solarEnabled
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {solarEnabled ? 'Active' : 'Off (Toggle)'}
              </button>
            </div>

            {solarEnabled ? (
              <>
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tight text-[var(--color-text)]">
                    {solarKw.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--color-text-secondary)]">kW</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] pt-1">
                  <span>Grid Import: <strong>{gridKw.toFixed(2)} kW</strong></span>
                </div>
              </>
            ) : (
              <div className="py-2 space-y-1">
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] block">
                  Grid-Only Connection
                </span>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Standard residential supply. Click &apos;Off&apos; above to preview solar overlay.
                </p>
              </div>
            )}
          </div>

          {/* Self-sufficiency progress */}
          <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)] space-y-1">
            <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${solarEnabled ? selfSufficiency : 0}%`,
                  backgroundColor: 'var(--color-success)',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
              <span>Direct Self-Consumption:</span>
              <span className="font-bold text-[var(--color-text)]">
                {solarEnabled ? `${selfSufficiency}% of Home Load` : '100% Grid Dependent'}
              </span>
            </div>
          </div>
        </Surface>
      </div>

      {/* Active Tariff Schedule Bar & Regulatory Attribution */}
      <Surface variant="secondary" padding="sm" className="border border-[var(--color-border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <Clock size={14} style={{ color: 'var(--color-accent)' }} />
            <span className="font-medium text-[var(--color-text)]">
              Active Utility Tariff:
            </span>
            <button
              type="button"
              onClick={openTariffModal}
              className="font-bold text-[var(--color-accent)] bg-[var(--color-surface)] px-2 py-0.5 rounded border border-[var(--color-border)] font-mono hover:border-[var(--color-accent)] cursor-pointer flex items-center gap-1"
            >
              <span>{activeTariff.name}</span>
              <ChevronRight size={12} />
            </button>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                activeTariff.verified
                  ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent)]'
                  : 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border-[var(--color-warning)]'
              }`}
            >
              {activeTariff.verificationBadge}
            </span>

          </div>

          <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)] font-mono flex-wrap">
            <div className="flex items-center gap-1">
              <span>Slabs:</span>
              <strong className="text-[var(--color-text)]">
                {activeTariff.slabs.map((s) => `₹${s.ratePerKWh.toFixed(2)}`).join(' → ')}
              </strong>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <span>Fixed:</span>
              <strong className="text-[var(--color-text)]">
                {formatINR(activeTariff.fixedChargeRate)}{activeTariff.fixedChargeType === 'per_kw_per_month' ? '/kW/mo' : '/mo'}
              </strong>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <span>Duty:</span>
              <strong className="text-[var(--color-text)]">{activeTariff.electricityDutyPercent}%</strong>
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}
