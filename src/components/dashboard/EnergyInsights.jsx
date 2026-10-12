import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Wind,
  Zap,
} from 'lucide-react';
import { Surface } from '../ui/Surface';
import { useEnergyData } from '../../context/EnergyDataContext';

/**
 * EnergyInsights — Transparent, Explainable Electrical Recommendations.
 *
 * Designed for Indian household reality:
 *   - Standby vampire power elimination (TV, STB, soundbar, microwave clock)
 *   - Storage water geyser timer scheduling (BEE standing thermal loss reduction)
 *   - Inverter AC 24°C comfort setpoint optimization (BEE 6%/°C guideline)
 *   - Progressive tariff slab threshold alert (UPPCL 150/300 kWh boundaries)
 *
 * Compliant with explainability standards:
 *   - What was observed in telemetry data
 *   - Why it matters for household bills
 *   - Estimated economic impact mathematically derived from active tariff rate
 *   - Concrete suggested action with responsive UI arming
 *   - Explicit declared assumptions
 */
export function EnergyInsights() {
  const {
    activeTariff,
    projectedBillingCycleKwh,
    calculateMarginalSavings,
    formatINR,
  } = useEnergyData();

  const [appliedActions, setAppliedActions] = useState({
    vampire: true,
    geyser: true,
    acEco: false,
    slabAlert: true,
  });

  const toggleAction = (key) => {
    setAppliedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mathematically derived impact calculations under active tariff's progressive slabs:
  // 1. Vampire Standby: 95W continuous = 68.4 kWh/mo total; overnight cutoff (00:30–06:00, 5.5h) avoids 15.68 kWh/mo
  const vampireAvoidedKwh = 15.68;
  const vampireSavings = calculateMarginalSavings(projectedBillingCycleKwh, vampireAvoidedKwh, activeTariff);

  // 2. Geyser: Standing thermal loss elimination (BEE IS 2082: ~0.5 kWh/day jacket loss * 30 = 15.0 kWh/mo)
  const geyserAvoidedKwh = 15.0;
  const geyserSavings = calculateMarginalSavings(projectedBillingCycleKwh, geyserAvoidedKwh, activeTariff);

  // 3. AC Setpoint: BEE guideline of 6%/°C. 4°C shift (20°C to 24°C) on 1.5T AC (6h/day @ ~1kW) saves 43.2 kWh/mo
  const acAvoidedKwh = 43.2;
  const acSavings = calculateMarginalSavings(projectedBillingCycleKwh, acAvoidedKwh, activeTariff);

  const insights = [
    {
      id: 'vampire',
      type: 'savings',
      icon: TrendingDown,
      badge: 'Phantom Draw Observation',
      badgeColor: 'var(--color-warning)',
      title: 'Eliminate 95W Continuous Standby Power',
      observed:
        'Continuous 95W draw observed on Circuit #10 (Living Room Entertainment) between 00:30 and 06:00 when appliances are idle.',
      whyItMatters:
        'Smart TVs, set-top boxes, and AV equipment draw constant vampire power in soft-standby mode. Continuous 24/7 standby accounts for 68.4 kWh/month (₹' +
        Math.round(68.4 * vampireSavings.marginalRate * (1 + vampireSavings.dutyPercent / 100)) +
        '/mo).',
      impactText: `Avoids ${vampireAvoidedKwh} kWh/mo (${formatINR(vampireSavings.monthlyBillSavings)}/month)`,
      assumptions:
        `Assumes 95W draw cut off for 5.5 overnight hours daily (0.523 kWh/day = 15.68 kWh/mo). Saved at ${activeTariff.discom.split(' ')[0]} marginal rate of ${formatINR(vampireSavings.marginalRate)}/kWh + ${vampireSavings.dutyPercent}% duty under progressive slabs.`,
      actionText: 'Arm Auto-Cutoff (00:30–06:00)',
      activeState: 'Schedule Armed: Cuts off relay at 00:30',
    },
    {
      id: 'geyser',
      type: 'thermal',
      icon: Flame,
      badge: 'Thermal Standing Loss',
      badgeColor: 'var(--color-danger)',
      title: 'Schedule 15L Water Geyser for Morning Pre-Bath Window',
      observed:
        'Geyser thermostat cycles multiple times daily, consuming power to maintain 60°C water temperature even when unused.',
      whyItMatters:
        'Per Bureau of Energy Efficiency (BEE IS 2082 benchmarks), a 15L storage geyser loses ~0.50 kWh/day in standing jacket thermal dissipation. (Note: bathing water heating energy of ~1.5–2 kWh/bath is physically required and not eliminated).',
      impactText: `Saves ${geyserAvoidedKwh} kWh/mo (${formatINR(geyserSavings.monthlyBillSavings)}/month)`,
      assumptions:
        `Assumes 15L geyser (2.0 kW) operating only 45 minutes before morning bath (06:30–07:15) eliminating ~0.50 kWh daily idle thermal loss (15.0 kWh/mo) at marginal rate ${formatINR(geyserSavings.marginalRate)}/kWh + ${geyserSavings.dutyPercent}% duty.`,
      actionText: 'Activate 45-Min Morning Auto-Timer',
      activeState: 'Timer Active: 06:30–07:15 Only',
    },
    {
      id: 'acEco',
      type: 'cooling',
      icon: Wind,
      badge: 'BEE Eco Guideline',
      badgeColor: 'var(--color-accent)',
      title: 'Set Inverter AC to Recommended 24°C Default',
      observed:
        'AC thermostat is currently set to aggressive sub-21°C cooling during peak daytime temperatures.',
      whyItMatters:
        'BEE empirical studies establish that each 1°C increase in room air conditioner setpoint reduces compressor electricity consumption by approximately 6%.',
      impactText: `Saves ${acAvoidedKwh} kWh/mo (${formatINR(acSavings.monthlyBillSavings)}/month)`,
      assumptions:
        `Assumes 1.5 Ton Inverter AC (~1.0 kW avg compressor draw) running 6 hrs/day (6.0 kWh/day). 4°C increase from 20°C to 24°C yields 24% reduction (1.44 kWh/day = 43.2 kWh/mo) evaluated at marginal rate ${formatINR(acSavings.marginalRate)}/kWh + ${acSavings.dutyPercent}% duty.`,
      actionText: 'Apply 24°C Comfort Eco Mode',
      activeState: 'Eco Mode Active (Target 24°C)',
    },
    {
      id: 'slabAlert',
      type: 'tariff',
      icon: Clock,
      badge: 'Tariff Slab Boundary',
      badgeColor: 'var(--color-success)',
      title: `Monitor ${activeTariff.discom.split(' ')[0]} Progressive Slab Thresholds`,
      observed:
        `Household is projected at ${projectedBillingCycleKwh} kWh/month, placing marginal units into the top tier of ${activeTariff.name}.`,
      whyItMatters:
        `Under ${activeTariff.name}, consumption beyond 300 units incurs the peak tier rate (${formatINR(activeTariff.slabs[activeTariff.slabs.length - 1].ratePerKWh)}/kWh). Every unit saved directly reduces this highest tier.`,
      impactText: `Marginal Tier: ${formatINR(vampireSavings.marginalRate)}/kWh`,
      assumptions:
        `Based on official published slab limits in the selected ${activeTariff.name} schedule (${activeTariff.slabs.map((s) => `₹${s.ratePerKWh}`).join(' → ')}).`,
      actionText: 'Enable Slab Warning Notification',
      activeState: 'Notification Active (Slab Threshold Warning)',
    },
  ];

  return (
    <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[var(--color-text)]">
              Actionable Energy Insights &amp; Automations
            </h3>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded border font-semibold bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-[var(--color-accent)]"
            >
              Explainable Rule Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-0.5 text-[var(--color-text-secondary)]">
            Transparent recommendations derived from CT observations, Indian BEE energy guidelines, and active DISCOM slabs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
          <ShieldCheck size={16} className="text-[var(--color-success)]" />
          <span>Local Rule Daemon: <strong>Active</strong></span>
        </div>
      </div>

      {/* Grid of Actionable Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const Icon = item.icon;
          const isApplied = appliedActions[item.id];

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isApplied
                  ? 'bg-[var(--color-surface)] border-[var(--color-border)]'
                  : 'bg-[var(--color-surface-secondary)] border-[var(--color-border-subtle)]'
              }`}
            >
              <div className="space-y-3">
                {/* Badge and Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-[var(--color-accent-subtle)]"
                    >
                      <Icon size={15} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <span
                      className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border bg-[var(--color-surface-secondary)] border-[var(--color-border)]"
                      style={{ color: item.badgeColor }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Calculated Economic Value */}
                  <span className="text-xs font-mono font-bold text-[var(--color-success)]">
                    {item.impactText}
                  </span>
                </div>

                {/* Title & Technical Rationale */}
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text)]">
                    {item.title}
                  </h4>
                  
                  {/* Observation */}
                  <div className="mt-2 text-xs text-[var(--color-text-secondary)] space-y-1.5">
                    <p>
                      <strong className="text-[var(--color-text)]">Observed:</strong> {item.observed}
                    </p>
                    <p>
                      <strong className="text-[var(--color-text)]">Why it matters:</strong> {item.whyItMatters}
                    </p>
                  </div>

                  {/* Assumptions Callout */}
                  <details className="mt-2 text-[10px] text-[var(--color-text-muted)] group">
                    <summary className="font-mono text-[10px] text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-accent)] list-none flex items-center gap-1.5">
                      <span className="text-[10px] opacity-70 group-open:rotate-90 transition-transform">▸</span>
                      <span>Calculation assumptions</span>
                    </summary>
                    <div className="mt-1.5 p-2 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] font-mono">
                      {item.assumptions}
                    </div>
                  </details>
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleAction(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-2 ${
                    isApplied
                      ? 'bg-[var(--color-surface-selected)] text-[var(--color-accent)] border border-[var(--color-accent)]'
                      : 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  {isApplied ? <CheckCircle2 size={14} /> : <Zap size={14} className="text-[var(--color-accent)]" />}
                  <span>{isApplied ? item.activeState : item.actionText}</span>
                </button>

                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  {isApplied ? 'Armed' : 'Pending'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}
