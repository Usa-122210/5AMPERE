import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Wrench,
  Users,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Cpu,
  Sliders,
  ShieldCheck,
  Code2,
  Bookmark,
  Plus,
  Trash2,
  Package,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

export function TechnicianOverviewPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    customerHomes,
    appointments,
    marketplaceHardware,
    savedConfigurations,
    updateDeveloperProfile,
    saveDeveloperConfiguration,
    deleteDeveloperConfiguration,
    toggleHardwareStock,
  } = useAuth();

  // Developer profile editor state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Developer',
    zone: currentUser?.zone || 'Gautam Buddha Nagar (Noida)',
    specialization: currentUser?.specialization || 'Smart Panel & Firmware Commissioning',
  });
  const [profileFeedback, setProfileFeedback] = useState('');

  // New Saved Configuration form state
  const [configForm, setConfigForm] = useState({
    name: '',
    propertyType: 'home',
    loadKw: 5,
    discom: 'UPPCL (Uttar Pradesh)',
    notes: '',
  });
  const [configFeedback, setConfigFeedback] = useState('');

  // Metrics computation
  const pendingAssessments = customerHomes.filter(
    (h) => h.installationStatus === 'pending_assessment' || h.installationStatus === 'visit_scheduled'
  );
  const activeInstallations = customerHomes.filter(
    (h) => h.installationStatus === 'installation_in_progress' || h.installationStatus === 'assessment_completed'
  );
  const configuredCompleted = customerHomes.filter(
    (h) => h.installationStatus === 'configured' || h.installationStatus === 'completed' || h.installationStatus === 'active'
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateDeveloperProfile({
      name: profileForm.name.trim() || 'Developer',
      zone: profileForm.zone.trim() || 'Gautam Buddha Nagar (Noida)',
      specialization: profileForm.specialization.trim() || 'Smart Panel & Firmware Commissioning',
    });
    setIsEditingProfile(false);
    setProfileFeedback('Developer profile saved to localStorage.');
  };

  const handleCreateConfiguration = (e) => {
    e.preventDefault();
    if (!configForm.name.trim()) return;
    saveDeveloperConfiguration({
      name: configForm.name.trim(),
      propertyType: configForm.propertyType,
      loadKw: Number(configForm.loadKw) || 5,
      discom: configForm.discom,
      modules: ['5AMP-GW-PRO', '5AMP-CT-6X', '5AMP-RLY-40A'],
      notes: configForm.notes.trim() || 'Custom developer panel configuration preset.',
    });
    setConfigForm({
      name: '',
      propertyType: 'home',
      loadKw: 5,
      discom: 'UPPCL (Uttar Pradesh)',
      notes: '',
    });
    setConfigFeedback('Configuration template saved to localStorage.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Developer & Engineering Workspace"
        title="Developer Dashboard & Operations Console"
        badge={`ID: ${currentUser?.staffId || '5AMP-DEV-001'}`}
        badgeColor="var(--color-accent)"
        description="Manage developer profile, project & panel configurations, device/product catalogue, installation appointments, and saved presets."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/developer/catalogue">
            <Button variant="secondary" size="sm">
              <Package size={14} />
              <span>Device Catalogue</span>
            </Button>
          </Link>
          <Link to="/developer/configure">
            <Button variant="primary" size="sm">
              <Sliders size={14} />
              <span>Open Panel Configurator</span>
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* 1. Developer Profile Section */}
      <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-(--color-accent-subtle) border border-(--color-accent)/30 text-(--color-accent) flex items-center justify-center shrink-0">
              <Code2 size={22} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-(--color-text)">
                  Developer Profile: {currentUser?.name || 'Developer'}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-(--color-accent-subtle) text-(--color-accent) font-bold uppercase">
                  {currentUser?.role || 'developer'}
                </span>
                <span className="text-[10px] font-mono text-(--color-text-muted)">
                  {currentUser?.email || 'developer@5ampere.com'}
                </span>
              </div>
              <p className="text-xs text-(--color-text-secondary) mt-0.5">
                Zone: <strong>{currentUser?.zone || 'Gautam Buddha Nagar (Noida)'}</strong> · Specialization:{' '}
                <strong>{currentUser?.specialization || 'Smart Panel & Firmware Commissioning'}</strong>
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setProfileForm({
                name: currentUser?.name || 'Developer',
                zone: currentUser?.zone || 'Gautam Buddha Nagar (Noida)',
                specialization: currentUser?.specialization || 'Smart Panel & Firmware Commissioning',
              });
              setIsEditingProfile(!isEditingProfile);
            }}
          >
            <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
          </Button>
        </div>

        {profileFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
            <span>{profileFeedback}</span>
            <button type="button" onClick={() => setProfileFeedback('')} className="underline text-[11px] cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="pt-3 border-t border-(--color-border-subtle) grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">Developer Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">Operating Zone</label>
              <input
                type="text"
                value={profileForm.zone}
                onChange={(e) => setProfileForm({ ...profileForm, zone: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">Specialization</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profileForm.specialization}
                  onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                  required
                />
                <Button type="submit" variant="primary" size="sm">
                  Save
                </Button>
              </div>
            </div>
          </form>
        )}
      </Surface>

      {/* 2. Project / Configuration Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
            <span>Pending Site Visits</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-(--color-text)">
              {pendingAssessments.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Awaiting Assessment
            </span>
          </div>
          <span className="text-[11px] text-(--color-text-muted) block">
            Scheduled within 48 hours
          </span>
        </Surface>

        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
            <span>Active Installations</span>
            <Wrench size={16} className="text-(--color-accent)" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-(--color-text)">
              {activeInstallations.length}
            </span>
            <span className="text-xs text-(--color-accent) font-medium">
              In Progress
            </span>
          </div>
          <span className="text-[11px] text-(--color-text-muted) block">
            Panel mounting &amp; wiring
          </span>
        </Surface>

        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
            <span>Commissioned Projects</span>
            <CheckCircle2 size={16} className="text-(--color-success)" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-(--color-text)">
              {configuredCompleted.length}
            </span>
            <span className="text-xs text-(--color-success) font-medium">
              Active Telemetry
            </span>
          </div>
          <span className="text-[11px] text-(--color-text-muted) block">
            Calibrated against utility meter
          </span>
        </Surface>

        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
            <span>Saved Configurations</span>
            <Bookmark size={16} className="text-(--color-accent)" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-(--color-text)">
              {(savedConfigurations || []).length}
            </span>
            <span className="text-xs text-(--color-text-secondary) font-medium">
              Templates Ready
            </span>
          </div>
          <span className="text-[11px] text-(--color-text-muted) block">
            Stored in developer workspace
          </span>
        </Surface>
      </div>

      {/* 3. Saved Configurations & Presets (Persisted in localStorage) */}
      <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-(--color-border-subtle) pb-3">
          <div>
            <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
              <Bookmark size={16} className="text-(--color-accent)" />
              <span>Saved Panel Configurations &amp; Project Blueprints ({(savedConfigurations || []).length})</span>
            </h3>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
              Create and persist reusable hardware configuration blueprints in localStorage.
            </p>
          </div>
        </div>

        {configFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
            <span>{configFeedback}</span>
            <button type="button" onClick={() => setConfigFeedback('')} className="underline text-[11px] cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(savedConfigurations || []).map((cfg) => (
            <div
              key={cfg.id}
              className="p-3.5 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) flex flex-col justify-between gap-2.5"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-(--color-surface) border border-(--color-border) text-(--color-accent) font-bold uppercase">
                    {cfg.propertyType} · {cfg.loadKw} kW
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteDeveloperConfiguration(cfg.id)}
                    className="text-(--color-text-muted) hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete configuration"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <h4 className="text-xs font-bold text-(--color-text)">{cfg.name}</h4>
                <p className="text-[11px] text-(--color-text-secondary)">{cfg.notes}</p>
              </div>
              <div className="pt-2 border-t border-(--color-border-subtle) flex items-center justify-between text-[10px] font-mono text-(--color-text-muted)">
                <span>{cfg.discom}</span>
                <span>{cfg.createdAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Form to add a new Saved Configuration */}
        <form onSubmit={handleCreateConfiguration} className="pt-3 border-t border-(--color-border-subtle) grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">
              New Configuration Name
            </label>
            <input
              type="text"
              value={configForm.name}
              onChange={(e) => setConfigForm({ ...configForm, name: e.target.value })}
              placeholder="e.g., 4BHK Solar + EV Load Blueprint"
              className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">
              Property Type
            </label>
            <select
              value={configForm.propertyType}
              onChange={(e) => setConfigForm({ ...configForm, propertyType: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
            >
              <option value="home">Home</option>
              <option value="school">School</option>
              <option value="office">Office</option>
              <option value="industry">Industry</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">
              Sanctioned kW
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={configForm.loadKw}
              onChange={(e) => setConfigForm({ ...configForm, loadKw: e.target.value })}
              className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
            />
          </div>
          <div>
            <Button type="submit" variant="primary" size="sm" className="w-full">
              <Plus size={14} />
              <span>Save Blueprint</span>
            </Button>
          </div>
        </form>
      </Surface>

      {/* 4. Device / Product Catalogue Quick Overview */}
      <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-3">
        <div className="flex items-center justify-between border-b border-(--color-border-subtle) pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
              <Cpu size={16} className="text-(--color-accent)" />
              <span>Device &amp; Product Catalogue ({(marketplaceHardware || []).length} Modules)</span>
            </h3>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
              Certified 5AMPERE DIN-rail hardware modules available for project deployment
            </p>
          </div>
          <Link to="/developer/catalogue" className="text-xs font-semibold text-(--color-accent) hover:underline">
            Full Hardware Catalogue →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(marketplaceHardware || []).slice(0, 4).map((hw) => (
            <div
              key={hw.id}
              className="p-3 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold text-(--color-accent)">{hw.model || hw.sku || hw.id}</span>
                  <button
                    type="button"
                    onClick={() => toggleHardwareStock(hw.id)}
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold cursor-pointer ${
                      hw.inStock !== false
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {hw.inStock !== false ? 'IN STOCK' : 'OUT OF STOCK'}
                  </button>
                </div>
                <div className="text-xs font-bold text-(--color-text) mt-1">{hw.name}</div>
                <div className="text-[11px] text-(--color-text-muted) mt-0.5">{hw.category}</div>
              </div>
              <div className="pt-2 border-t border-(--color-border-subtle) flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-(--color-text)">₹{(hw.priceINR || hw.priceInr || 0).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-(--color-text-muted)">DIN Certified</span>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      {/* 5. Main Grid: Installation / Appointment Management & Customer Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Field Appointments & Dispatches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
              <Calendar size={16} className="text-(--color-accent)" />
              <span>Installation &amp; Appointment Management</span>
            </h3>
            <Link
              to="/developer/appointments"
              className="text-xs font-semibold text-(--color-accent) hover:underline"
            >
              View Full Schedule →
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => {
              const home = customerHomes.find((h) => h.id === apt.homeId);

              return (
                <Surface
                  key={apt.id}
                  variant="primary"
                  padding="md"
                  className="border border-(--color-border) hover:border-(--color-accent) transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-(--color-border-subtle) pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-(--color-surface-secondary) text-(--color-accent) border border-(--color-border)">
                          {apt.id}
                        </span>
                        <h4 className="text-sm font-bold text-(--color-text)">
                          {apt.customerName}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                          {apt.status.replaceAll('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-(--color-text-secondary) mt-0.5 flex items-center gap-1.5">
                        <MapPin size={12} className="shrink-0 text-(--color-accent)" />
                        <span>{apt.address}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-mono text-(--color-text-muted) block">Time Window</span>
                      <span className="text-xs font-bold text-(--color-text) font-mono">
                        {apt.scheduledTime}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-(--color-text-secondary) space-y-1">
                    <div>
                      <strong className="text-(--color-text)">Task: </strong>
                      <span>{apt.type}</span>
                    </div>
                    <div>
                      <strong className="text-(--color-text)">Scope: </strong>
                      <span className="text-(--color-text-muted)">{apt.scope}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-(--color-border-subtle) flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-xs text-(--color-text-muted)">
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        <span>{apt.phone}</span>
                      </span>
                      <span>Sanction: {home?.sanctionedLoadKw || 5.0} kW</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/developer/customers?id=${apt.homeId}`)}
                        className="text-xs"
                      >
                        Profile
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/developer/configure/${apt.homeId}`)}
                        className="text-xs font-bold"
                      >
                        <Sliders size={13} />
                        <span>Configure Setup</span>
                      </Button>
                    </div>
                  </div>
                </Surface>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recent Customer Properties & Protocol */}
        <div className="space-y-4">
          <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-4">
            <div>
              <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                <Users size={16} className="text-(--color-accent)" />
                <span>Active Customer Projects</span>
              </h3>
              <p className="text-xs text-(--color-text-secondary) mt-0.5">
                Quick access to customer electrical panels
              </p>
            </div>

            <div className="space-y-2">
              {customerHomes.slice(0, 4).map((home) => (
                <div
                  key={home.id}
                  onClick={() => navigate(`/developer/configure/${home.id}`)}
                  className="p-2.5 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) hover:border-(--color-accent) cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-(--color-text)">
                      {home.customerName}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        home.installationStatus === 'active' || home.installationStatus === 'completed'
                          ? 'bg-green-500/10 text-green-700 dark:text-green-300'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {home.installationStatus.replaceAll('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-(--color-text-muted) truncate">
                    {home.locality} · {home.sanctionedLoadKw} kW
                  </div>
                </div>
              ))}
            </div>

            <Link to="/developer/customers" className="block text-center">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                <span>View All Projects ({customerHomes.length})</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </Surface>

          {/* Engineering Calibration Checklist */}
          <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary) flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-(--color-success)" />
              <span>Developer Commissioning Protocol</span>
            </h4>
            <ul className="text-xs text-(--color-text-secondary) space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent) mt-1.5 shrink-0" />
                <span>Verify incoming line voltage with calibrated digital multimeter (230V ± 6%).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent) mt-1.5 shrink-0" />
                <span>Align split-core CT clamp arrow in the direction of power flow (Source → Load).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent) mt-1.5 shrink-0" />
                <span>Pair EdgeCore gateway with local 2.4GHz Wi-Fi / MQTT broker before closing DB enclosure.</span>
              </li>
            </ul>
          </Surface>
        </div>
      </div>
    </div>
  );
}

export default TechnicianOverviewPage;

