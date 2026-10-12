import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Clock,
  Cpu,
  Flame,
  Info,
  Layers,
  Leaf,
  Lock,
  Power,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  Sparkles,
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

export function SavingModePage() {
  const {
    isSavingModeActive,
    toggleSavingMode,
    savingModeTargetPercent,
    setSavingModeTargetPercent,
    savingModeBudgetInr,
    setSavingModeBudgetInr,
    projectedMonthlyBill,
    totalActiveKw,
    totalActiveWatts,
    loadsWithCosts,
    shedPeakLoads,
    restoreAllLoads,
    formatINR,
    activeTariff,
  } = useEnergyData();

  // Local state for automation rule toggles
  const [activeRules, setActiveRules] = useState({
    vampireCutoff: true,
    geyserTimer: true,
    acEcoSetpoint: true,
    peakLimiter: false,
  });

  const toggleRule = (ruleKey) => {
    setActiveRules((prev) => ({ ...prev, [ruleKey]: !prev[ruleKey] }));
  };

  // Calculations for budget and target savings
  const currentProjectedBill = projectedMonthlyBill?.totalBill || 0;
  const targetSavingsInr = Math.round(currentProjectedBill * (savingModeTargetPercent / 100));
  const optimizedProjectedBill = Math.max(0, currentProjectedBill - targetSavingsInr);
  const budgetUtilizationPercent = savingModeBudgetInr > 0
    ? Math.round((currentProjectedBill / savingModeBudgetInr) * 100)
    : 100;

  // Filter heavy and controllable loads for savings analysis
  const sortedLoads = [...loadsWithCosts].sort((a, b) => b.drawKw - a.drawKw);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Optimization"
        title="Saving Mode"
        badge={isSavingModeActive ? 'Active (-15% Simulated Draw)' : 'Standby'}
        badgeColor={isSavingModeActive ? 'var(--color-success)' : undefined}
        description="Configure target monthly electricity budgets, automated load shedding schedules, and circuit priorities to reduce consumption while safeguarding critical household circuits."
      >
        <div className="flex items-center gap-2">
          <Button
            variant={isSavingModeActive ? 'primary' : 'secondary'}
            onClick={() => toggleSavingMode()}
          >
            <Leaf size={16} />
            <span>{isSavingModeActive ? 'Saving Mode: Active' : 'Enable Saving Mode'}</span>
          </Button>
        </div>
      </PageHeader>

      {/* 1. Smart Demand Management Control Bar */}
      <div className="p-4 rounded-2xl border bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: isSavingModeActive ? 'var(--color-accent-subtle)' : 'var(--color-surface-secondary)',
              borderColor: isSavingModeActive ? 'var(--color-accent)' : 'var(--color-border)',
            }}
          >
            <Leaf size={20} style={{ color: isSavingModeActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)]">
                Smart Demand Response
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                Simulation Model
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Automates peak load reduction by shedding non-essential circuits (Geyser, EV Charger) while keeping critical refrigeration running.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={restoreAllLoads}>
            <RotateCcw size={14} />
            <span>Restore All</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={shedPeakLoads}>
            <Power size={14} />
            <span>Shed Heavy Loads</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Master Mode Status */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Master Status</span>
            <span
              className={`w-2.5 h-2.5 rounded-full ${isSavingModeActive ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-text-muted)]'}`}
            />
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-[var(--color-text)]">
              {isSavingModeActive ? 'ACTIVE' : 'STANDBY'}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block mt-0.5">
              {isSavingModeActive ? 'Discretionary circuits shed' : 'Full demand profile running'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleSavingMode()}
            className="flex items-center gap-2 text-xs font-bold text-[var(--color-accent)] hover:underline self-start pt-1"
          >
            <span>{isSavingModeActive ? 'Deactivate Mode' : 'Activate Mode'}</span>
            <ArrowRight size={12} />
          </button>
        </Surface>

        {/* Metric 2: Monthly Electricity Budget */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Configured Budget</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
              Configurable Demo
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-[var(--color-text)]">
              {formatINR(savingModeBudgetInr)}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block mt-0.5">
              Household monthly ceiling
            </span>
          </div>
          <div className="pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-[var(--color-text-secondary)]">Pacing</span>
              <span className={budgetUtilizationPercent > 100 ? 'text-[var(--color-danger)] font-bold' : 'text-[var(--color-success)] font-bold'}>
                {budgetUtilizationPercent}% of limit
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, budgetUtilizationPercent)}%`,
                  backgroundColor: budgetUtilizationPercent > 100 ? 'var(--color-danger)' : 'var(--color-accent)',
                }}
              />
            </div>
          </div>
        </Surface>

        {/* Metric 3: Target Reduction Goal */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Target Reduction</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]">
              -{savingModeTargetPercent}%
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-[var(--color-accent)]">
              {formatINR(targetSavingsInr)}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block mt-0.5">
              Targeted monthly savings
            </span>
          </div>
          <span className="text-[11px] text-[var(--color-text-secondary)] pt-1">
            Goal bill: <span className="font-mono font-bold text-[var(--color-text)]">{formatINR(optimizedProjectedBill)}</span>
          </span>
        </Surface>

        {/* Metric 4: Protected Circuits Count */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Circuit Protection</span>
            <ShieldCheck size={16} className="text-[var(--color-success)]" />
          </div>
          <div>
            <div className="text-xl font-mono font-bold text-[var(--color-text)]">
              1 Critical Lock
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block mt-0.5">
              Refrigerator circuit exempt
            </span>
          </div>
          <span className="text-[11px] text-[var(--color-success)] font-medium pt-1">
            Food spoilage protection active
          </span>
        </Surface>
      </div>

      {/* 3. Budget & Target Goal Controls */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-6">
        <div className="border-b border-[var(--color-border)] pb-4">
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Budget Ceiling &amp; Consumption Targets
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Adjust your monthly electricity spend target. Note: ₹4,500 is an initial configurable demo baseline for a 3BHK Indian home under {activeTariff.discom.split(' ')[0]} tariffs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Control A: Monthly Budget Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Monthly Electricity Budget (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-sm text-[var(--color-text-secondary)]">
                ₹
              </span>
              <input
                type="number"
                min="1000"
                max="25000"
                step="500"
                value={savingModeBudgetInr}
                onChange={(e) => setSavingModeBudgetInr(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border font-mono font-bold text-base bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-[var(--color-text)] focus:outline-hidden focus:border-[var(--color-accent)]"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] pt-1">
              <span>Current projection: {formatINR(currentProjectedBill)}</span>
              <span>Diff: {currentProjectedBill > savingModeBudgetInr ? `+${formatINR(currentProjectedBill - savingModeBudgetInr)} over` : `${formatINR(savingModeBudgetInr - currentProjectedBill)} within`}</span>
            </div>
          </div>

          {/* Control B: Target Reduction Percentage Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Target Reduction Goal
              </label>
              <span className="font-mono font-bold text-sm text-[var(--color-accent)]">
                {savingModeTargetPercent}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={savingModeTargetPercent}
              onChange={(e) => setSavingModeTargetPercent(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-mono pt-1">
              <span>5% (Conservative)</span>
              <span>15% (Recommended)</span>
              <span>30% (Aggressive)</span>
            </div>
          </div>
        </div>
      </Surface>

      {/* 4. Automated Energy Saving Rules & Schedules */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-6">
        <div className="border-b border-[var(--color-border)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Automated Schedule &amp; Shedding Rules
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Simulated rules applied when Saving Mode is enabled. Critical circuits remain locked.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] self-start sm:self-auto">
            {Object.values(activeRules).filter(Boolean).length} of 4 Rules Armed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Rule 1: Overnight Vampire Standby */}
          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)]">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text)]">
                    Overnight Phantom Cutoff
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                    00:30 – 06:00 Daily
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleRule('vampireCutoff')}
                className="text-[var(--color-accent)]"
              >
                {activeRules.vampireCutoff ? <ToggleRight size={26} /> : <ToggleLeft size={26} className="text-[var(--color-text-muted)]" />}
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Cuts relay power to entertainment cluster and idle appliances during sleeping hours, eliminating continuous 95W standby draw.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Circuit #10 (Entertainment)</span>
              <span className="text-[var(--color-success)] font-bold">~15.7 kWh / ~₹110/mo</span>
            </div>
          </div>

          {/* Rule 2: Water Geyser Pre-Bath Timer */}
          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-warning)]">
                  <Flame size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text)]">
                    Geyser Pre-Bath Window Timer
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                    06:30 – 07:15 Morning Only
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleRule('geyserTimer')}
                className="text-[var(--color-accent)]"
              >
                {activeRules.geyserTimer ? <ToggleRight size={26} /> : <ToggleLeft size={26} className="text-[var(--color-text-muted)]" />}
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Restricts 2.0 kW storage geyser to 45 minutes before morning bathing, preventing continuous thermostat cycling and standing jacket thermal loss (BEE IS 2082).
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Circuit #03 (Water Geyser)</span>
              <span className="text-[var(--color-success)] font-bold">~15.0 kWh / ~₹105/mo</span>
            </div>
          </div>

          {/* Rule 3: AC Comfort Setpoint 24°C */}
          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)]">
                  <Wind size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text)]">
                    Inverter AC 24°C Comfort Setting
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                    BEE Standard Guideline
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleRule('acEcoSetpoint')}
                className="text-[var(--color-accent)]"
              >
                {activeRules.acEcoSetpoint ? <ToggleRight size={26} /> : <ToggleLeft size={26} className="text-[var(--color-text-muted)]" />}
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Recommends maintaining thermostat at 24°C instead of 20°C. Per BEE guidelines, every 1°C increase reduces compressor power consumption by approximately 6%.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Circuit #01 (Master AC)</span>
              <span className="text-[var(--color-success)] font-bold">~43.2 kWh / ~₹302/mo</span>
            </div>
          </div>

          {/* Rule 4: Peak Demand Threshold Limiter */}
          <div className="p-4 rounded-xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-danger)]">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text)]">
                    Sanctioned Load Threshold Limiter
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                    Trigger at &gt; 3.5 kW (70% of 5.0 kW)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleRule('peakLimiter')}
                className="text-[var(--color-accent)]"
              >
                {activeRules.peakLimiter ? <ToggleRight size={26} /> : <ToggleLeft size={26} className="text-[var(--color-text-muted)]" />}
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Automatically sheds discretionary loads (EV charger, geyser) if total active demand approaches sanctioned capacity, avoiding utility peak penalty charges.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-muted)]">Prevents Sanctioned Overload</span>
              <span className="text-[var(--color-text)] font-bold">Demand Protection</span>
            </div>
          </div>

        </div>
      </Surface>

      {/* 5. Ranked Appliance Consumption & Savings Potential Table */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Appliance Consumption Breakdown &amp; Critical Circuit Status
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Individual appliance cost is derived from daily operational hours multiplied by active tariff rate. Critical circuits are locked from automated shedding.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Appliance Circuit</th>
                <th className="py-2.5 px-3">Priority Class</th>
                <th className="py-2.5 px-3">Draw</th>
                <th className="py-2.5 px-3">Daily Run</th>
                <th className="py-2.5 px-3">Monthly Energy</th>
                <th className="py-2.5 px-3">Monthly Cost</th>
                <th className="py-2.5 px-3 text-right">Saving Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {sortedLoads.map((item) => {
                const isCritical = item.priority === 'Critical';
                const isDiscretionary = item.priority === 'Discretionary';

                return (
                  <tr key={item.id} className="hover:bg-[var(--color-surface-secondary)] transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--color-text)]">{item.name}</span>
                        {isCritical && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border border-[var(--color-danger)]">
                            <Lock size={9} />
                            Locked
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--color-text-muted)]">{item.category}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isCritical
                            ? 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]'
                            : isDiscretionary
                            ? 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                            : 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[var(--color-text)]">
                      {item.drawKw.toFixed(2)} kW
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[var(--color-text-secondary)]">
                      {item.dailyRunHours}h / day
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[var(--color-text)]">
                      {item.monthlyKwh} kWh
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--color-text)]">
                      {formatINR(item.monthlyCostInr)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {isCritical ? (
                        <span className="text-[var(--color-text-muted)] text-[11px]">Exempt (Protected)</span>
                      ) : isDiscretionary ? (
                        <span className="text-[var(--color-success)] font-bold">High (Sheddable)</span>
                      ) : (
                        <span className="text-[var(--color-accent)] font-semibold">Moderate</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}
export default SavingModePage;

