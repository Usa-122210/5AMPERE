import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Cpu,
  Activity,
  Zap,
  Radio,
  Plug,
  Eye,
  Gauge,
  Sliders,
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

export function TechnicianCataloguePage() {
  const navigate = useNavigate();
  const { marketplaceHardware } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Hardware');
  const [selectedHw, setSelectedHw] = useState(null);

  const filteredHardware = marketplaceHardware.filter((hw) => {
    const matchesCategory =
      selectedCategory === 'All Hardware' || hw.category === selectedCategory;
    const matchesSearch =
      hw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Hardware Engineering"
        title="Component Catalogue &amp; Specifications"
        badge="Certified 5AMPERE Hardware"
        badgeColor="var(--color-accent)"
        description="Technical specifications, DIN module dimensions, wiring guidelines, and van inventory for field installation."
      />

      {/* Search & Category Filter Controls */}
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
            placeholder="Search certified components by model, DIN module, or specs..."
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

      {/* Grid of Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHardware.map((hw) => {
          const IconComp = ICON_MAP[hw.icon] || Cpu;

          return (
            <Surface
              key={hw.id}
              variant="primary"
              padding="md"
              className="border border-(--color-border) hover:border-(--color-accent) transition-all flex flex-col justify-between space-y-3.5 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-(--color-accent-subtle) border border-(--color-accent)/20 text-(--color-accent) flex items-center justify-center shrink-0">
                    <IconComp size={20} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-(--color-surface-secondary) border border-(--color-border) text-(--color-text-muted) block">
                      {hw.category}
                    </span>
                    <span className="text-[10px] font-mono text-(--color-accent) font-bold mt-0.5 block">
                      {hw.model}
                    </span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <h3 className="text-sm font-bold text-(--color-text)">
                    {hw.name}
                  </h3>
                  <p className="text-xs text-(--color-text-secondary) mt-1 line-clamp-2 leading-relaxed">
                    {hw.description}
                  </p>
                </div>

                {/* Specs Snippet */}
                <div className="mt-3 p-2.5 rounded-xl bg-(--color-surface-secondary) border border-(--color-border-subtle) space-y-1 text-[11px]">
                  {Object.entries(hw.specs || {}).slice(0, 3).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-(--color-text-muted) capitalize">{k}:</span>
                      <span className="font-mono font-semibold text-(--color-text) truncate max-w-42.5 text-right">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-(--color-border-subtle) flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedHw(hw)}
                  className="text-xs"
                >
                  Full Specs
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/developer/configure?attachDevice=${hw.id}`)}
                  className="text-xs font-bold"
                >
                  <Sliders size={13} />
                  <span>Attach to Home</span>
                </Button>
              </div>
            </Surface>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface
            variant="primary"
            padding="lg"
            className="w-full max-w-lg border border-(--color-border) shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between border-b border-(--color-border) pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-(--color-accent)">
                  {selectedHw.category}
                </span>
                <h3 className="text-base font-bold text-(--color-text) mt-1">
                  {selectedHw.name}
                </h3>
                <span className="text-xs font-mono text-(--color-text-muted)">
                  {selectedHw.model}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHw(null)}
                className="text-lg font-bold text-(--color-text-muted) hover:text-(--color-text) cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-(--color-text-secondary) leading-relaxed">
              {selectedHw.description}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-(--color-text) mb-2 font-mono">
                Engineering Specifications:
              </h4>
              <div className="p-3 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) space-y-1.5 text-xs">
                {Object.entries(selectedHw.specs || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-(--color-text-muted) capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="font-mono font-semibold text-(--color-text) text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <strong className="block font-semibold">Wiring &amp; Installation Guideline:</strong>
              <p>{selectedHw.installationRequirement}</p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedHw(null)}
                className="text-xs"
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const devId = selectedHw.id;
                  setSelectedHw(null);
                  navigate(`/developer/configure?attachDevice=${devId}`);
                }}
                className="text-xs font-bold"
              >
                <Sliders size={13} />
                <span>Attach to Customer Panel</span>
              </Button>
            </div>
          </Surface>
        </div>
      )}
    </div>
  );
}

export default TechnicianCataloguePage;

