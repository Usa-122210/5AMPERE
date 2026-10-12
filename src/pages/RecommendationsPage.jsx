import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  Coins,
  Cpu,
  Flame,
  HelpCircle,
  Info,
  Lightbulb,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingDown,
  Wind,
  Zap,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { EnergyInsights } from '../components/dashboard/EnergyInsights';
import { useEnergyData } from '../context/EnergyDataContext';

export function RecommendationsPage() {
  const {
    activeTariff,
    projectedBillingCycleKwh,
    calculateMarginalSavings,
    formatINR,
  } = useEnergyData();

  // What-If Simulator Interactive State
  const [acTempShift, setAcTempShift] = useState(4); // 4°C shift from 20°C to 24°C
  const [geyserMinsReduction, setGeyserMinsReduction] = useState(30); // 30 minutes reduction
  const [enableVampireCutoff, setEnableVampireCutoff] = useState(true);
  const [enableLedUpgrade, setEnableLedUpgrade] = useState(false);

  // Compute what-if avoided kWh:
  // 1. AC Setpoint: BEE guideline 6% per °C. 1.5T AC draws ~1.0 kW avg across 6h/day = 180 kWh/mo base.
  // Saved kWh = 180 * (acTempShift * 0.06)
  const simAcKwh = useMemo(() => {
    return Math.round(180 * (acTempShift * 0.06) * 10) / 10;
  }, [acTempShift]);

  // 2. Geyser: 2.0 kW element run for X minutes less per day = 2.0 * (mins/60) * 30 days
  const simGeyserKwh = useMemo(() => {
    return Math.round(2.0 * (geyserMinsReduction / 60) * 30 * 10) / 10;
  }, [geyserMinsReduction]);

  // 3. Vampire cutoff: 95W * 5.5h/day * 30 days = 15.68 kWh
  const simVampireKwh = enableVampireCutoff ? 15.68 : 0;

  // 4. LED lighting upgrade: 100W saved * 5h/day * 30 = 15 kWh
  const simLedKwh = enableLedUpgrade ? 15.0 : 0;

  // Total avoided kWh in simulator
  const totalSimAvoidedKwh = Math.round((simAcKwh + simGeyserKwh + simVampireKwh + simLedKwh) * 10) / 10;

  // Marginal financial savings
  const simSavings = useMemo(() => {
    return calculateMarginalSavings(projectedBillingCycleKwh, totalSimAvoidedKwh, activeTariff);
  }, [projectedBillingCycleKwh, totalSimAvoidedKwh, activeTariff, calculateMarginalSavings]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Intelligence"
        title="AI Insights &amp; Recommendations"
        badge="BEE Calibrated Guidelines"
        description="Explainable, rule-backed electrical optimizations derived from Bureau of Energy Efficiency standards and your utility's progressive tariff slabs."
      />

      {/* 1. What-If Interactive Savings Simulator */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-6">
        <div className="border-b border-[var(--color-border)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent)] flex items-center justify-center text-[var(--color-accent)]">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Interactive "What-If" Savings Simulator
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Simulate lifestyle adjustments to see exact marginal rupee savings under your top electricity slab.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] block">Simulated Monthly Savings</span>
              <span className="text-xl font-mono font-extrabold text-[var(--color-success)]">
                {formatINR(simSavings.monthlyBillSavings)}
              </span>
            </div>
          </div>
        </div>

        {/* Simulator Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Lever 1: AC Setpoint Shift */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind size={16} className="text-[var(--color-accent)]" />
                <span className="text-xs font-bold text-[var(--color-text)]">
                  Inverter AC Thermostat Adjustment
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[var(--color-accent)]">
                +{acTempShift}°C ({20 + acTempShift}°C)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={acTempShift}
              onChange={(e) => setAcTempShift(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
              <span>0°C (20°C cold)</span>
              <span>+4°C (24°C BEE Eco)</span>
              <span>+6°C (26°C Max)</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--color-border)] font-mono">
              <span className="text-[var(--color-text-secondary)]">Avoids ~{simAcKwh} kWh/mo</span>
              <span className="text-[var(--color-success)] font-bold">
                {formatINR(calculateMarginalSavings(projectedBillingCycleKwh, simAcKwh, activeTariff).monthlyBillSavings)}/mo
              </span>
            </div>
          </div>

          {/* Lever 2: Geyser Heating Reduction */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[var(--color-warning)]" />
                <span className="text-xs font-bold text-[var(--color-text)]">
                  Geyser Run Time Reduction
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[var(--color-warning)]">
                -{geyserMinsReduction} Mins/Day
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="15"
              value={geyserMinsReduction}
              onChange={(e) => setGeyserMinsReduction(Number(e.target.value))}
              className="w-full accent-[var(--color-warning)] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
              <span>0 min</span>
              <span>-30 min</span>
              <span>-60 min</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--color-border)] font-mono">
              <span className="text-[var(--color-text-secondary)]">Avoids ~{simGeyserKwh} kWh/mo</span>
              <span className="text-[var(--color-success)] font-bold">
                {formatINR(calculateMarginalSavings(projectedBillingCycleKwh, simGeyserKwh, activeTariff).monthlyBillSavings)}/mo
              </span>
            </div>
          </div>

          {/* Lever 3: Vampire Standby Cutoff */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)]">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--color-text)] block">
                  Nighttime Vampire Cutoff (00:30–06:00)
                </span>
                <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                  Avoids 15.7 kWh/mo idle 95W draw
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableVampireCutoff}
              onChange={(e) => setEnableVampireCutoff(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer"
            />
          </div>

          {/* Lever 4: Lighting Upgrade to LED */}
          <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)]">
                <Lightbulb size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--color-text)] block">
                  Full LED Luminaire Retrofit
                </span>
                <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                  Avoids 15.0 kWh/mo lighting energy
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={enableLedUpgrade}
              onChange={(e) => setEnableLedUpgrade(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer"
            />
          </div>

        </div>

        {/* Simulator Results Footer */}
        <div className="p-4 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-[var(--color-text)]">
              Total Simulated Impact: {totalSimAvoidedKwh} kWh / month reduction
            </span>
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
              Calculated at marginal tariff rate {formatINR(simSavings.marginalRate)}/kWh + {simSavings.dutyPercent}% state electricity duty.
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono font-extrabold text-base text-[var(--color-accent)]">
              {formatINR(simSavings.monthlyBillSavings)} / month saved
            </span>
          </div>
        </div>
      </Surface>

      {/* 2. Structured Explainable Recommendations (EnergyInsights Component) */}
      <EnergyInsights />
    </div>
  );
}
export default RecommendationsPage;

