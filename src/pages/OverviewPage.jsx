import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Cpu,
  Flame,
  Info,
  Leaf,
  Lightbulb,
  Receipt,
  ShieldCheck,
  Zap,
  Wrench,
  Clock,
  Package,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { EnergyOverview } from '../components/dashboard/EnergyOverview';
import { useEnergyData } from '../context/EnergyDataContext';
import { useAuth } from '../context/AuthContext';

export function OverviewPage() {
  const {
    loads,
    isSavingModeActive,
    toggleSavingMode,
    savingModeTargetPercent,
    alerts,
    formatINR,
    periodEstimate,
    totalActiveKw,
  } = useEnergyData();

  const { activeCustomerHome, marketplaceHardware } = useAuth();

  // Active vs inactive appliances
  const activeLoads = loads.filter((l) => l.active);
  const inactiveLoads = loads.filter((l) => !l.active);

  const installedDevices = activeCustomerHome?.installedDevices || [];
  const requestedDevices = activeCustomerHome?.requestedDevices || [];
  const isInstallationPending =
    activeCustomerHome?.installationStatus === 'pending_assessment' ||
    activeCustomerHome?.installationStatus === 'visit_scheduled';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Home"
        title="Home Electricity Dashboard"
        badge={activeCustomerHome?.locality || 'Simulated 3BHK Profile'}
        badgeColor="var(--color-warning)"
        description="Monitor how much electricity your home is using today, track your estimated bill, and see simple ways to save money."
      >
        <Link to="/saving-mode">
          <Button variant={isSavingModeActive ? 'primary' : 'secondary'} size="sm">
            <Leaf size={14} />
            <span>Savings Mode: {isSavingModeActive ? 'Active (-15%)' : 'Configure'}</span>
          </Button>
        </Link>
      </PageHeader>

      {/* 1. Installation & Service Status Banner (Requirement 3) */}
      <div
        className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
          isInstallationPending
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
        }`}
      >
        <div className="flex items-start sm:items-center gap-2.5">
          {isInstallationPending ? (
            <Clock size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          )}
          <span>
            {isInstallationPending ? (
              <>
                <strong>Installation Visit Pending:</strong> A certified 5AMPERE technician is scheduled to assess your distribution board and mount edge hardware.
              </>
            ) : (
              <>
                <strong>Installation Status:</strong> System fully commissioned. {installedDevices.length} edge hardware modules active on your breaker panel.
              </>
            )}
          </span>
        </div>
        <Link
          to="/installation"
          className={`font-bold text-xs underline shrink-0 hover:opacity-80 ${
            isInstallationPending ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'
          }`}
        >
          Track Service →
        </Link>
      </div>

      {/* 1b. Simulation Distinction Banner (Requirement 7) */}
      <div className="p-3 rounded-xl border bg-neutral-500/5 border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-[var(--color-accent)] shrink-0" />
          <span>
            <strong>Simulated Telemetry Mode:</strong> Current power readings reflect calibrated 3BHK Indian baseline model. Real readings link upon gateway sync.
          </span>
        </div>
        <Link
          to="/settings"
          className="font-bold text-xs underline shrink-0 hover:opacity-80 text-[var(--color-accent)]"
        >
          Meter Settings →
        </Link>
      </div>

      {/* 2. Primary Consumption & Bill Metrics */}
      <EnergyOverview />


      {/* 3. One Useful Electricity-Saving Suggestion (Requirement 4.4) */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lightbulb size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-accent)]">
                  Top Saving Tip For Today
                </span>
                <span className="text-xs font-bold text-[var(--color-success)] bg-green-500/10 px-2 py-0.5 rounded">
                  Save ~₹295 / month
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)] mt-1.5">
                Set Air Conditioner Thermostat to 24°C (BEE Recommended)
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-2xl">
                Your 1.5 Ton AC is currently drawing 1.45 kW (the highest load in your home). Raising the setpoint from 20°C to 24°C reduces compressor power by ~24%, avoiding ~43 kWh/month while maintaining optimal room cooling.
              </p>
            </div>
          </div>
          <Link to="/recommendations" className="shrink-0">
            <Button variant="primary" size="sm">
              <span>More Tips &amp; Simulator</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </Surface>

      {/* 4. Appliance Status & Operational Summary (Requirement 4.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Appliance Status Overview (2 columns on lg) */}
        <div className="lg:col-span-2">
          <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-3 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text)]">
                    Appliance Status ({activeLoads.length} of {loads.length} Running)
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    Total current draw: <span className="font-mono font-bold text-[var(--color-accent)]">{totalActiveKw.toFixed(2)} kW</span> across active circuits.
                  </p>
                </div>
                <Link
                  to="/appliances"
                  className="text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Manage All</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Running Appliances Chips */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeLoads.map((l) => (
                  <div
                    key={l.id}
                    className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shrink-0" />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-[var(--color-text)] block truncate">
                          {l.name}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-muted)] block">
                          {l.location}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-[var(--color-accent)] shrink-0">
                      {l.drawKw.toFixed(2)} kW
                    </span>
                  </div>
                ))}
              </div>

              {inactiveLoads.length > 0 && (
                <div className="pt-2 text-[11px] text-[var(--color-text-muted)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] shrink-0" />
                  <span>
                    Idle/Off: {inactiveLoads.map((l) => l.name.split(' ')[0]).join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[var(--color-text-secondary)]">Need to turn off high loads?</span>
              <Link to="/appliances" className="font-bold text-[var(--color-accent)] hover:underline">
                Open Appliance Controls →
              </Link>
            </div>
          </Surface>
        </div>

        {/* Quick Savings & Alerts Card (1 column on lg) */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Savings Mode Quick Card */}
          <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-3 flex-1">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Savings Mode
                </span>
                <Leaf size={16} className={isSavingModeActive ? 'text-[var(--color-success)]' : 'text-[var(--color-text-muted)]'} />
              </div>

              <div className="pt-2">
                <span className={`text-base font-bold ${isSavingModeActive ? 'text-[var(--color-success)]' : 'text-[var(--color-text)]'}`}>
                  {isSavingModeActive ? 'Active (-15% Goal)' : 'Standard Baseline'}
                </span>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {isSavingModeActive
                    ? 'Non-essential loads are shed during peak hours to protect your budget.'
                    : 'Turn on to automatically reduce peak consumption and save up to ₹800/month.'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
              <Link
                to="/saving-mode"
                className="text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Configure Savings</span>
                <ArrowRight size={13} />
              </Link>

              <button
                type="button"
                onClick={() => toggleSavingMode()}
                className={`text-xs px-3 py-1 rounded-lg font-bold border cursor-pointer transition-all ${
                  isSavingModeActive
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent)]'
                    : 'bg-[var(--color-surface-secondary)] text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)]'
                }`}
              >
                {isSavingModeActive ? 'Turn OFF' : 'Turn ON'}
              </button>
            </div>
          </Surface>

          {/* Electricity Bill Quick Card */}
          <Surface variant="primary" padding="md" className="border border-[var(--color-border)] flex flex-col justify-between space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Electricity Bill
              </span>
              <Receipt size={16} className="text-[var(--color-accent)]" />
            </div>

            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Estimated for this month:</span>
              <span className="text-lg font-bold font-mono text-[var(--color-text)]">
                {formatINR(periodEstimate.allocatedTotal)}
              </span>
              <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                Official UPPCL progressive rates (0–100 to &gt;300 units).
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--color-border-subtle)]">
              <Link
                to="/billing"
                className="text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Bill Breakdown</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </Surface>
        </div>
      </div>

      {/* 5. Installed Hardware & Ecosystem Section (Requirement 3 & 4) */}
      <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <Cpu size={16} className="text-[var(--color-accent)]" />
                <span>Installed 5AMPERE Hardware ({installedDevices.length} Modules in Panel)</span>
              </h3>
              {requestedDevices.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                  {requestedDevices.length} Addition Pending
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Certified DIN gateway, split-core CT sensors, and contactor relays installed in your breaker board.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/installation">
              <Button variant="secondary" size="sm" className="text-xs">
                <Wrench size={13} />
                <span>Service Status</span>
              </Button>
            </Link>

            <Link to="/devices">
              <Button variant="primary" size="sm" className="text-xs font-bold shadow-xs">
                <Package size={13} />
                <span>Add Hardware</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Installed Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {installedDevices.map((dev) => {
            const hw = marketplaceHardware?.find((h) => h.id === dev.id);
            return (
              <div
                key={dev.serial || dev.id}
                className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--color-text)] truncate">
                    {hw ? hw.name : dev.id}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shrink-0" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
                  <span>{dev.serial}</span>
                  <span className="text-[var(--color-accent)]">{dev.circuit || 'Panel'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {requestedDevices.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between gap-2 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Requested:</strong>{' '}
                {requestedDevices.map((r) => r.deviceName || r.deviceId).join(', ')} — Scheduled for {requestedDevices[0].preferredSlot}
              </span>
            </div>
            <Link
              to="/devices"
              className="font-bold underline text-xs shrink-0 text-amber-700 dark:text-amber-300"
            >
              View Queue →
            </Link>
          </div>
        )}
      </Surface>
    </div>
  );
}


export default OverviewPage;
