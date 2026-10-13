import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Info,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Wrench,
  Clock,
  Package,
  Layers,
  Home,
  School,
  Building,
  Factory,
  Sliders,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { EnergyOverview } from '../components/dashboard/EnergyOverview';
import { useEnergyData } from '../context/EnergyDataContext';
import { useAuth } from '../context/AuthContext';

export function OverviewPage() {
  const { isSavingModeActive } = useEnergyData();

  const { activeCustomerProperty, marketplaceHardware, saveUserPropertySetup, currentUser } = useAuth();
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
  const [showSimulatedPreview, setShowSimulatedPreview] = useState(true);

  // Onboarding / Property Setup Wizard state
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(property.onboardingCompleted === false);
  const [setupSavedNotice, setSetupSavedNotice] = useState('');
  const [setupForm, setSetupForm] = useState({
    propertyType: property.propertyType || 'home',
    propertyName: property.propertyName || `${currentUser?.name || 'User'}'s Home`,
    locality: property.locality || 'Lucknow, UP',
    discom: property.discom || 'UPPCL (Uttar Pradesh)',
    sanctionedLoadKw: property.sanctionedLoadKw || 5,
    monthlyBudgetInr: property.monthlyBudgetInr || 3500,
    setupMode: property.setupMode || 'room-wise',
    occupants: property.typeMetadata?.occupants || 4,
    bhk: property.typeMetadata?.bhk || '3 BHK Residence',
  });

  useEffect(() => {
    setIsSetupWizardOpen(property.onboardingCompleted === false);
    setSetupForm({
      propertyType: property.propertyType || 'home',
      propertyName: property.propertyName || `${currentUser?.name || 'User'}'s Home`,
      locality: property.locality || 'Lucknow, UP',
      discom: property.discom || 'UPPCL (Uttar Pradesh)',
      sanctionedLoadKw: property.sanctionedLoadKw || 5,
      monthlyBudgetInr: property.monthlyBudgetInr || 3500,
      setupMode: property.setupMode || 'room-wise',
      occupants: property.typeMetadata?.occupants || 4,
      bhk: property.typeMetadata?.bhk || '3 BHK Residence',
    });
  }, [property.id, property.onboardingCompleted, property.propertyType, property.propertyName, property.locality, property.discom, property.sanctionedLoadKw, property.monthlyBudgetInr, property.setupMode, property.typeMetadata, currentUser?.name]);

  const handleSavePropertySetup = (e) => {
    e.preventDefault();
    if (!property.id) return;
    saveUserPropertySetup(property.id, {
      propertyType: setupForm.propertyType,
      propertyName: setupForm.propertyName.trim() || 'My Property',
      locality: setupForm.locality.trim() || 'Lucknow, UP',
      address: `${setupForm.propertyName.trim() || 'Property'}, ${setupForm.locality.trim() || 'Lucknow, UP'}`,
      discom: setupForm.discom,
      sanctionedLoadKw: Number(setupForm.sanctionedLoadKw) || 5,
      monthlyBudgetInr: Number(setupForm.monthlyBudgetInr) || 3500,
      setupMode: setupForm.setupMode,
      typeMetadata: {
        ...(property.typeMetadata || {}),
        occupants: Number(setupForm.occupants) || 4,
        bhk: setupForm.bhk,
      },
    });
    setIsSetupWizardOpen(false);
    setSetupSavedNotice(
      `Property setup saved (${setupForm.propertyType.toUpperCase()} · ${
        setupForm.setupMode === 'room-wise' ? 'Room-wise Setup' : 'Appliance / Device-wise Setup'
      }). Restored automatically across logins.`
    );
  };

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
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsSetupWizardOpen((prev) => !prev)}
          >
            <Sliders size={14} />
            <span>{isSetupWizardOpen ? 'Hide Property Setup' : 'Configure Property Setup'}</span>
          </Button>
          <Link to="/saving-mode">
            <Button variant={isSavingModeActive ? 'primary' : 'secondary'} size="sm">
              <Leaf size={14} />
              <span>Savings Mode: {isSavingModeActive ? 'Active (-15%)' : 'Configure'}</span>
            </Button>
          </Link>
        </div>
      </PageHeader>

      {setupSavedNotice && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{setupSavedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSetupSavedNotice('')}
            className="text-[11px] font-mono underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive Property Onboarding & Setup Wizard */}
      {isSetupWizardOpen && (
        <Surface variant="primary" padding="lg" className="border-2 border-(--color-accent) space-y-5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-(--color-border-subtle) pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-(--color-accent-subtle) text-(--color-accent)">
                User Onboarding &amp; Property Setup
              </span>
              <h2 className="text-base font-bold text-(--color-text) mt-1">
                Where do you want to use 5AMPERE?
              </h2>
              <p className="text-xs text-(--color-text-secondary)">
                Choose your property type, answer simple configuration questions, and select room-wise or appliance-wise setup. Your setup is saved in localStorage.
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePropertySetup} className="space-y-5">
            {/* Step 1: Property Type Selection (Home, School, Office, Industry) */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-(--color-text-secondary) font-semibold block">
                1. Select Property Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'home', label: 'Home', desc: 'Residence / Apartment', icon: Home, defaultLoad: 5, defaultBudget: 3500 },
                  { id: 'school', label: 'School', desc: 'Academic Campus & Labs', icon: School, defaultLoad: 45, defaultBudget: 65000 },
                  { id: 'office', label: 'Office', desc: 'Commercial Floor & IT', icon: Building, defaultLoad: 30, defaultBudget: 48000 },
                  { id: 'industry', label: 'Industry', desc: '3-Phase Plant & Machinery', icon: Factory, defaultLoad: 120, defaultBudget: 185000 },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = setupForm.propertyType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setSetupForm((prev) => ({
                          ...prev,
                          propertyType: item.id,
                          sanctionedLoadKw: item.defaultLoad,
                          monthlyBudgetInr: item.defaultBudget,
                        }))
                      }
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-text) shadow-xs'
                          : 'bg-(--color-surface-secondary) border-(--color-border) text-(--color-text-secondary) hover:border-(--color-accent)/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Icon size={16} className={active ? 'text-(--color-accent)' : 'text-(--color-text-muted)'} />
                        {active && <CheckCircle2 size={14} className="text-(--color-accent)" />}
                      </div>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-(--color-text-muted)">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Simple Configuration Questions */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-(--color-text-secondary) font-semibold block">
                2. Property &amp; Electricity Configuration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-(--color-text-muted) uppercase block">
                    Property Name
                  </label>
                  <input
                    type="text"
                    value={setupForm.propertyName}
                    onChange={(e) => setSetupForm({ ...setupForm, propertyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                    placeholder="e.g., Sharma Residence"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-(--color-text-muted) uppercase block">
                    City / Locality
                  </label>
                  <input
                    type="text"
                    value={setupForm.locality}
                    onChange={(e) => setSetupForm({ ...setupForm, locality: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                    placeholder="e.g., Gomti Nagar, Lucknow"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-(--color-text-muted) uppercase block">
                    Electricity Utility (DISCOM)
                  </label>
                  <select
                    value={setupForm.discom}
                    onChange={(e) => setSetupForm({ ...setupForm, discom: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                  >
                    <option value="UPPCL (Uttar Pradesh)">UPPCL (Uttar Pradesh)</option>
                    <option value="BSES Rajdhani (Delhi)">BSES Rajdhani (Delhi)</option>
                    <option value="TATA Power (Mumbai)">TATA Power (Mumbai)</option>
                    <option value="BESCOM (Bengaluru)">BESCOM (Bengaluru)</option>
                    <option value="MSEDCL (Maharashtra)">MSEDCL (Maharashtra)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-(--color-text-muted) uppercase block">
                    Sanctioned Load (kW)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={setupForm.sanctionedLoadKw}
                    onChange={(e) => setSetupForm({ ...setupForm, sanctionedLoadKw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-(--color-text-muted) uppercase block">
                    Monthly Bill Target (₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={setupForm.monthlyBudgetInr}
                    onChange={(e) => setSetupForm({ ...setupForm, monthlyBudgetInr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                  />
                </div>
                {setupForm.propertyType === 'home' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-(--color-text-muted) uppercase block">
                      Home Size / Layout
                    </label>
                    <select
                      value={setupForm.bhk}
                      onChange={(e) => setSetupForm({ ...setupForm, bhk: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                    >
                      <option value="1-2 BHK Apartment">1-2 BHK Apartment</option>
                      <option value="3 BHK Residence">3 BHK Residence</option>
                      <option value="4+ BHK Villa / Duplex">4+ BHK Villa / Duplex</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Choose Room-wise or Appliance/Device-wise Setup */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-(--color-text-secondary) font-semibold block">
                3. Choose Configuration Mode (Room-wise vs Appliance/Device-wise)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'room-wise',
                    title: 'Room-wise Setup',
                    desc: 'Organize circuits and electricity tracking by rooms/zones (Living Room, Master Bedroom, Kitchen, etc.).',
                    icon: Layers,
                  },
                  {
                    id: 'appliance-wise',
                    title: 'Appliance / Device-wise Setup',
                    desc: 'Track and automate individual heavy appliances and DIN relays directly (ACs, Geysers, EV Chargers, Motors).',
                    icon: Cpu,
                  },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const active = setupForm.setupMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSetupForm({ ...setupForm, setupMode: mode.id })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        active
                          ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-text)'
                          : 'bg-(--color-surface-secondary) border-(--color-border) text-(--color-text-secondary)'
                      }`}
                    >
                      <Icon size={18} className={`mt-0.5 shrink-0 ${active ? 'text-(--color-accent)' : 'text-(--color-text-muted)'}`} />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{mode.title}</span>
                          {active && <CheckCircle2 size={13} className="text-(--color-accent)" />}
                        </div>
                        <p className="text-[11px] text-(--color-text-secondary) mt-0.5">{mode.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-(--color-border-subtle)">
              {property.onboardingCompleted && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsSetupWizardOpen(false)}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" size="sm">
                <CheckCircle2 size={14} />
                <span>Save Property Setup</span>
              </Button>
            </div>
          </form>
        </Surface>
      )}

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
        <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary) font-mono">
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
                    ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent) font-bold animate-pulse'
                    : 'bg-(--color-surface) border-(--color-border) text-(--color-text-muted) opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {st.done ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                  <span className="truncate">{st.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-(--color-text-secondary) border-t border-(--color-border-subtle)">
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
          <div className="p-3 rounded-xl border bg-neutral-500/5 border-(--color-border) text-(--color-text-secondary) text-xs flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <Info size={15} className="text-(--color-accent) shrink-0" />
              <span>
                <strong>Simulated Baseline Mode:</strong> Displaying calibrated {property.sanctionedLoadKw || 5} kW telemetry profile under official {property.discom || 'UPPCL'} tariff slabs.
              </span>
            </div>
            <Link to="/settings" className="font-bold text-xs underline text-(--color-accent) shrink-0">
              Settings →
            </Link>
          </div>

          <EnergyOverview />
        </div>
      ) : (
        <Surface variant="primary" padding="xl" className="border border-dashed border-(--color-border) text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Clock size={24} />
          </div>
          <h3 className="text-sm font-bold text-(--color-text)">
            Awaiting Physical Hardware Installation
          </h3>
          <p className="text-xs text-(--color-text-secondary) max-w-md mx-auto">
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
      <Surface variant="primary" padding="lg" className="border border-(--color-accent) bg-(--color-accent-subtle) space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-(--color-accent) text-white flex items-center justify-center shrink-0 shadow-xs">
              <Lightbulb size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-(--color-surface) text-(--color-accent) border border-(--color-accent)">
                  Top Recommendation
                </span>
                <span className="text-xs font-bold text-(--color-success) bg-green-500/10 px-2 py-0.5 rounded">
                  Save ~₹450 / month
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-(--color-text) mt-1.5">
                {propType === 'home' && 'Set Air Conditioner Thermostat to 24°C (BEE Standard)'}
                {propType === 'school' && 'Automate Science Lab & Classroom Idle Power Cutoff'}
                {propType === 'office' && 'Enable After-Hours Cafeteria & Pantry Relay Shedding'}
                {propType === 'industry' && 'Synchronize Compressor Unloader Cycles with Peak ToD Slabs'}
              </h3>
              <p className="text-xs text-(--color-text-secondary) mt-1 max-w-2xl leading-relaxed">
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
      <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-3">
        <div className="flex items-center justify-between border-b border-(--color-border-subtle) pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
              <Layers size={16} className="text-(--color-accent)" />
              <span>Configured {propType === 'home' ? 'Rooms & Appliances' : 'Zones & Circuits'} ({rooms.length})</span>
            </h3>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
              Mapped topology for {property.propertyName || 'Property'}
            </p>
          </div>
          <Link to="/rooms-appliances" className="text-xs font-semibold text-(--color-accent) hover:underline flex items-center gap-1">
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
                className="p-3 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-(--color-text) truncate">{room.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-(--color-surface) border font-semibold">
                    {activeCount} active
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-(--color-text-muted)">
                  <span>{(roomWatts / 1000).toFixed(2)} kW</span>
                  <span className="text-(--color-accent)">{(room.appliances || []).length} loads</span>
                </div>
              </div>
            );
          })}
        </div>
      </Surface>

      {/* 6. Installed Hardware & Ecosystem Section */}
      <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-(--color-border-subtle) pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                <Cpu size={16} className="text-(--color-accent)" />
                <span>Installed 5AMPERE Hardware ({installedDevices.length} Modules in Panel)</span>
              </h3>
              {requestedDevices.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
                  {requestedDevices.length} Addition Pending
                </span>
              )}
            </div>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
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
          <div className="p-4 rounded-xl border border-dashed border-(--color-border) text-xs text-(--color-text-muted) text-center">
            No hardware modules mounted yet. Technician Rajesh Kumar is assigned for site installation.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {installedDevices.map((dev) => {
              const hw = marketplaceHardware?.find((h) => h.id === dev.id);
              return (
                <div
                  key={dev.serial || dev.id}
                  className="p-2.5 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-(--color-text) truncate">
                      {hw ? hw.name : dev.id}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-(--color-success) shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-(--color-text-muted)">
                    <span>{dev.serial}</span>
                    <span className="text-(--color-accent)">{dev.location || 'Panel'}</span>
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
