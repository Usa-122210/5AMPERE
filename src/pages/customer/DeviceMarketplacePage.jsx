import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  Info,
  Cpu,
  Activity,
  Zap,
  Radio,
  Plug,
  Eye,
  Gauge,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

// Icon mapper for hardware cards
const ICON_MAP = {
  Cpu: Cpu,
  Activity: Activity,
  Zap: Zap,
  Radio: Radio,
  Plug: Plug,
  Eye: Eye,
  Gauge: Gauge,
};

const CATEGORIES = [
  'All Products',
  'Energy Monitoring',
  'Heavy Appliance Contactor',
  'Smart Switches & Relays',
  'Automation & Sensors',
  'Whole-Panel Submetering',
];

export function DeviceMarketplacePage() {
  const {
    marketplaceHardware,
    activeCustomerHome,
    requestDeviceInstallation,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('catalogue'); // 'catalogue' | 'my_devices'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  // Modal states
  const [detailModalHardware, setDetailModalHardware] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [targetHardware, setTargetHardware] = useState(null);
  const [preferredSlot, setPreferredSlot] = useState('Weekend Morning (10:00 AM – 01:00 PM)');
  const [requestNotes, setRequestNotes] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Filter hardware list
  const filteredHardware = marketplaceHardware.filter((hw) => {
    const matchesCategory =
      selectedCategory === 'All Products' || hw.category === selectedCategory;
    const matchesSearch =
      hw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Customer's installed and pending lists
  const installedDevices = activeCustomerHome?.installedDevices || [];
  const requestedDevices = activeCustomerHome?.requestedDevices || [];

  const handleOpenRequest = (hw) => {
    setTargetHardware(hw);
    setRequestSuccess(false);
    setRequestNotes('');
    setIsRequestModalOpen(true);
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();
    if (!targetHardware) return;

    requestDeviceInstallation(targetHardware.id, preferredSlot, requestNotes);
    setRequestSuccess(true);
    setTimeout(() => {
      setIsRequestModalOpen(false);
      setRequestSuccess(false);
      setActiveTab('my_devices'); // switch to My Devices tab to see the pending status
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Hardware & Ecosystem"
        title="Smart Energy Device Catalogue"
        badge="Certified 5AMPERE Hardware"
        badgeColor="var(--color-accent)"
        description="Browse certified smart energy hardware, CT clamps, contactor relays, and request professional on-site installation by a 5AMPERE electrical specialist."
      >
        <Link to="/installation">
          <Button variant="secondary" size="sm">
            <Wrench size={14} />
            <span>Installation Status ({requestedDevices.length} Pending)</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Hardware Distinction Banner (Requirement 4 & 7) */}
      <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Professional Installation Protocol:</strong> Adding smart hardware to your home requires physical panel wiring, breaker sizing, and calibration by an authorized 5AMPERE field technician. Submitting a request books a scheduled site visit.
          </span>
        </div>
        <Link
          to="/installation"
          className="font-bold text-xs underline shrink-0 hover:opacity-80 text-emerald-700 dark:text-emerald-300"
        >
          View Process →
        </Link>
      </div>

      {/* Main Tabs (Catalogue vs My Devices) */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('catalogue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalogue'
                ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            Hardware Catalogue ({marketplaceHardware.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my_devices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'my_devices'
                ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            <span>My Installed &amp; Pending Devices</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
              {installedDevices.length + requestedDevices.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: DEVICE CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="space-y-4">
          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hardware name, model, or specs..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--color-surface-selected)] text-[var(--color-accent)] font-bold border border-[var(--color-accent)]'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHardware.map((hw) => {
              const IconComp = ICON_MAP[hw.icon] || Cpu;
              const isAlreadyInstalled = installedDevices.some((d) => d.id === hw.id);
              const isPendingRequest = requestedDevices.some((d) => d.deviceId === hw.id);

              return (
                <Surface
                  key={hw.id}
                  variant="primary"
                  padding="md"
                  className="border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all flex flex-col justify-between space-y-3.5 group shadow-xs"
                >
                  <div>
                    {/* Header: Icon, Category & Stock */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp size={20} />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-muted)] block">
                          {hw.category}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5 block">
                          {hw.model}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-2.5">
                      <h3 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                        {hw.name}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                        {hw.description}
                      </p>
                    </div>

                    {/* Compatibility Info */}
                    <div className="mt-3 p-2 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-[11px] text-[var(--color-text-secondary)] flex items-start gap-1.5">
                      <Info size={13} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{hw.compatibility}</span>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] block">
                        Hardware + Setup
                      </span>
                      <span className="text-sm font-mono font-bold text-[var(--color-text)]">
                        ₹{hw.priceINR.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailModalHardware(hw)}
                        className="text-xs px-2.5"
                      >
                        Specs
                      </Button>

                      {isAlreadyInstalled ? (
                        <span className="text-xs px-2.5 py-1.5 rounded-lg bg-green-500/10 text-green-700 dark:text-green-300 font-bold border border-green-500/30 flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Installed</span>
                        </span>
                      ) : isPendingRequest ? (
                        <span className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                          <Clock size={13} />
                          <span>Requested</span>
                        </span>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenRequest(hw)}
                          className="text-xs font-bold shadow-xs"
                        >
                          <Plus size={13} />
                          <span>Request Setup</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Surface>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY INSTALLED & PENDING DEVICES */}
      {activeTab === 'my_devices' && (
        <div className="space-y-6">
          {/* Pending Installation Requests */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2 mb-3">
              <Clock size={16} className="text-amber-500" />
              <span>Pending Installation &amp; Service Requests ({requestedDevices.length})</span>
            </h3>

            {requestedDevices.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
                No active device installation requests. Browse the catalogue to request additional smart contactors or sensors.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requestedDevices.map((req) => {
                  const hw = marketplaceHardware.find((h) => h.id === req.deviceId);
                  return (
                    <Surface
                      key={req.requestId}
                      variant="primary"
                      padding="md"
                      className="border border-amber-500/30 bg-amber-500/5 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                            {req.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <h4 className="text-sm font-bold text-[var(--color-text)] mt-1.5">
                            {hw ? hw.name : req.deviceName || req.deviceId}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                          {req.requestedDate}
                        </span>
                      </div>

                      <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-[var(--color-accent)]" />
                          <span>Slot: {req.preferredSlot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wrench size={13} className="text-[var(--color-accent)]" />
                          <span>Assigned Tech: Rajesh Kumar (Field Specialist)</span>
                        </div>
                        {req.notes && (
                          <p className="text-[11px] text-[var(--color-text-muted)] italic">
                            &ldquo;{req.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs">
                        <span className="text-[var(--color-text-muted)]">Site Assessment Required</span>
                        <Link
                          to="/installation"
                          className="font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1"
                        >
                          <span>Track Visit →</span>
                        </Link>
                      </div>
                    </Surface>
                  );
                })}
              </div>
            )}
          </div>

          {/* Currently Configured & Active Devices */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-[var(--color-success)]" />
              <span>Configured &amp; Active Household Hardware ({installedDevices.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {installedDevices.map((dev) => {
                const hw = marketplaceHardware.find((h) => h.id === dev.id);
                return (
                  <Surface
                    key={dev.serial || dev.id}
                    variant="primary"
                    padding="md"
                    className="border border-[var(--color-border)] space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/30">
                          {dev.status || 'Active & Online'}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--color-text)] mt-1.5">
                          {hw ? hw.name : dev.id}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--color-accent)] font-semibold">
                        {dev.serial}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                      {dev.circuit && (
                        <div>
                          <span className="text-[var(--color-text-muted)]">Circuit Assignment: </span>
                          <span className="font-semibold text-[var(--color-text)]">{dev.circuit}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-[var(--color-text-muted)]">Commissioned Date: </span>
                        <span>{dev.installedDate}</span>
                      </div>
                      <div>
                        <span className="text-[var(--color-text-muted)]">Telemetry Stream: </span>
                        <span className="text-[var(--color-success)] font-medium">True RMS · Live 230V</span>
                      </div>
                    </div>
                  </Surface>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: HARDWARE TECHNICAL SPECIFICATIONS */}
      {detailModalHardware && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface
            variant="primary"
            padding="lg"
            className="w-full max-w-lg border border-[var(--color-border)] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  {detailModalHardware.category}
                </span>
                <h3 className="text-base font-bold text-[var(--color-text)] mt-1">
                  {detailModalHardware.name}
                </h3>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  Model: {detailModalHardware.model}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalHardware(null)}
                className="text-lg font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {detailModalHardware.description}
            </p>

            {/* Specifications Table */}
            <div>
              <h4 className="text-xs font-bold text-[var(--color-text)] mb-2 uppercase tracking-wider font-mono">
                Technical Specifications:
              </h4>
              <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-1.5 text-xs">
                {Object.entries(detailModalHardware.specs || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="font-mono font-semibold text-[var(--color-text)] text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Installation Requirements */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <strong className="block font-semibold">Installation &amp; Safety Compliance:</strong>
              <p>{detailModalHardware.installationRequirement}</p>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[var(--color-text-muted)] block">Estimated Cost</span>
                <span className="text-base font-bold font-mono text-[var(--color-text)]">
                  ₹{detailModalHardware.priceINR.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDetailModalHardware(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const hw = detailModalHardware;
                    setDetailModalHardware(null);
                    handleOpenRequest(hw);
                  }}
                  className="text-xs font-bold"
                >
                  <Plus size={13} />
                  <span>Request Installation</span>
                </Button>
              </div>
            </div>
          </Surface>
        </div>
      )}

      {/* MODAL 2: REQUEST HARDWARE INSTALLATION DIALOG */}
      {isRequestModalOpen && targetHardware && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface
            variant="primary"
            padding="lg"
            className="w-full max-w-md border border-[var(--color-border)] shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                  <Wrench size={16} className="text-[var(--color-accent)]" />
                  <span>Request Hardware Installation</span>
                </h3>
                <span className="text-xs text-[var(--color-text-secondary)] mt-0.5 block">
                  {targetHardware.name} ({targetHardware.model})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="text-base font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {requestSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-sm font-bold text-[var(--color-text)]">
                  Installation Request Submitted!
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-xs mx-auto">
                  Your request has been routed to the 5AMPERE engineering queue. Lead technician Rajesh Kumar will confirm your slot.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmRequest} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Device:</span>
                    <span className="font-semibold text-[var(--color-text)]">{targetHardware.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Destination:</span>
                    <span className="font-semibold text-[var(--color-text)] truncate max-w-[200px]">
                      {activeCustomerHome?.address || 'Noida Home'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Hardware Cost:</span>
                    <span className="font-mono font-bold text-[var(--color-accent)]">
                      ₹{targetHardware.priceINR.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                    Select Preferred Visit Slot
                  </label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  >
                    <option value="Tomorrow Morning (10:00 AM – 01:00 PM)">Tomorrow Morning (10:00 AM – 01:00 PM)</option>
                    <option value="Tomorrow Afternoon (02:00 PM – 05:00 PM)">Tomorrow Afternoon (02:00 PM – 05:00 PM)</option>
                    <option value="Weekend Morning (10:00 AM – 01:00 PM)">Weekend Morning (10:00 AM – 01:00 PM)</option>
                    <option value="Weekend Evening (04:00 PM – 07:00 PM)">Weekend Evening (04:00 PM – 07:00 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                    Circuit / Appliance Notes for Technician
                  </label>
                  <textarea
                    rows={2}
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="e.g. Please wire this contactor to the Living Room 1.5T AC circuit."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="text-xs font-bold"
                  >
                    Submit Installation Request
                  </Button>
                </div>
              </form>
            )}
          </Surface>
        </div>
      )}
    </div>
  );
}

export default DeviceMarketplacePage;
