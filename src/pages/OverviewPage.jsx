import { useState } from 'react';
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
  Layers,
  Building,
  School,
  Factory,
  Home,
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
    formatINR,
    periodEstimate,
    totalActiveKw,
  } = useEnergyData();

  const { activeCustomerProperty, marketplaceHardware } = useAuth();
  const property = activeCustomerProperty || {};

  const propType = property.propertyType || 'home';
  const installedDevices = property.installedDevices || [];
  const requestedDevices = property.requestedDevices || [];
  const rooms = property.rooms || [];
  const hasHardwareInstalled = installedDevices.length > 0;
  const isInstallationPending =
    property.installationStatus === 'pending_assessment' ||
    property.installationStatus === 'visit_scheduled';

  // Toggle preview of calibrated baseline for uncommissioned homes
  const [showSimulatedPreview, setShowSimulatedPreview] = useState(hasHardwareInstalled);

  // Property type titles
  const typeTitles = {
    home: 'Home Electricity Dashboard',
    school: 'Campus Energy Console',
    office: 'Facility Power Dashboard',
    industry: 'Industrial Plant Power & HT Substation',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category={property.propertyType ? property.propertyType.toUpperCase() : 'ENERGY WORKSPACE'}
        title={typeTitles[propType] || 'Property Electricity Dashboard'}
        badge={property.propertyName || property.locality || 'Active Profile'}
        badgeColor="var(--color-accent)"
        description={
          propType === 'home'
            ? 'Monitor electricity consumption across rooms, track your estimated UPPCL bill, and optimize appliance runtimes.'
            : propType === 'school'
            ? 'Monitor multi-block educational campus power draw, track transformer load, and optimize HVAC runtimes.'
            : propType === 'office'
            ? 'Track commercial floor electricity consumption, server room PAC cooling loads, and automated after-hours shedding.'
            : 'Monitor 3-phase high-tension power demand, screw compressors, CNC bays, and mitigate peak ToD tariff penalties.'
        }
      >
        <Link to="/saving-mode">
          <Button variant={isSavingModeActive ? 'primary' : 'secondary'} size="sm">
            <Leaf size={14} />
            <span>Savings Mode: {isSavingModeActive ? 'Active (-15%)' : 'Configure'}</span>
          </Button>
        </Link>
      </PageHeader>

      {/* 1. Installation Status & Commissioning Lifecycle Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs ${
          isInstallationPending || !hasHardwareInstalled
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
        }`}
      >
        <div className="flex items-start md:items-center gap-3">
          {hasHardwareInstalled ? (
            <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 md:mt-0" />
          ) : (
            <Clock size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 md:mt-0" />
          )}
          <div>
            <span className="font-bold block text-sm">
              {hasHardwareInstalled
                ? 'System Operational & Telemetry Commissioned'
                : 'Technician Installation Visit Pending'}
            </span>
            <span className="opacity-90 block mt-0.5">
              {hasHardwareInstalled
                ? `${installedDevices.length} certified modules active on distribution board. Calibrated with ${property.discom || 'DISCOM'} meter.`
                : `A certified 5AMPERE technician will visit ${property.address || 'your property'} to install your EdgeCore Gateway and CT clamps.`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/installation">
            <Button variant="secondary" size="sm" className="text-xs">
              <Wrench size={13} />
              <span>Track Service Visit</span>
            </Button>
          </Link>
          <Link to="/devices">
            <Button variant="primary" size="sm" className="text-xs font-bold shadow-xs">
              <Package size={13} />
              <span>Add Hardware</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Setup Progress Indicator for Newly Registered Customers */}
      {!hasHardwareInstalled && (
        <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] font-mono">
              Onboarding &amp; Hardware Activation Progress
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
              3 of 5 Steps Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {[
              { label: '1. Account & Profile', done: true, current: false },
              { label: `2. ${rooms.length} ${propType === 'home' ? 'Rooms' : 'Zones'} Mapped`, done: true, current: false },
              { label: '3. Hardware Requested', done: true, current: false },
              { label: '4. Panel Installation', done: false, current: true },
              { label: '5. Live Telemetry', done: false, current: false },
            ].map((st, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-xs ${
                  st.done
                    ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300 font-bold'
                    : st.current
                    ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)] font-bold animate-pulse'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {st.done ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                  <span className="truncate">{st.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border-subtle)]">
            <span>
              Real-time CT sensors require physical mounting in the breaker board. Want to preview calibrated baseline consumption graphs?
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowSimulatedPreview(!showSimulatedPreview)}
              className="text-xs shrink-0"
            >
              {showSimulatedPreview ? 'Hide Baseline Preview' : 'Show Baseline Preview'}
            </Button>
          </div>
        </Surface>
      )}

      {/* 3. Primary Consumption & Bill Metrics */}
      {showSimulatedPreview ? (
        <div className="space-y-6">
          <div className="p-3 rounded-xl border bg-neutral-500/5 border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <Info size={15} className="text-[var(--color-accent)] shrink-0" />
              <span>
                <strong>Simulated Baseline Mode:</strong> Displaying calibrated {property.sanctionedLoadKw || 5} kW telemetry profile under official {property.discom || 'UPPCL'} tariff slabs.
              </span>
            </div>
            <Link to="/settings" className="font-bold text-xs underline text-[var(--color-accent)] shrink-0">
              Settings →
            </Link>
          </div>

          <EnergyOverview />
        </div>
      ) : (
        <Surface variant="primary" padding="xl" className="border border-dashed border-[var(--color-border)] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Clock size={24} />
          </div>
          <h3 className="text-sm font-bold text-[var(--color-text)]">
            Awaiting Physical Hardware Installation
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
            Your live energy telemetry streams will activate once technician Rajesh Kumar mounts and calibrates your 5AMPERE EdgeCore gateway.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowSimulatedPreview(true)} className="text-xs">
              Preview Calibrated Baseline
            </Button>
            <Link to="/installation">
              <Button variant="primary" size="sm" className="text-xs font-bold">
                View Appointment Schedule
              </Button>
            </Link>
          </div>
        </Surface>
      )}

      {/* 4. One Useful Electricity-Saving Suggestion */}
      <Surface variant="primary" padding="lg" className="border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lightbulb size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-accent)] border border-[var(--color-accent)]">
                  Top Recommendation
                </span>
                <span className="text-xs font-bold text-[var(--color-success)] bg-green-500/10 px-2 py-0.5 rounded">
                  Save ~₹450 / month
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)] mt-1.5">
                {propType === 'home' && 'Set Air Conditioner Thermostat to 24°C (BEE Standard)'}
                {propType === 'school' && 'Automate Science Lab & Classroom Idle Power Cutoff'}
                {propType === 'office' && 'Enable After-Hours Cafeteria & Pantry Relay Shedding'}
                {propType === 'industry' && 'Synchronize Compressor Unloader Cycles with Peak ToD Slabs'}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
                {propType === 'home' && 'Raising AC setpoint from 20°C to 24°C reduces compressor draw by ~24%, avoiding high progressive tariff slab tiers.'}
                {propType === 'school' && 'Centralizing automatic cutoff of lab sockets after 4 PM prevents continuous overnight standby phantom power waste.'}
                {propType === 'office' && 'Pantry coolers and commercial coffee vending units draw up to 4.2 kW continuously on weekends if not shed.'}
                {propType === 'industry' && 'Shifting rotary compressor unloading away from the 18:00–22:00 evening peak avoids maximum demand surcharge.'}
              </p>
            </div>
          </div>
          <Link to="/recommendations" className="shrink-0">
            <Button variant="primary" size="sm" className="text-xs font-bold">
              <span>View Simulator</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </Surface>

      {/* 5. Configured Rooms & Appliances Summary */}
      <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              <Layers size={16} className="text-[var(--color-accent)]" />
              <span>Configured {propType === 'home' ? 'Rooms & Appliances' : 'Zones & Circuits'} ({rooms.length})</span>
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Mapped topology for {property.propertyName || 'Property'}
            </p>
          </div>
          <Link to="/rooms-appliances" className="text-xs font-semibold text-[var(--color-accent)] hover:underline flex items-center gap-1">
            <span>Manage All {propType === 'home' ? 'Rooms' : 'Zones'} →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {rooms.slice(0, 4).map((room) => {
            const activeCount = (room.appliances || []).filter((a) => a.active).length;
            const roomWatts = (room.appliances || [])
              .filter((a) => a.active)
              .reduce((sum, a) => sum + (a.drawKw || 0.1) * 1000, 0);

            return (
              <div
                key={room.id}
                className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--color-text)] truncate">{room.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--color-surface)] border font-semibold">
                    {activeCount} active
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)]">
                  <span>{(roomWatts / 1000).toFixed(2)} kW</span>
                  <span className="text-[var(--color-accent)]">{(room.appliances || []).length} loads</span>
                </div>
              </div>
            );
          })}
        </div>
      </Surface>

      {/* 6. Installed Hardware & Ecosystem Section */}
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
        {installedDevices.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)] text-center">
            No hardware modules mounted yet. Technician Rajesh Kumar is assigned for site installation.
          </div>
        ) : (
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
                    <span className="text-[var(--color-accent)]">{dev.location || 'Panel'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {requestedDevices.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-center justify-between gap-2 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Requested:</strong>{' '}
                {requestedDevices.map((r) => r.deviceName || r.deviceId).join(', ')} — Scheduled for {requestedDevices[0].preferredSlot}
              </span>
            </div>
            <Link to="/devices" className="font-bold underline text-xs shrink-0 text-amber-700 dark:text-amber-300">
              View Queue →
            </Link>
          </div>
        )}
      </Surface>
    </div>
  );
}

export default OverviewPage;
