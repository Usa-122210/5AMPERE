import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Globe,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Moon,
  Palette,
  Power,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Sliders,
  Sun,
  Zap,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { useEnergyData } from '../context/EnergyDataContext';

export function SettingsPage() {
  const {
    contractedLoadKw,
    setContractedLoadKw,
    activeTariff,
    openTariffModal,
    savingModeBudgetInr,
    setSavingModeBudgetInr,
    savingModeTargetPercent,
    setSavingModeTargetPercent,
    solarEnabled,
    setSolarEnabled,
    solarPeakKw,
    setSolarPeakKw,
    metadata,
    formatINR,
  } = useEnergyData();

  const [notificationToggles, setNotificationToggles] = useState({
    peakDemand: true,
    vampireDraw: true,
    slabWarning: true,
    weeklyReport: false,
  });

  const toggleNotification = (key) => {
    setNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Configuration"
        title="Settings &amp; System Preferences"
        badge="Household Profile"
        description="Configure household sanctioned capacity, electricity tariff parameters, notification thresholds, and experimental simulation features."
      />

      {/* 1. Electrical Connection & Household Profile */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-6">
        <div className="border-b border-[var(--color-border)] pb-4">
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Household Electrical Connection
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Physical connection parameters provided by your state distribution company (DISCOM).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sanctioned Load */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Sanctioned Load (kW)
            </label>
            <div className="flex items-center gap-2">
              {[2, 3, 5, 7, 10].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setContractedLoadKw(kw)}
                  className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold border transition-colors ${
                    contractedLoadKw === kw
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  {kw} kW
                </button>
              ))}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block pt-0.5 font-mono">
              Fixed charge impact: {formatINR(contractedLoadKw * (activeTariff.fixedChargeRate || 110))} per month
            </span>
          </div>

          {/* Connection Specifications (Read-Only Electrical Standards) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Supply Specifications
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-center">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] block">Voltage</span>
                <span className="font-mono font-bold text-xs text-[var(--color-text)]">230V AC</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-center">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] block">Frequency</span>
                <span className="font-mono font-bold text-xs text-[var(--color-text)]">50 Hz</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-center">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] block">Phase</span>
                <span className="font-mono font-bold text-xs text-[var(--color-text)]">Single-Phase</span>
              </div>
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block pt-0.5">
              Standard Indian residential supply specification (IS 12360)
            </span>
          </div>
        </div>
      </Surface>

      {/* 2. Active Tariff & DISCOM Configuration */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
        <div className="border-b border-[var(--color-border)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Active Electricity Tariff
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Tariff schedule applied to consumption slabs, fixed demand charges, and statutory duties.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={openTariffModal}>
            <Sliders size={14} />
            <span>Change Tariff / DISCOM</span>
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-sm text-[var(--color-text)]">
              {activeTariff.discom} ({activeTariff.state})
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                activeTariff.verified
                  ? 'bg-[var(--color-success-subtle, rgba(34, 197, 94, 0.1))] text-[var(--color-success)] border-[var(--color-success)]'
                  : 'bg-[var(--color-warning-subtle, rgba(234, 179, 8, 0.1))] text-[var(--color-warning)] border-[var(--color-warning)]'
              }`}
            >
              {activeTariff.verified ? 'Verified Official Order' : 'Unverified — Demo Only'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border)]">
            <div>
              <span className="text-[10px] text-[var(--color-text-muted)] block">Category</span>
              <span className="text-[var(--color-text)] font-semibold">{activeTariff.consumerCategory || activeTariff.category || 'Domestic LMV-1'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-text-muted)] block">Effective Date</span>
              <span className="text-[var(--color-text)] font-semibold">{activeTariff.effectiveFrom || activeTariff.effectiveDate || 'Active Schedule'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-text-muted)] block">Fixed Charge</span>
              <span className="text-[var(--color-text)] font-semibold">₹{activeTariff.fixedChargeRate || 110}/kW/mo</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--color-text-muted)] block">Electricity Duty</span>
              <span className="text-[var(--color-text)] font-semibold">{activeTariff.electricityDutyPercent}%</span>
            </div>
          </div>
        </div>
      </Surface>

      {/* 3. Experimental Features & Hardware Simulation */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-6">
        <div className="border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Experimental Simulation Prototypes
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)] font-semibold">
              Prototype Only
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Features marked as experimental illustrate future platform capabilities and are explicitly modeled in software.
          </p>
        </div>

        {/* Solar Rooftop Simulation */}
        <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-amber-500">
                <Sun size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--color-text)] block">
                  Simulated Rooftop Solar Generation Overlay
                </span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  Illustrative bell-curve generation overlay for self-consumption modeling.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={solarEnabled}
              onChange={(e) => setSolarEnabled(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer mt-1"
            />
          </div>

          {solarEnabled && (
            <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--color-text-secondary)]">Simulated Solar Peak Capacity:</span>
                <span className="font-mono font-bold text-[var(--color-accent)]">{solarPeakKw.toFixed(1)} kWp</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={solarPeakKw}
                onChange={(e) => setSolarPeakKw(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
                <span>1.0 kWp (Compact)</span>
                <span>2.0 kWp (Typical 3BHK)</span>
                <span>5.0 kWp (Full Roof)</span>
              </div>
            </div>
          )}
        </div>
      </Surface>

      {/* 4. Notification Preferences */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--color-text)]">
            Notification &amp; Alert Preferences
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Configure push notifications for household demand thresholds and anomalies.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              id: 'peakDemand',
              label: 'Sanctioned Demand Overload Warning',
              desc: 'Notify when instantaneous load exceeds 50% of 5.0 kW contracted capacity.',
            },
            {
              id: 'vampireDraw',
              label: 'Overnight Vampire Power Alert',
              desc: 'Alert when idle night-time standby power exceeds 50W continuously.',
            },
            {
              id: 'slabWarning',
              label: 'Progressive Slab Tier Proximity Alert',
              desc: 'Notify when 30-day projected usage approaches within 20 kWh of higher slab.',
            },
            {
              id: 'weeklyReport',
              label: 'Weekly Energy Consumption Summary',
              desc: 'Receive a weekly digest of kWh consumed and estimated rupee costs.',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs"
            >
              <div>
                <span className="font-bold text-[var(--color-text)] block">{item.label}</span>
                <span className="text-[11px] text-[var(--color-text-secondary)]">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={notificationToggles[item.id]}
                onChange={() => toggleNotification(item.id)}
                className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer shrink-0 ml-3"
              />
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}
export default SettingsPage;

