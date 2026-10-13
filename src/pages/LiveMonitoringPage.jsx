import { Info } from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { PageHeader } from '../components/common/PageHeader';
import { ProductVisualization } from '../components/home/ProductVisualization';
import { useEnergyData } from '../context/EnergyDataContext';

export function LiveMonitoringPage() {
  const { totalActiveKw, totalActiveWatts, currentAmps, metadata } = useEnergyData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Monitoring"
        title="Live Power &amp; Line Telemetry"
        badge="50 Hz Synchronized"
        badgeColor="var(--color-success)"
        description="Instantaneous single-phase electrical measurements, power draw, and real-time energy conduit flow."
      />

      {/* Primary Electrical Gauges (5 core parameters) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Active Power */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-1">
          <span className="text-[11px] font-medium text-(--color-text-secondary) block">Active Power</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-mono font-extrabold text-(--color-text)">
              {totalActiveKw.toFixed(2)}
            </span>
            <span className="text-xs font-mono font-bold text-(--color-text-secondary)">kW</span>
          </div>
          <span className="text-[10px] font-mono text-(--color-text-muted) block">
            {totalActiveWatts} Watts Total
          </span>
        </Surface>

        {/* Metric 2: Estimated Current */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-(--color-text-secondary)">Current</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-(--color-surface-secondary) text-(--color-text-muted) border border-(--color-border)">
              Est.
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-mono font-extrabold text-(--color-accent)">
              {currentAmps}
            </span>
            <span className="text-xs font-mono font-bold text-(--color-text-secondary)">A</span>
          </div>
          <span className="text-[10px] font-mono text-(--color-text-muted) block">
            PF 0.95 Compensated
          </span>
        </Surface>

        {/* Metric 3: Nominal Voltage */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-1">
          <span className="text-[11px] font-medium text-(--color-text-secondary) block">Voltage</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-mono font-extrabold text-(--color-text)">
              230
            </span>
            <span className="text-xs font-mono font-bold text-(--color-text-secondary)">V AC</span>
          </div>
          <span className="text-[10px] font-mono text-(--color-text-muted) block">
            Single-Phase Nominal
          </span>
        </Surface>

        {/* Metric 4: Power Factor */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-1">
          <span className="text-[11px] font-medium text-(--color-text-secondary) block">Power Factor</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-mono font-extrabold text-(--color-text)">
              0.95
            </span>
          </div>
          <span className="text-[10px] font-mono text-(--color-success) font-medium block">
            Lagging (Typical)
          </span>
        </Surface>

        {/* Metric 5: Line Frequency */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-1">
          <span className="text-[11px] font-medium text-(--color-text-secondary) block">Frequency</span>
          <div className="flex items-baseline gap-1.5 pt-1">
            <span className="text-2xl font-mono font-extrabold text-(--color-text)">
              50.0
            </span>
            <span className="text-xs font-mono font-bold text-(--color-text-secondary)">Hz</span>
          </div>
          <span className="text-[10px] font-mono text-(--color-success) font-medium block">
            Grid Synchronized
          </span>
        </Surface>
      </div>

      {/* Telemetry Derivation Note */}
      <div className="p-2.5 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) text-[11px] text-(--color-text-secondary) flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-(--color-accent) shrink-0" />
          <span>
            Current (A) estimated at nominal 230V with 0.95 power factor compensation (calibrated household model).
          </span>
        </div>
        <span className="font-mono text-[10px] text-(--color-text-muted)">
          I = P / (230 × 0.95)
        </span>
      </div>

      {/* Physical-to-Digital System Topology & Energy Conduit Flow (Preserved Component) */}
      <ProductVisualization />
    </div>
  );
}

export default LiveMonitoringPage;

