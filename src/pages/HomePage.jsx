import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  Radio,
  ShieldCheck,
  Sliders,
  Zap,
} from 'lucide-react';
import { EnergyOverview } from '../components/dashboard/EnergyOverview';
import { EnergyUsageTrends } from '../components/dashboard/EnergyUsageTrends';
import { HouseholdLoads } from '../components/dashboard/HouseholdLoads';
import { EnergyInsights } from '../components/dashboard/EnergyInsights';
import { ProductVisualization } from '../components/home/ProductVisualization';
import { Footer } from '../components/home/Footer';

/**
 * HomePage — 5AMPERE Smart Energy Management Platform Application.
 *
 * Designed as a real, usable energy management web application:
 *   1. Hardware Sub-Panel Status Banner (Local edge telemetry, DIN-rail status)
 *   2. Energy Overview (Live kW/A draw, daily kWh, tariff cost, solar self-consumption)
 *   3. Energy Usage Trends (Interactive 24-hour profile chart with tariff shading)
 *   4. Household Loads & Circuit Relays (Contactor switching, sheddable loads)
 *   5. System Topology & Flow (Physical CT sensing to digital telemetry pipeline)
 *   6. Actionable Insights & Automations (Standby vampire cutoffs, tariff shifts)
 *   7. Technical Platform Footer
 */
export function HomePage() {
  const context = useOutletContext();
  const openSizing = context?.openSizing;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* 1. Hardware Workspace Status Bar */}
      <div className="p-4 rounded-2xl border bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: 'var(--color-accent-subtle)',
              borderColor: 'var(--color-accent)',
            }}
          >
            <Cpu size={20} style={{ color: 'var(--color-accent)' }} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-[var(--color-text)]">
                Panel Unit #01 · Main Breaker Enclosure
              </span>
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span className="text-[10px] font-mono text-[var(--color-success)] font-semibold uppercase">
                Online Telemetry
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              DIN 35mm Mount · 230V AC Single-Phase · 6 Split-Core CT Sensors Active · Local MQTT Stream
            </p>
          </div>
        </div>

        {/* Quick status indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono self-start md:self-auto">
          <div className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
            Sampling: <strong className="text-[var(--color-text)]">1.2 kHz True-RMS</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
            Service: <strong className="text-[var(--color-accent)]">50A Main Rating</strong>
          </div>
        </div>
      </div>

      {/* 2. Executive Energy Overview (Real-time kW, kWh, Cost, Solar) */}
      <section id="overview" className="space-y-4">
        <EnergyOverview />
      </section>

      {/* 3. 24-Hour Energy Usage Trends Chart */}
      <section id="usage-trends" className="space-y-4">
        <EnergyUsageTrends />
      </section>

      {/* 4. Household Loads & Sub-Circuit Contactor Relays */}
      <section id="loads" className="space-y-4">
        <HouseholdLoads />
      </section>

      {/* 5. Physical-to-Digital System Topology & Energy Conduit Flow */}
      <section id="topology" className="space-y-4">
        <ProductVisualization />
      </section>

      {/* 6. Actionable Energy Insights & Automations */}
      <section id="insights" className="space-y-4">
        <EnergyInsights />
      </section>

      {/* 7. Platform Specifications & Footer */}
      <Footer onOpenSizing={openSizing} />
    </div>
  );
}

export default HomePage;
