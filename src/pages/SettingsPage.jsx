import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
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

  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleNotification = (key) => {
    setNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Configuration"
        title="Settings &amp; Preferences"
        badge="Household Setup"
        description="Set your meter capacity, electricity provider rates, monthly spending target, and alerts."
      />

      {/* =========================================================================
          SECTION 1: ESSENTIAL HOUSEHOLD CONFIGURATION (Requirement 5)
          ========================================================================= */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-1">
          Essential Household Settings
        </h2>

        {/* 1. Sanctioned Meter Capacity */}
        <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Meter Capacity (Sanctioned Load)
              </h3>
              <span className="font-mono font-bold text-sm text-[var(--color-accent)]">
                {contractedLoadKw} kW
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              The sanctioned capacity approved on your electricity bill (typically 5 kW for 2–3 BHK homes in Uttar Pradesh).
            </p>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 5, 7, 10].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setContractedLoadKw(kw)}
                  className={`py-2.5 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer ${
                    contractedLoadKw === kw
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-xs'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  {kw} kW
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)] pt-1">
              <span>Fixed monthly meter charge:</span>
              <span className="font-bold text-[var(--color-text)]">
                {formatINR(contractedLoadKw * (activeTariff.fixedChargeRate || 110))} / month
              </span>
            </div>
          </div>
        </Surface>

        {/* 2. Electricity Provider (DISCOM) & Tariff Rates */}
        <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-3">
            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Electricity Provider &amp; Rates
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                The utility company supplying power and the official tariff rates used for your bill calculations.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={openTariffModal}>
              <Sliders size={14} />
              <span>Change Provider / Edit Rates</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
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
                  {activeTariff.verified ? 'Verified Official Schedule' : 'Demo Only'}
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-secondary)] block mt-1">
                Category: {activeTariff.consumerCategory || activeTariff.category || 'Domestic LMV-1'} · Rates: ₹{activeTariff.slabs[0]?.ratePerKWh.toFixed(2)} to ₹{activeTariff.slabs[activeTariff.slabs.length - 1]?.ratePerKWh.toFixed(2)} / unit
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-[var(--color-text-muted)] block">Fixed Rate:</span>
              <span className="text-xs font-mono font-bold text-[var(--color-text)]">
                ₹{activeTariff.fixedChargeRate || 110}/kW/mo + {activeTariff.electricityDutyPercent}% Duty
              </span>
            </div>
          </div>
        </Surface>

        {/* 3. Monthly Spending Budget */}
        <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Monthly Spending Budget Target
              </h3>
              <span className="font-mono font-bold text-base text-[var(--color-accent)]">
                {formatINR(savingModeBudgetInr)}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Your household target for monthly electricity expenditure. Savings Mode uses this ceiling to suggest load reductions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--color-text-muted)]">₹</span>
            <input
              type="number"
              step="100"
              min="1000"
              max="20000"
              value={savingModeBudgetInr}
              onChange={(e) => setSavingModeBudgetInr(Math.max(500, Number(e.target.value)))}
              className="flex-1 p-2.5 rounded-xl border font-mono text-sm font-bold bg-[var(--color-surface-secondary)] border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
            />
            <div className="flex items-center gap-1">
              {[3500, 4500, 6000].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSavingModeBudgetInr(b)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-mono font-semibold border cursor-pointer ${
                    savingModeBudgetInr === b
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  ₹{b}
                </button>
              ))}
            </div>
          </div>
        </Surface>

        {/* 4. Household Alert Preferences */}
        <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Alerts &amp; Notifications
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Choose which alerts you want to receive to protect appliances and avoid bill spikes.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'peakDemand',
                label: 'High Power Overload Warning',
                desc: 'Warn when simultaneous appliances draw more than 50% of your meter capacity.',
              },
              {
                id: 'vampireDraw',
                label: 'Overnight Standby Waste Alert',
                desc: 'Notify if televisions, set-top boxes, or appliances waste idle power overnight.',
              },
              {
                id: 'slabWarning',
                label: 'Higher Tariff Slab Approaching',
                desc: 'Alert when your monthly usage is within 20 units of crossing into a higher rate tier.',
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

      {/* =========================================================================
          SECTION 2: ADVANCED & TECHNICAL OPTIONS (Requirement 5)
          ========================================================================= */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border bg-[var(--color-surface)] border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] hover:border-[var(--color-accent)] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[var(--color-accent)]" />
            <span>Advanced Technical &amp; Hardware Options</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] font-normal">
              {showAdvanced ? 'Visible' : 'Click to Expand'}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
          />
        </button>

        {showAdvanced && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* A. Hardware Connection Mode (Requirement 7) */}
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text)]">
                    Hardware Telemetry Connection
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Physical sensor telemetry mode vs calibrated local simulation.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold">
                  Simulated Demo
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--color-text)]">Current Data Source:</span>
                  <span className="font-mono text-[var(--color-text-secondary)]">Calibrated Indian 3BHK Simulation Engine</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--color-text)]">Physical CT Clamps:</span>
                  <span className="text-[var(--color-text-muted)]">Not Connected (Demo Mode)</span>
                </div>
              </div>
            </Surface>

            {/* B. Indian Residential Electrical Standard */}
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-3">
              <div>
                <h4 className="text-sm font-bold text-[var(--color-text)]">
                  Grid Supply Specifications (IS 12360)
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Standard Indian single-phase residential electrical supply characteristics.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-center">
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] block">Nominal Voltage</span>
                  <span className="font-mono font-bold text-xs text-[var(--color-text)]">230V AC</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-center">
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] block">Grid Frequency</span>
                  <span className="font-mono font-bold text-xs text-[var(--color-text)]">50 Hz</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-center">
                  <span className="text-[10px] font-mono text-[var(--color-text-muted)] block">Phase Configuration</span>
                  <span className="font-mono font-bold text-xs text-[var(--color-text)]">Single-Phase</span>
                </div>
              </div>
            </Surface>

            {/* C. Solar Simulation Prototype */}
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[var(--color-text)]">
                      Simulated Rooftop Solar Generation
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)] font-semibold text-[var(--color-text-muted)]">
                      Prototype Only
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Optional mathematical model showing self-consumption with solar panels.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={solarEnabled}
                  onChange={(e) => setSolarEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-accent)] cursor-pointer"
                />
              </div>

              {solarEnabled && (
                <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-2">
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
            </Surface>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
