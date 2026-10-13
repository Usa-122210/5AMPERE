import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Wrench,
  Cpu,
  Plus,
  Trash2,
  Save,
  Search,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

const WORKFLOW_STAGES = [
  { id: 'visit_scheduled', label: '1. Visit Scheduled', desc: 'Customer appointment confirmed.' },
  { id: 'assessment_completed', label: '2. Assessment Done', desc: 'Panel space & sanction load verified.' },
  { id: 'installation_in_progress', label: '3. Installation In Progress', desc: 'Hardware wired in breaker board.' },
  { id: 'configured', label: '4. Configured & Calibrated', desc: 'Wi-Fi linked, True RMS matched.' },
  { id: 'completed', label: '5. Completed & Commissioned', desc: 'Active telemetry stream running.' },
];

export function HomeConfiguratorPage() {
  const { homeId: urlHomeId } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedDevice = searchParams.get('attachDevice');
  const navigate = useNavigate();

  const {
    customerHomes,
    marketplaceHardware,
    attachDeviceToHome,
    detachDeviceFromHome,
    updateHomeWorkflowStage,
  } = useAuth();

  // Active home selection
  const [selectedHomeId, setSelectedHomeId] = useState(
    urlHomeId || customerHomes[0]?.id || ''
  );

  useEffect(() => {
    if (urlHomeId && urlHomeId !== selectedHomeId) {
      setSelectedHomeId(urlHomeId);
    }
  }, [urlHomeId]);

  const activeHome =
    customerHomes.find((h) => h.id === selectedHomeId) || customerHomes[0];

  // Configurator working state
  const [currentStage, setCurrentStage] = useState(
    activeHome?.installationStatus || 'visit_scheduled'
  );
  const [technicianNotes, setTechnicianNotes] = useState(
    activeHome?.technicianNotes || 'Initial distribution board assessment.'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize when home changes
  useEffect(() => {
    if (activeHome) {
      setCurrentStage(activeHome.installationStatus || 'visit_scheduled');
      setTechnicianNotes(
        activeHome.technicianNotes ||
          `Electrical inspection completed at ${activeHome.locality}. Panel breaker rating: 40A DP.`
      );
    }
  }, [activeHome?.id]);

  // Component catalogue search in configurator
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [circuitAssignment, setCircuitAssignment] = useState('Main Incomer (Busbar)');

  const filteredCatalogue = marketplaceHardware.filter((hw) => {
    const matchCat =
      selectedCategory === 'All' || hw.category === selectedCategory;
    const matchSearch =
      hw.name.toLowerCase().includes(catalogueSearch.toLowerCase()) ||
      hw.model.toLowerCase().includes(catalogueSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  // Attach a device
  const handleAttachDevice = (deviceId) => {
    attachDeviceToHome(activeHome.id, deviceId, circuitAssignment);
  };

  // Detach a device
  const handleDetachDevice = (serialOrId) => {
    detachDeviceFromHome(activeHome.id, serialOrId);
  };

  // Save stage and notes
  const handleSaveConfiguration = () => {
    updateHomeWorkflowStage(activeHome.id, currentStage, technicianNotes);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Panel Engineering"
        title="Hardware &amp; Panel Configurator"
        badge="Field Configurator"
        badgeColor="var(--color-accent)"
        description="Attach certified smart energy hardware modules to customer properties, assign circuit lines, and transition commissioning stages."
      >
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs text-(--color-success) font-bold flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 size={14} />
              <span>Saved!</span>
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveConfiguration}
            className="font-bold text-xs shadow-xs"
          >
            <Save size={13} />
            <span>Save Setup &amp; Stage</span>
          </Button>
        </div>
      </PageHeader>

      {/* Customer Home Selector Bar */}
      <Surface variant="primary" padding="md" className="border border-(--color-border) flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-(--color-text)">
            Active Property:
          </span>
          <select
            value={selectedHomeId}
            onChange={(e) => {
              setSelectedHomeId(e.target.value);
              navigate(`/developer/configure/${e.target.value}`);
            }}
            className="px-3 py-1.5 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs font-semibold text-(--color-text) focus:outline-none focus:border-(--color-accent)"
          >
            {customerHomes.map((h) => (
              <option key={h.id} value={h.id}>
                {h.customerName} — {h.locality} ({h.sanctionedLoadKw} kW)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-(--color-text-secondary)">
          <span>Meter: <strong>{activeHome?.meterNumber}</strong></span>
          <span>·</span>
          <span>DISCOM: <strong>{activeHome?.discom?.split(' ')[0]}</strong></span>
        </div>
      </Surface>

      {/* Main 2-Column Split: Configured Setup & Stage Updater (Left) + Component Catalogue (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 Cols): Workflow Stage & Installed Hardware */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Workflow Stage Selector */}
          <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                  <Wrench size={16} className="text-(--color-accent)" />
                  <span>Commissioning Workflow Stage</span>
                </h3>
                <p className="text-xs text-(--color-text-secondary) mt-0.5">
                  Advance the customer&apos;s installation status across the 5 lifecycle phases:
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-(--color-surface-secondary) border border-(--color-border) text-(--color-accent) font-bold uppercase">
                {currentStage.replaceAll('_', ' ')}
              </span>
            </div>

            {/* Stage Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {WORKFLOW_STAGES.map((st, i) => {
                const isSelected = currentStage === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCurrentStage(st.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent) font-bold shadow-xs'
                        : 'bg-(--color-surface) border-(--color-border) text-(--color-text-secondary) hover:border-(--color-text-muted)'
                    }`}
                  >
                    <span className="text-[10px] font-mono block mb-1">Phase 0{i + 1}</span>
                    <span className="text-xs font-bold block truncate">{st.label.split('. ')[1]}</span>
                  </button>
                );
              })}
            </div>

            {/* Technician Field Notes */}
            <div>
              <label className="block text-xs font-semibold text-(--color-text) mb-1">
                Technician Field &amp; Calibration Notes
              </label>
              <textarea
                rows={2}
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                placeholder="e.g. 100A CT clamps clamped onto incoming Phase lines. 32A DIN contactor wired to AC line."
                className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
              />
            </div>
          </Surface>

          {/* 2. Attached / Configured Hardware on this Home */}
          <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-4">
            <div className="flex items-center justify-between border-b border-(--color-border) pb-3">
              <div>
                <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                  <Cpu size={16} className="text-(--color-accent)" />
                  <span>Configured Panel Hardware ({(activeHome?.installedDevices || []).length})</span>
                </h3>
                <span className="text-xs text-(--color-text-secondary)">
                  Physical modules mounted in {activeHome?.customerName}&apos;s distribution board
                </span>
              </div>
              <span className="text-[10px] font-mono text-(--color-text-muted)">
                Live DB Topology
              </span>
            </div>

            {(activeHome?.installedDevices || []).length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-(--color-border) text-center text-xs text-(--color-text-muted) space-y-1">
                <p className="font-semibold">No hardware attached to this property yet.</p>
                <p>Select components from the catalogue on the right and click &ldquo;Attach to Panel Setup&rdquo;.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeHome.installedDevices.map((dev) => {
                  const hw = marketplaceHardware.find((h) => h.id === dev.id);

                  return (
                    <div
                      key={dev.serial || dev.id}
                      className="p-3 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-(--color-surface) border border-(--color-border) text-(--color-accent) flex items-center justify-center font-bold text-xs shrink-0">
                          <Cpu size={15} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-(--color-text)">
                              {hw ? hw.name : dev.id}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-green-500/10 text-green-700 dark:text-green-300 font-bold">
                              {dev.status || 'Active'}
                            </span>
                          </div>
                          <div className="text-[11px] text-(--color-text-muted) font-mono mt-0.5">
                            Serial: <span className="text-(--color-accent)">{dev.serial}</span> · Line: <span>{dev.circuit || 'Main Panel'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDetachDevice(dev.serial || dev.id)}
                        className="p-1.5 rounded-lg text-(--color-text-muted) hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Remove from panel setup"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Surface>
        </div>

        {/* RIGHT COLUMN (5 Cols): Component Selector (Shopping-App Style) */}
        <div className="lg:col-span-5 space-y-4">
          <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                <Plus size={16} className="text-(--color-accent)" />
                <span>Component Selector &amp; Attachment</span>
              </h3>
              <p className="text-xs text-(--color-text-secondary) mt-0.5">
                Browse certified hardware and attach to {activeHome?.customerName}&apos;s breaker setup:
              </p>
            </div>

            {/* Target Circuit Selector */}
            <div className="p-2.5 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) space-y-1">
              <label className="block text-[11px] font-semibold text-(--color-text)">
                Assign Circuit / Appliance:
              </label>
              <select
                value={circuitAssignment}
                onChange={(e) => setCircuitAssignment(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
              >
                {activeHome?.rooms && activeHome.rooms.length > 0 && (
                  <optgroup label="Property Rooms &amp; Appliances">
                    {activeHome.rooms.map((room) =>
                      room.appliances?.map((app) => (
                        <option
                          key={`${room.id}-${app.id}`}
                          value={`${room.name} · ${app.name} (${app.drawKw}kW)`}
                        >
                          {room.name} — {app.name} ({app.drawKw} kW)
                        </option>
                      ))
                    )}
                    {activeHome.rooms.map((room) => (
                      <option key={`sub-${room.id}`} value={`${room.name} Sub-Circuit`}>
                        {room.name} — Sub-Circuit Breaker
                      </option>
                    ))}
                  </optgroup>
                )}

                {activeHome?.circuits && activeHome.circuits.length > 0 && (
                  <optgroup label="Property Circuits">
                    {activeHome.circuits.map((ckt) => (
                      <option key={ckt.id} value={ckt.name}>
                        {ckt.name} ({ckt.rating || '16A'})
                      </option>
                    ))}
                  </optgroup>
                )}

                <optgroup label="Distribution Board Busbars &amp; Heavy Feeds">
                  <option value="Main Incomer (Busbar Phase A)">Main Incomer (Busbar Phase A)</option>
                  <option value="Main Incomer (Busbar Phase B)">Main Incomer (Busbar Phase B)</option>
                  <option value="Main Incomer (Busbar Phase C)">Main Incomer (Busbar Phase C)</option>
                  <option value="Whole House Incomer (3-Phase)">Whole House Incomer (3-Phase)</option>
                  <option value="EV Charger Sub-circuit (32A)">EV Charger Sub-circuit (32A)</option>
                  <option value="Solar Net Meter Feeder">Solar Net Meter Feeder</option>
                </optgroup>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
              />
              <input
                type="text"
                value={catalogueSearch}
                onChange={(e) => setCatalogueSearch(e.target.value)}
                placeholder="Search modules..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
              />
            </div>

            {/* Catalogue Component Cards */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredCatalogue.map((hw) => {
                const isAlreadyAttached = (activeHome?.installedDevices || []).some(
                  (d) => d.id === hw.id
                );
                const isPreselected = preselectedDevice === hw.id;

                return (
                  <div
                    key={hw.id}
                    className={`p-3 rounded-xl border transition-all space-y-2 ${
                      isPreselected
                        ? 'border-(--color-accent) bg-(--color-accent-subtle)'
                        : 'border-(--color-border) bg-(--color-surface) hover:border-(--color-accent)'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-(--color-text-muted) block">
                          {hw.category}
                        </span>
                        <h4 className="text-xs font-bold text-(--color-text)">
                          {hw.name}
                        </h4>
                        <span className="text-[10px] font-mono text-(--color-accent)">
                          {hw.model}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-(--color-text) shrink-0">
                        ₹{hw.priceINR.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-[11px] text-(--color-text-secondary) line-clamp-2">
                      {hw.description}
                    </p>

                    <div className="pt-2 border-t border-(--color-border-subtle) flex items-center justify-between">
                      <span className="text-[10px] text-(--color-text-muted)">
                        Certified DIN Module
                      </span>

                      <Button
                        variant={isAlreadyAttached ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleAttachDevice(hw.id)}
                        className="text-xs px-2.5 py-1 font-bold"
                      >
                        <Plus size={12} />
                        <span>{isAlreadyAttached ? 'Add Another' : 'Attach to Setup'}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}

export default HomeConfiguratorPage;

