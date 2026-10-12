import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  MapPin,
  Phone,
  Mail,
  Zap,
  Sliders,
  CheckCircle2,
  Clock,
  Wrench,
  Cpu,
  ChevronRight,
  Shield,
  Eye,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

export function CustomerProfilesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSelectedId = searchParams.get('id');

  const { customerHomes, marketplaceHardware } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedHomeId, setSelectedHomeId] = useState(
    initialSelectedId || customerHomes[0]?.id || ''
  );

  // Filter list
  const filteredHomes = customerHomes.filter((h) => {
    const matchesSearch =
      h.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.phone.includes(searchQuery) ||
      h.meterNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || h.installationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedHome =
    customerHomes.find((h) => h.id === selectedHomeId) || customerHomes[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Operations & CRM"
        title="Customer Properties &amp; Electrical Profiles"
        badge="Field Roster"
        badgeColor="var(--color-accent)"
        description="Search customer records, inspect residential distribution boards, view registered appliances, and manage commissioned hardware."
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, locality, phone, or meter ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'pending_assessment', label: 'Pending Assessment' },
            { id: 'visit_scheduled', label: 'Visit Scheduled' },
            { id: 'installation_in_progress', label: 'Installing' },
            { id: 'configured', label: 'Configured' },
            { id: 'active', label: 'Active & Online' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === st.id
                  ? 'bg-[var(--color-surface-selected)] text-[var(--color-accent)] font-bold border border-[var(--color-accent)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Layout: Customer List (Left) + Selected Profile Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer Records Table / Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-bold block">
            Matching Properties ({filteredHomes.length})
          </span>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredHomes.map((home) => {
              const isSelected = home.id === selectedHome?.id;

              return (
                <div
                  key={home.id}
                  onClick={() => setSelectedHomeId(home.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] shadow-xs'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text)]">
                      {home.customerName}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        home.installationStatus === 'active' || home.installationStatus === 'completed'
                          ? 'bg-green-500/10 text-green-700 dark:text-green-300'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {home.installationStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                    {home.locality}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)] pt-1 border-t border-[var(--color-border-subtle)]">
                    <span>Meter: {home.meterNumber}</span>
                    <span className="font-bold text-[var(--color-accent)]">
                      {home.sanctionedLoadKw} kW
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Profile Inspector (7 cols) */}
        {selectedHome && (
          <div className="lg:col-span-7">
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-5">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--color-text)]">
                      {selectedHome.customerName}
                    </h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-accent)] font-bold">
                      {selectedHome.homeType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1.5">
                    <MapPin size={12} className="text-[var(--color-accent)] shrink-0" />
                    <span>{selectedHome.address}, {selectedHome.locality}</span>
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/technician/configure/${selectedHome.id}`)}
                  className="font-bold text-xs shrink-0 shadow-xs"
                >
                  <Sliders size={13} />
                  <span>Configure Panel Hardware</span>
                </Button>
              </div>

              {/* Electrical Parameters Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 font-mono">
                  Electrical Infrastructure
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Sanctioned Load</span>
                    <span className="text-xs font-mono font-bold text-[var(--color-text)]">
                      {selectedHome.sanctionedLoadKw} kW
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Utility DISCOM</span>
                    <span className="text-xs font-bold text-[var(--color-text)] truncate block">
                      {selectedHome.discom.split(' ')[0]}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">DISCOM Meter No.</span>
                    <span className="text-xs font-mono font-bold text-[var(--color-accent)]">
                      {selectedHome.meterNumber}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Floors</span>
                    <span className="text-xs font-mono font-bold text-[var(--color-text)]">
                      {selectedHome.floors} Floor(s)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Phone</span>
                    <span className="text-xs font-semibold text-[var(--color-text)]">
                      {selectedHome.phone}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Current Lifecycle</span>
                    <span className="text-xs font-bold uppercase text-[var(--color-accent)] truncate block">
                      {selectedHome.installationStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Commissioned Hardware on Property */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 font-mono flex items-center justify-between">
                  <span>Commissioned Hardware Modules ({(selectedHome.installedDevices || []).length})</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">Live in DB Panel</span>
                </h4>

                {(selectedHome.installedDevices || []).length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
                    No physical modules mounted yet. Use the Hardware Configurator to attach Gateway &amp; CT sensors.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedHome.installedDevices.map((dev) => {
                      const hw = marketplaceHardware.find((h) => h.id === dev.id);
                      return (
                        <div
                          key={dev.serial || dev.id}
                          className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5">
                            <Cpu size={16} className="text-[var(--color-accent)] shrink-0" />
                            <div>
                              <span className="text-xs font-bold text-[var(--color-text)] block">
                                {hw ? hw.name : dev.id}
                              </span>
                              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                                S/N: {dev.serial} {dev.circuit ? `· ${dev.circuit}` : ''}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-700 dark:text-green-300 font-bold shrink-0">
                            {dev.status || 'Active'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pending Device Addition Requests */}
              {(selectedHome.requestedDevices || []).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 font-mono flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Pending Device Requests ({(selectedHome.requestedDevices || []).length})</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedHome.requestedDevices.map((req) => {
                      const hw = marketplaceHardware.find((h) => h.id === req.deviceId);
                      return (
                        <div
                          key={req.requestId}
                          className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-bold text-[var(--color-text)] block">
                              {hw ? hw.name : req.deviceId}
                            </span>
                            <span className="text-[10px] text-[var(--color-text-secondary)]">
                              Slot: {req.preferredSlot}
                            </span>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate(`/technician/configure/${selectedHome.id}`)}
                            className="text-[11px] px-2 py-1 font-bold"
                          >
                            Attach to Setup
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Registered Household Appliances */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 font-mono">
                  Registered Appliances ({(selectedHome.registeredAppliances || []).length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedHome.registeredAppliances || []).map((app, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </Surface>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerProfilesPage;
