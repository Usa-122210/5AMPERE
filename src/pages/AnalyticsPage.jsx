import { useState, useMemo } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  Compass,
  Cpu,
  Flame,
  HelpCircle,
  Info,
  Layers,
  PieChart,
  Sun,
  TrendingDown,
  TrendingUp,
  Wind,
  Zap,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { EnergyUsageTrends } from '../components/dashboard/EnergyUsageTrends';
import { useEnergyData } from '../context/EnergyDataContext';

export function AnalyticsPage() {
  const {
    timeRange,
    setTimeRange,
    dailyKwh,
    weeklyKwh,
    projectedBillingCycleKwh,
    selectedPeriodKwh,
    periodEstimate,
    loadsWithCosts,
    formatINR,
    activeTariff,
  } = useEnergyData();

  // Calculate appliance share percentages
  const totalMonthlyApplianceKwh = useMemo(() => {
    return loadsWithCosts.reduce((sum, item) => sum + (item.monthlyKwh || 0), 0);
  }, [loadsWithCosts]);

  const appliancesWithShare = useMemo(() => {
    return loadsWithCosts.map((item) => {
      const share = totalMonthlyApplianceKwh > 0
        ? Math.round(((item.monthlyKwh || 0) / totalMonthlyApplianceKwh) * 100)
        : 0;
      return {
        ...item,
        sharePercent: share,
      };
    }).sort((a, b) => b.sharePercent - a.sharePercent);
  }, [loadsWithCosts, totalMonthlyApplianceKwh]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Analytics"
        title="Energy Analytics &amp; Load History"
        badge="Diurnal CT Profile"
        description="Detailed historical trends, 24-hour diurnal load curves, and appliance consumption distribution for household energy auditing."
      >
        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
          {[
            { id: 'today', label: 'Today (24h)' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: '30-Day Cycle' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeRange === t.id
                  ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-bold shadow-xs border border-[var(--color-border)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* 1. Period High-Level Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Selected Period Energy */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Period Consumption</span>
            <Activity size={16} className="text-[var(--color-accent)]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--color-text)]">
            {selectedPeriodKwh}
            <span className="text-xs font-normal text-[var(--color-text-secondary)]"> kWh</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] font-mono capitalize">
            {timeRange} window totals
          </div>
        </Surface>

        {/* Metric 2: Selected Period Cost */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Calculated Period Cost</span>
            <TrendingUp size={16} className="text-[var(--color-accent)]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--color-text)]">
            {formatINR(periodEstimate.allocatedTotal)}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] font-mono">
            At {formatINR(periodEstimate.effectiveEnergyRate)}/kWh effective
          </div>
        </Surface>

        {/* Metric 3: Peak Recorded Demand */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Diurnal Peak Demand</span>
            <ArrowUpRight size={16} className="text-[var(--color-warning)]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--color-warning)]">
            2.65
            <span className="text-xs font-normal text-[var(--color-text-secondary)]"> kW</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] font-mono">
            Occurs 20:00 (Evening peak)
          </div>
        </Surface>

        {/* Metric 4: Vampire Standby Floor */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Vampire Standby Floor</span>
            <Clock size={16} className="text-[var(--color-text-secondary)]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--color-text)]">
            95
            <span className="text-xs font-normal text-[var(--color-text-secondary)]"> Watts</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] font-mono">
            00:30–06:00 idle baseline
          </div>
        </Surface>
      </div>

      {/* 2. Interactive 24-Hour Load Curve Component */}
      <EnergyUsageTrends />

      {/* 3. Diurnal Peak Analysis & Time-of-Use Patterns */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Diurnal Load Profile Breakdown
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Key operational phases across a typical 24-hour cycle in an Indian household.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-text-secondary)]">
                Phase 1: Night Base
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">00:00 – 06:00</span>
            </div>
            <div className="text-sm font-bold text-[var(--color-text)]">
              Phantom Standby Floor
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Refrigerator compressor cycles periodically; entertainment cluster draws constant 95W standby. Average load ~0.25 kW.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-warning)]">
                Phase 2: Morning Rush
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">06:00 – 09:00</span>
            </div>
            <div className="text-sm font-bold text-[var(--color-text)]">
              Water Heating Peak
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              2.0 kW storage geyser operates alongside water pump and kitchen appliances. Spikes demand to 2.40 kW.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-text-secondary)]">
                Phase 3: Daytime
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">09:00 – 18:00</span>
            </div>
            <div className="text-sm font-bold text-[var(--color-text)]">
              Baseline &amp; Solar Opportunity
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Moderate daytime consumption (~0.85 kW). Prime window for rooftop solar self-consumption and battery charging.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--color-danger)]">
                Phase 4: Evening Peak
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">18:00 – 23:00</span>
            </div>
            <div className="text-sm font-bold text-[var(--color-text)]">
              Cooling &amp; Family Load
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Simultaneous operation of 1.5T inverter AC, lighting, television, and dinner preparation pushes load to 2.65 kW.
            </p>
          </div>

        </div>
      </Surface>

      {/* 4. Appliance Consumption Share Breakdown */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Appliance Consumption Distribution
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Share of total household energy consumption attributed to individual circuits.
          </p>
        </div>

        <div className="space-y-3">
          {appliancesWithShare.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--color-text)]">{item.name}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">({item.category})</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[var(--color-text-secondary)]">{item.monthlyKwh} kWh/mo</span>
                  <span className="font-bold text-[var(--color-text)]">{formatINR(item.monthlyCostInr)}/mo</span>
                  <span className="font-bold text-[var(--color-accent)] w-10 text-right">{item.sharePercent}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-[var(--color-surface)] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent)] transition-all duration-300"
                  style={{ width: `${item.sharePercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}
export default AnalyticsPage;

