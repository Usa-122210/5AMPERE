import { useState } from 'react';
import {
  Activity,
  Airplay,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  Flame,
  Gauge,
  Lightbulb,
  Power,
  Sun,
  Zap,
} from 'lucide-react';
import { Surface } from '../ui/Surface';
import { Button } from '../ui/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * EnergyFlowVisualizer — Live Energy Flow Animation Showcase.
 *
 * Demonstrates:
 *   - Animated energy particles streaming from Power Sources (Grid & Solar)
 *   - Flowing through the 5AMPERE Central Smart Monitor
 *   - Distributed out to compatible appliances (HVAC, EV, Kitchen, Lighting)
 *   - UI Responsiveness: Toggling appliances stops/starts energy particle streams
 *   - Mode presets: Balanced, Peak Load, Eco Solar
 *   - Respects prefers-reduced-motion accessibility setting
 */
export function EnergyFlowVisualizer() {
  const prefersReduced = useReducedMotion();

  // Mode: 'balanced' | 'peak' | 'eco'
  const [flowMode, setFlowMode] = useState('balanced');

  // Interactive appliance toggles
  const [appliances, setAppliances] = useState({
    hvac: { name: 'HVAC Climate', load: '1.8 kW', current: '7.8 A', active: true, icon: Airplay },
    kitchen: { name: 'Kitchen Loads', load: '0.9 kW', current: '3.9 A', active: true, icon: Flame },
    ev: { name: 'EV Charger', load: '2.4 kW', current: '10.4 A', active: true, icon: BatteryCharging },
    lighting: { name: 'Smart Lighting', load: '0.3 kW', current: '1.3 A', active: true, icon: Lightbulb },
  });

  const toggleAppliance = (key) => {
    setAppliances((prev) => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active },
    }));
  };

  // Speed tuning based on flowMode
  const speeds = {
    balanced: { source: '3.5s', load: '3.8s', dash: '1.5s' },
    peak: { source: '2s', load: '2.2s', dash: '0.8s' },
    eco: { source: '5s', load: '5.5s', dash: '2.5s' },
  }[flowMode];

  // Calculated totals
  const activeCount = Object.values(appliances).filter((a) => a.active).length;
  const totalKw = Object.values(appliances)
    .reduce((sum, a) => (a.active ? sum + parseFloat(a.load) : sum), 0)
    .toFixed(1);

  return (
    <Surface variant="primary" padding="lg" className="relative overflow-hidden border border-[var(--color-border)]">
      {/* Header bar with mode controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <h3 className="text-base sm:text-lg font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
              Live Energy Flow Topology
            </h3>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-[var(--color-border)]"
              style={{ color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-subtle)' }}
            >
              5.0A RATED PLATFORM
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Dynamic particle conduits streaming from source generation through 5AMPERE telemetry to branch circuits.
          </p>
        </div>

        {/* Mode selector pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] self-start md:self-auto">
          {[
            { id: 'balanced', label: 'Balanced' },
            { id: 'peak', label: 'Peak Surge' },
            { id: 'eco', label: 'Eco Solar' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setFlowMode(mode.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                flowMode === mode.id
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] shadow-sm'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flow SVG Canvas */}
      <div className="relative py-6 sm:py-8 my-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
          
          {/* COLUMN 1: Generation Sources */}
          <div className="space-y-4">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">
              Power Generation
            </span>

            {/* Grid Source Card */}
            <div
              className="p-3.5 rounded-xl border flex items-center justify-between transition-all"
              style={{
                backgroundColor: 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-accent-subtle)' }}
                >
                  <Zap size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                    Utility Grid Feed
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                    230V AC · 50 Hz Single Phase
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                {flowMode === 'peak' ? '3.8 kW' : '2.1 kW'}
              </span>
            </div>

            {/* Solar Source Card */}
            <div
              className="p-3.5 rounded-xl border flex items-center justify-between transition-all"
              style={{
                backgroundColor: 'var(--color-surface-secondary)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-accent-subtle)' }}
                >
                  <Sun size={18} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                    Solar Inverter
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                    Clean Rooftop PV
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium" style={{ color: 'var(--color-accent)' }}>
                {flowMode === 'eco' ? '2.4 kW' : '1.1 kW'}
              </span>
            </div>
          </div>

          {/* COLUMN 2: Central 5AMPERE Monitoring Core */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border text-center relative overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-accent)',
              boxShadow: '0 0 24px var(--energy-glow-color)',
            }}
          >
            {/* Glowing animated hub icon */}
            <div className="relative mb-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                style={{
                  backgroundColor: 'var(--color-accent-subtle)',
                  border: '1.5px solid var(--color-accent)',
                }}
              >
                <Cpu size={32} style={{ color: 'var(--color-accent)' }} />
              </div>
              {/* Concentric pulsing energy beacon */}
              {!prefersReduced && (
                <div
                  className="absolute inset-0 rounded-2xl border border-[var(--color-accent)] animate-ping opacity-25"
                  style={{ animationDuration: '2.5s' }}
                />
              )}
            </div>

            <h4 className="text-sm font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
              5AMPERE Smart Unit
            </h4>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
              Core Hardware Energy Monitor
            </p>

            {/* Live Telemetry Pill */}
            <div className="mt-4 pt-3 border-t border-[var(--color-border)] w-full flex items-center justify-around text-center">
              <div>
                <p className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">Active Load</p>
                <p className="text-sm font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                  {totalKw} kW
                </p>
              </div>
              <div className="h-6 w-px bg-[var(--color-border)]" />
              <div>
                <p className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">Circuits</p>
                <p className="text-sm font-mono font-bold" style={{ color: 'var(--color-text)' }}>
                  {activeCount} / 4 On
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Connected Appliances with Interactive Toggles */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">
              Monitored Appliances (Click to Toggle)
            </span>

            {Object.entries(appliances).map(([key, item]) => {
              const Icon = item.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAppliance(key)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                    item.active
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-secondary)]'
                      : 'border-[var(--color-border)] opacity-50 bg-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: item.active ? 'var(--color-accent-subtle)' : 'var(--color-surface-secondary)',
                      }}
                    >
                      <Icon size={14} style={{ color: item.active ? 'var(--color-accent)' : 'var(--color-text-muted)' }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                        {item.name}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                        {item.current}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium" style={{ color: item.active ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                      {item.active ? item.load : 'OFF'}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        item.active
                          ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)]'
                          : 'bg-[var(--color-border)] text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Embedded SVG Dynamic Energy Conduit Overlay (Desktop & Tablet) */}
        <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 900 280" preserveAspectRatio="none">
            <defs>
              <linearGradient id="stream-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--energy-particle-color)" stopOpacity="0.2" />
                <stop offset="50%" stopColor="var(--energy-particle-color)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--energy-particle-color)" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Path 1: Grid -> 5AMPERE Unit */}
            <path
              id="path-grid"
              d="M 270 80 C 350 80, 360 140, 410 140"
              fill="none"
              stroke="var(--energy-line-color)"
              strokeWidth="2"
              strokeDasharray="6 8"
              style={{
                animation: prefersReduced ? 'none' : `flow-forward ${speeds.source} linear infinite`,
              }}
            />

            {/* Path 2: Solar -> 5AMPERE Unit */}
            <path
              id="path-solar"
              d="M 270 200 C 350 200, 360 140, 410 140"
              fill="none"
              stroke="var(--energy-line-color)"
              strokeWidth="2"
              strokeDasharray="6 8"
              style={{
                animation: prefersReduced ? 'none' : `flow-forward ${speeds.source} linear infinite`,
              }}
            />

            {/* Path 3: 5AMPERE Unit -> HVAC */}
            {appliances.hvac.active && (
              <path
                id="path-hvac"
                d="M 490 140 C 540 140, 560 55, 630 55"
                fill="none"
                stroke="var(--energy-line-color)"
                strokeWidth="2"
                strokeDasharray="6 8"
                style={{
                  animation: prefersReduced ? 'none' : `flow-forward ${speeds.load} linear infinite`,
                }}
              />
            )}

            {/* Path 4: 5AMPERE Unit -> Kitchen */}
            {appliances.kitchen.active && (
              <path
                id="path-kitchen"
                d="M 490 140 C 550 140, 560 110, 630 110"
                fill="none"
                stroke="var(--energy-line-color)"
                strokeWidth="2"
                strokeDasharray="6 8"
                style={{
                  animation: prefersReduced ? 'none' : `flow-forward ${speeds.load} linear infinite`,
                }}
              />
            )}

            {/* Path 5: 5AMPERE Unit -> EV Charger */}
            {appliances.ev.active && (
              <path
                id="path-ev"
                d="M 490 140 C 550 140, 560 170, 630 170"
                fill="none"
                stroke="var(--energy-line-color)"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                style={{
                  animation: prefersReduced ? 'none' : `flow-forward-fast ${speeds.dash} linear infinite`,
                }}
              />
            )}

            {/* Path 6: 5AMPERE Unit -> Lighting */}
            {appliances.lighting.active && (
              <path
                id="path-lighting"
                d="M 490 140 C 540 140, 560 225, 630 225"
                fill="none"
                stroke="var(--energy-line-color)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                style={{
                  animation: prefersReduced ? 'none' : `flow-forward ${speeds.load} linear infinite`,
                }}
              />
            )}

            {/* --- VISIBLY FLOWING HIGH-LUMINANCE ENERGY PARTICLES --- */}
            {!prefersReduced && (
              <g>
                {/* Source Particles: Grid to Core */}
                <g>
                  <circle r="4.5" fill="var(--color-accent)" opacity="1">
                    <animateMotion dur={speeds.source} repeatCount="indefinite" path="M 270 80 C 350 80, 360 140, 410 140" />
                  </circle>
                  <circle r="2" fill="#FFFFFF" opacity="0.95">
                    <animateMotion dur={speeds.source} repeatCount="indefinite" path="M 270 80 C 350 80, 360 140, 410 140" />
                  </circle>
                  <circle r="3.5" fill="var(--color-accent)" opacity="0.8">
                    <animateMotion dur={speeds.source} repeatCount="indefinite" path="M 270 80 C 350 80, 360 140, 410 140" begin="1.2s" />
                  </circle>
                </g>

                {/* Source Particles: Solar to Core */}
                <g>
                  <circle r="4.5" fill="var(--color-accent)" opacity="1">
                    <animateMotion dur={speeds.source} repeatCount="indefinite" path="M 270 200 C 350 200, 360 140, 410 140" begin="0.6s" />
                  </circle>
                  <circle r="2" fill="#FFFFFF" opacity="0.95">
                    <animateMotion dur={speeds.source} repeatCount="indefinite" path="M 270 200 C 350 200, 360 140, 410 140" begin="0.6s" />
                  </circle>
                </g>

                {/* Load Particles to HVAC */}
                {appliances.hvac.active && (
                  <g>
                    <circle r="4" fill="var(--color-accent)" opacity="1">
                      <animateMotion dur={speeds.load} repeatCount="indefinite" path="M 490 140 C 540 140, 560 55, 630 55" />
                    </circle>
                    <circle r="1.8" fill="#FFFFFF" opacity="0.9">
                      <animateMotion dur={speeds.load} repeatCount="indefinite" path="M 490 140 C 540 140, 560 55, 630 55" />
                    </circle>
                  </g>
                )}

                {/* Load Particles to Kitchen */}
                {appliances.kitchen.active && (
                  <g>
                    <circle r="3.8" fill="var(--color-accent)" opacity="1">
                      <animateMotion dur={speeds.load} repeatCount="indefinite" path="M 490 140 C 550 140, 560 110, 630 110" begin="0.8s" />
                    </circle>
                    <circle r="1.6" fill="#FFFFFF" opacity="0.9">
                      <animateMotion dur={speeds.load} repeatCount="indefinite" path="M 490 140 C 550 140, 560 110, 630 110" begin="0.8s" />
                    </circle>
                  </g>
                )}

                {/* Load Particles to EV Charger (Faster, 2 streaming particles) */}
                {appliances.ev.active && (
                  <g>
                    <circle r="5" fill="var(--color-accent)" opacity="1">
                      <animateMotion dur={speeds.dash} repeatCount="indefinite" path="M 490 140 C 550 140, 560 170, 630 170" />
                    </circle>
                    <circle r="2.2" fill="#FFFFFF" opacity="1">
                      <animateMotion dur={speeds.dash} repeatCount="indefinite" path="M 490 140 C 550 140, 560 170, 630 170" />
                    </circle>
                    <circle r="3" fill="var(--color-accent)" opacity="0.8">
                      <animateMotion dur={speeds.dash} repeatCount="indefinite" path="M 490 140 C 550 140, 560 170, 630 170" begin="0.4s" />
                    </circle>
                  </g>
                )}

                {/* Load Particles to Lighting */}
                {appliances.lighting.active && (
                  <g>
                    <circle r="3.2" fill="var(--color-accent)" opacity="0.95">
                      <animateMotion dur={speeds.load} repeatCount="indefinite" path="M 490 140 C 540 140, 560 225, 630 225" begin="1.4s" />
                    </circle>
                    <circle r="1.4" fill="#FFFFFF" opacity="0.9">
                      <animateMotion dur={speeds.load} repeatCount="indefinite" path="M 490 140 C 540 140, 560 225, 630 225" begin="1.4s" />
                    </circle>
                  </g>
                )}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Footer metadata */}
      <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between text-xs text-[var(--color-text-secondary)] gap-2">
        <div className="flex items-center gap-2">
          <Activity size={14} style={{ color: 'var(--color-accent)' }} />
          <span>Real-time particle telemetry rate: <strong>{flowMode.toUpperCase()}</strong></span>
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)]">
          {prefersReduced ? 'Reduced-motion active (static flow vectors)' : 'Smooth GPU-accelerated SVG flow'}
        </p>
      </div>
    </Surface>
  );
}

