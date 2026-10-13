import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  Info,
  Cpu,
  Activity,
  Zap,
  Radio,
  Plug,
  Eye,
  Gauge,
  Plus,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

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
  'All Hardware',
  'Energy Monitoring',
  'Heavy Appliance Contactor',
  'Smart Switches & Relays',
  'Automation & Sensors',
  'Whole-Panel Submetering',
];

export function DeviceMarketplacePage() {
  const {
    marketplaceHardware,
    activeCustomerProperty,
    requestDeviceInstallation,
  } = useAuth();

  const property = activeCustomerProperty || {};
  const installedDevices = property.installedDevices || [];
  const ownedPendingDevices = property.ownedPendingDevices || [];
  const requestedDevices = property.requestedDevices || [];
  const rooms = property.rooms || [];

  const [activeTab, setActiveTab] = useState('catalogue'); // 'catalogue' | 'my_hardware'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Hardware');

  // Specs Modal
  const [detailModalHardware, setDetailModalHardware] = useState(null);

  // Request Hardware Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [targetHardware, setTargetHardware] = useState(null);
  const [targetAssignment, setTargetAssignment] = useState('Main Incomer (Busbar)');
  const [preferredSlot, setPreferredSlot] = useState('Saturday Morning (10:00 AM – 01:00 PM)');
  const [requestNotes, setRequestNotes] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [deviceOwnership, setDeviceOwnership] = useState('new_request'); // 'new_request' | 'owned_unconfigured'

  const filteredHardware = marketplaceHardware.filter((hw) => {
    const matchesCategory =
      selectedCategory === 'All Hardware' || hw.category === selectedCategory;
    const matchesSearch =
      hw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenRequest = (hw) => {
    setTargetHardware(hw);
    setDeviceOwnership('new_request');
    setRequestSuccess(false);
    setRequestNotes('');
    if (rooms.length > 0) {
      setTargetAssignment(`${rooms[0].name} Circuit`);
    } else {
      setTargetAssignment('Main Incomer Panel');
    }
    setIsRequestModalOpen(true);
  };

  const handleConfirmRequest = (e) => {
    e.preventDefault();
    if (!targetHardware) return;

    requestDeviceInstallation(
      property.id,
      targetHardware.id,
      targetAssignment,
      preferredSlot,
      requestNotes,
      deviceOwnership
    );

    setRequestSuccess(true);
    setTimeout(() => {
      setIsRequestModalOpen(false);
      setRequestSuccess(false);
      setActiveTab('my_hardware');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Hardware & Ecosystem"
        title="Smart Energy Device Catalogue"
        badge="Certified 5AMPERE Hardware"
        badgeColor="var(--color-accent)"
        description="Browse certified edge gateways, split-core CT sensors, DIN contactor relays, and request professional on-site electrical installation."
      >
        <Link to="/installation">
          <Button variant="secondary" size="sm" className="text-xs">
            <Wrench size={13} />
            <span>Service Progress ({requestedDevices.length} Pending)</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Safety & Protocol Banner */}
      <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Professional Electrical Installation Protocol:</strong> Main breaker and contactor hardware requires physical wiring by a certified field wireman. Submitting an item books a scheduled installation visit.
          </span>
        </div>
        <Link
          to="/installation"
          className="font-bold text-xs underline shrink-0 hover:opacity-80 text-emerald-700 dark:text-emerald-300"
        >
          View Installation Protocol →
        </Link>
      </div>

      {/* Main Tab Controls */}
      <div className="flex items-center justify-between border-b border-(--color-border) pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('catalogue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalogue'
                ? 'bg-(--color-accent-subtle) text-(--color-accent) border border-(--color-accent)'
                : 'text-(--color-text-secondary) hover:text-(--color-text)'
            }`}
          >
            Hardware Catalogue ({marketplaceHardware.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my_hardware')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'my_hardware'
                ? 'bg-(--color-accent-subtle) text-(--color-accent) border border-(--color-accent)'
                : 'text-(--color-text-secondary) hover:text-(--color-text)'
            }`}
          >
            <span>My Hardware Status</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-(--color-surface-secondary) border border-(--color-border)">
              {installedDevices.length + requestedDevices.length + ownedPendingDevices.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: SEARCHABLE CATALOGUE */}
      {activeTab === 'catalogue' && (
        <div className="space-y-4">
          {/* Search & Category Pills */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hardware name, model, or specs..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'bg-(--color-surface-selected) text-(--color-accent) font-bold border border-(--color-accent)'
                      : 'bg-(--color-surface) text-(--color-text-secondary) border border-(--color-border) hover:bg-(--color-surface-secondary)'
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
              const isInstalled = installedDevices.some((d) => d.id === hw.id);
              const isRequested = requestedDevices.some((d) => d.deviceId === hw.id);

              return (
                <Surface
                  key={hw.id}
                  variant="primary"
                  padding="md"
                  className="border border-(--color-border) hover:border-(--color-accent) transition-all flex flex-col justify-between space-y-3 group shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-(--color-accent-subtle) border border-(--color-accent)/20 text-(--color-accent) flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <IconComp size={20} />
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-(--color-surface-secondary) border border-(--color-border) text-(--color-text-muted) block">
                          {hw.category}
                        </span>
                        <span className="text-[10px] font-mono text-(--color-text-muted) mt-0.5 block">
                          {hw.model}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <h3 className="text-sm font-bold text-(--color-text) group-hover:text-(--color-accent) transition-colors">
                        {hw.name}
                      </h3>
                      <p className="text-xs text-(--color-text-secondary) mt-1 line-clamp-2 leading-relaxed">
                        {hw.description}
                      </p>
                    </div>

                    <div className="mt-3 p-2 rounded-lg bg-(--color-surface-secondary) border border-(--color-border-subtle) text-[11px] text-(--color-text-secondary) flex items-start gap-1.5">
                      <Info size={13} className="text-(--color-accent) shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{hw.compatibility}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-(--color-border-subtle) flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-(--color-text-muted) block">Price (INR)</span>
                      <span className="text-sm font-mono font-bold text-(--color-text)">
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

                      {isInstalled ? (
                        <span className="text-xs px-2.5 py-1.5 rounded-lg bg-green-500/10 text-green-700 dark:text-green-300 font-bold border border-green-500/30 flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>Installed</span>
                        </span>
                      ) : isRequested ? (
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

      {/* TAB 2: MY HARDWARE STATUS (4 CATEGORIES DISTINGUISHED) */}
      {activeTab === 'my_hardware' && (
        <div className="space-y-6">
          {/* 1. Installed & Commissioned */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
              <CheckCircle2 size={16} className="text-(--color-success)" />
              <span>1. Configured &amp; Active Household Hardware ({installedDevices.length})</span>
            </h3>

            {installedDevices.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-(--color-border) text-center text-xs text-(--color-text-muted)">
                No physical devices installed yet. Once a 5AMPERE technician completes your site visit, commissioned hardware will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {installedDevices.map((dev) => {
                  const hw = marketplaceHardware.find((h) => h.id === dev.id);
                  return (
                    <Surface
                      key={dev.serial || dev.id}
                      variant="primary"
                      padding="md"
                      className="border border-(--color-border) space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/30">
                            {dev.status || 'Active & Online'}
                          </span>
                          <h4 className="text-sm font-bold text-(--color-text) mt-1.5">
                            {hw ? hw.name : dev.id}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-(--color-accent) font-semibold">
                          {dev.serial}
                        </span>
                      </div>

                      <div className="text-xs text-(--color-text-secondary) space-y-1">
                        <div>
                          <span className="text-(--color-text-muted)">Location / Circuit: </span>
                          <span className="font-semibold text-(--color-text)">{dev.location || 'Main Panel'}</span>
                        </div>
                        <div>
                          <span className="text-(--color-text-muted)">Commissioned: </span>
                          <span>{dev.installedDate}</span>
                        </div>
                      </div>
                    </Surface>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Owned by Customer (Pending Configuration) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
              <Package size={16} className="text-purple-600 dark:text-purple-400" />
              <span>2. Devices Owned by Customer (Pending On-Site Wiring) ({ownedPendingDevices.length})</span>
            </h3>

            {ownedPendingDevices.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-(--color-border) text-xs text-(--color-text-muted)">
                You do not have any unconfigured customer-owned devices.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ownedPendingDevices.map((dev, idx) => (
                  <Surface
                    key={idx}
                    variant="primary"
                    padding="md"
                    className="border border-purple-500/30 bg-purple-500/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-(--color-text)">
                        {dev.name || dev.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold">
                        Owned - Unwired
                      </span>
                    </div>
                    <p className="text-[11px] text-(--color-text-secondary)">
                      Customer has procured this sensor. A technician will mount it in your distribution board during the next scheduled visit.
                    </p>
                  </Surface>
                ))}
              </div>
            )}
          </div>

          {/* 3. New Hardware Requests */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
              <Clock size={16} className="text-amber-500" />
              <span>3. New Hardware Requested (Pending Technician Visit) ({requestedDevices.length})</span>
            </h3>

            {requestedDevices.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-(--color-border) text-center text-xs text-(--color-text-muted)">
                No pending requests. Browse the catalogue above to request additional contactor relays or CT sensors.
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
                            {req.status.replaceAll('_', ' ').toUpperCase()}
                          </span>
                          <h4 className="text-sm font-bold text-(--color-text) mt-1.5">
                            {hw ? hw.name : req.deviceName || req.deviceId}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-(--color-text-muted)">
                          {req.requestedDate}
                        </span>
                      </div>

                      <div className="text-xs text-(--color-text-secondary) space-y-1">
                        <div>
                          <span className="text-(--color-text-muted)">Assignment: </span>
                          <span className="font-semibold text-(--color-text)">{req.targetAssignment}</span>
                        </div>
                        <div>
                          <span className="text-(--color-text-muted)">Preferred Slot: </span>
                          <span>{req.preferredSlot}</span>
                        </div>
                        {req.notes && (
                          <p className="text-[11px] text-(--color-text-muted) italic">
                            &ldquo;{req.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-(--color-border-subtle) flex items-center justify-between text-xs">
                        <span className="text-(--color-text-muted)">Technician Assigned: Rajesh Kumar</span>
                        <Link
                          to="/installation"
                          className="font-bold text-(--color-accent) hover:underline flex items-center gap-1"
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
        </div>
      )}

      {/* MODAL 1: SPECIFICATIONS */}
      {detailModalHardware && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface
            variant="primary"
            padding="lg"
            className="w-full max-w-lg border border-(--color-border) shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between border-b border-(--color-border) pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-(--color-accent)">
                  {detailModalHardware.category}
                </span>
                <h3 className="text-base font-bold text-(--color-text) mt-1">
                  {detailModalHardware.name}
                </h3>
                <span className="text-xs font-mono text-(--color-text-muted)">
                  Model: {detailModalHardware.model}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalHardware(null)}
                className="text-lg font-bold text-(--color-text-muted) hover:text-(--color-text) cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-(--color-text-secondary) leading-relaxed">
              {detailModalHardware.description}
            </p>

            <div>
              <h4 className="text-xs font-bold text-(--color-text) mb-2 uppercase tracking-wider font-mono">
                Technical Specifications:
              </h4>
              <div className="p-3 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) space-y-1.5 text-xs">
                {Object.entries(detailModalHardware.specs || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-(--color-text-muted) capitalize">{key}:</span>
                    <span className="font-mono font-semibold text-(--color-text) text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <strong className="block font-semibold">Installation &amp; Safety Compliance:</strong>
              <p>{detailModalHardware.installationRequirement}</p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-(--color-text-muted) block">Price (INR)</span>
                <span className="text-base font-bold font-mono text-(--color-text)">
                  ₹{detailModalHardware.priceINR.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setDetailModalHardware(null)} className="text-xs">
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

      {/* MODAL 2: REQUEST HARDWARE & SELECT ASSIGNMENT */}
      {isRequestModalOpen && targetHardware && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface variant="primary" padding="lg" className="w-full max-w-md border border-(--color-border) shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-(--color-border) pb-3">
              <div>
                <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                  <Wrench size={16} className="text-(--color-accent)" />
                  <span>Request Hardware Installation</span>
                </h3>
                <span className="text-xs text-(--color-text-secondary) mt-0.5 block">
                  {targetHardware.name} ({targetHardware.model})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="text-base font-bold text-(--color-text-muted) cursor-pointer"
              >
                ✕
              </button>
            </div>

            {requestSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-sm font-bold text-(--color-text)">Installation Request Submitted!</h4>
                <p className="text-xs text-(--color-text-secondary) max-w-xs mx-auto">
                  Your request has been routed to lead technician Rajesh Kumar. Scheduled slot: {preferredSlot}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmRequest} className="space-y-3.5">
                {/* Ownership Type */}
                <div>
                  <label className="block text-xs font-semibold text-(--color-text) mb-1">
                    Device Ownership
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDeviceOwnership('new_request')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        deviceOwnership === 'new_request'
                          ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent) font-bold'
                          : 'bg-(--color-surface) border-(--color-border) text-(--color-text-secondary)'
                      }`}
                    >
                      <span>New 5AMPERE Order</span>
                      <span className="text-[10px] block opacity-75">Procure &amp; Install</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeviceOwnership('owned_unconfigured')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        deviceOwnership === 'owned_unconfigured'
                          ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent) font-bold'
                          : 'bg-(--color-surface) border-(--color-border) text-(--color-text-secondary)'
                      }`}
                    >
                      <span>Customer-Owned</span>
                      <span className="text-[10px] block opacity-75">Wiring Only</span>
                    </button>
                  </div>
                </div>

                {/* Assignment Target */}
                <div>
                  <label className="block text-xs font-semibold text-(--color-text) mb-1">
                    Assign to Room / Circuit / Panel
                  </label>
                  <select
                    value={targetAssignment}
                    onChange={(e) => setTargetAssignment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                  >
                    <option value="Main Incomer (Busbar)">Main Incomer (Busbar)</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={`${r.name} Circuit`}>
                        {r.name} Circuit
                      </option>
                    ))}
                    <option value="Whole Property Sub-Panel">Whole Property Sub-Panel</option>
                    <option value="Other Custom Circuit">Other Custom Circuit</option>
                  </select>
                </div>

                {/* Preferred Slot */}
                <div>
                  <label className="block text-xs font-semibold text-(--color-text) mb-1">
                    Preferred Technician Visit Slot
                  </label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                  >
                    <option value="Tomorrow Morning (10:00 AM – 01:00 PM)">Tomorrow Morning (10:00 AM – 01:00 PM)</option>
                    <option value="Tomorrow Afternoon (02:00 PM – 05:00 PM)">Tomorrow Afternoon (02:00 PM – 05:00 PM)</option>
                    <option value="Saturday Morning (10:00 AM – 01:00 PM)">Saturday Morning (10:00 AM – 01:00 PM)</option>
                    <option value="Sunday Afternoon (02:00 PM – 05:00 PM)">Sunday Afternoon (02:00 PM – 05:00 PM)</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold text-(--color-text) mb-1">
                    Installation Notes for Technician
                  </label>
                  <textarea
                    rows={2}
                    value={requestNotes}
                    onChange={(e) => setRequestNotes(e.target.value)}
                    placeholder="e.g. Please wire contactor on AC circuit breaker in the master distribution board."
                    className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsRequestModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="text-xs font-bold">
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
