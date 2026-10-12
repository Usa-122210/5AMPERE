import { useState } from 'react';
import {
  Activity,
  Airplay,
  BatteryCharging,
  Cpu,
  Flame,
  Gauge,
  Lightbulb,
  Radio,
  Sliders,
  Sun,
  ToggleLeft,
  ToggleRight,
  Waves,
  Wind,
  Zap,
} from 'lucide-react';
import { Surface } from '../ui/Surface';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useEnergyData } from '../../context/EnergyDataContext';

/**
 * ProductVisualization — Physical-to-Digital Architecture Showcase.
 *
 * Demonstrates the full path of electrical energy:
 *   1. Power Supply (Grid + Solar)
 *   2. 5AMPERE Hardware Monitoring Hub (Sub-panel CT clamps + Edge compute)
 *   3. Real-Time Telemetry Dashboard (Live circuit statistics)
 *   4. Monitored Connected Appliances (Inverter AC, Geyser, Fridge, Fans/Lighting)
 *
 * Features a high-visibility, lightweight, GPU-accelerated SVG particle flow
 * animation that responds dynamically to mode presets and individual appliance toggles.
 * Synchronized with the global EnergyDataContext.
 */
export function ProductVisualization() {
  const prefersReduced = useReducedMotion();
  const {
    loads,
    toggleLoad,
    totalActiveKw,
    currentAmps,
    metadata,
    solarEnabled,
    setSolarEnabled,
    solarKw,
    gridKw,
    selfSufficiency,
    activeTariff,
  } = useEnergyData();

  // Mode preset: 'normal' | 'solar' | 'standby'
  const [profile, setProfile] = useState('normal');

  // Key monitored loads mapped from shared state
  const acLoad = loads.find((l) => l.id === 'ac') || { active: true, drawKw: 1.45, name: 'Inverter AC' };
  const geyserLoad = loads.find((l) => l.id === 'geyser') || { active: false, drawKw: 2.00, name: 'Water Geyser' };
  const fridgeLoad = loads.find((l) => l.id === 'refrigerator') || { active: true, drawKw: 0.22, name: 'Refrigerator' };
  const fansLoad = loads.find((l) => l.id === 'fans_lighting') || { active: true, drawKw: 0.28, name: 'BLDC Fans & Lights' };

  // Speed timings based on active profile and load
  const flowSpeed = profile === 'standby' ? '5.0s' : profile === 'solar' ? '2.2s' : '3.0s';
  const fastSpeed = profile === 'standby' ? '3.0s' : profile === 'solar' ? '1.2s' : '1.6s';

  const displaySolarKw = solarEnabled ? (profile === 'standby' ? 0.0 : solarKw) : 0.0;
  const displayGridKw = Math.max(0, totalActiveKw - displaySolarKw).toFixed(2);

  return (
    <section id="topology" className="space-y-4">
      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                Physical Hardware Architecture
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-bold tracking-tight mt-1 text-[var(--color-text)]">
              System Topology &amp; Conduit Telemetry
            </h3>
            <p className="text-xs sm:text-sm mt-1 max-w-2xl text-[var(--color-text-secondary)]">
              From breaker panel CT clamps to sub-circuit contactor relays—watch
              electrical current streaming through local hardware telemetry into your appliances.
            </p>
          </div>

          {/* Profile Switcher Controls */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] self-start md:self-auto">
            {[
              { id: 'normal', label: 'Balanced Grid' },
              { id: 'solar', label: 'Solar Priority' },
              { id: 'standby', label: 'Night Standby' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setProfile(item.id);
                  if (item.id === 'solar' && !solarEnabled) {
                    setSolarEnabled(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  profile === item.id
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-text)] shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Master Visual Topology Surface */}
        <Surface variant="primary" padding="none" className="relative overflow-hidden border border-[var(--color-border)] p-6 sm:p-8">
          
          {/* Top Telemetry Status Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2.5 text-xs text-[var(--color-text-secondary)]">
              <Radio size={14} style={{ color: 'var(--color-accent)' }} className="animate-pulse" />
              <span>Conduit Telemetry: <strong>230V AC · 50 Hz Single-Phase</strong></span>
              <span className="hidden sm:inline text-[var(--color-border)]">|</span>
              <span className="hidden sm:inline">Active Profile: <strong className="uppercase font-mono text-[var(--color-accent)]">{profile}</strong></span>
              <span className="hidden sm:inline text-[var(--color-border)]">|</span>
              <span className="hidden sm:inline font-mono">DISCOM: <strong>{activeTariff.discom.split(' ')[0]}</strong></span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent)] animate-ping" />
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-accent)] border border-[var(--color-border)] font-medium">
                Live Dynamic Particles Active
              </span>
            </div>
          </div>

          {/* Four Stage Interactive Topology Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-stretch">
            
            {/* STAGE 1: POWER SUPPLY (Col 1-3) */}
            <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase text-[var(--color-text-muted)] tracking-wider">
                  1. Power Sources
                </span>
                <span className="text-[10px] font-mono text-[var(--color-accent)]">Supply</span>
              </div>

              {/* Utility Grid Feed Card */}
              <div className="p-4 rounded-xl border space-y-2 bg-[var(--color-surface-secondary)] border-[var(--color-border)] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-accent-subtle)]">
                      <Zap size={16} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text)]">Utility Grid Feed</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{activeTariff.discom.split(' ')[0]} 230V Feeder</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--color-accent)]">
                    {displayGridKw} kW
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  <span>Current: <strong>{((parseFloat(displayGridKw) * 1000) / 230).toFixed(1)} A</strong></span>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)]">50.0 Hz</span>
                </div>
              </div>

              {/* Solar Array Inverter Card */}
              <div className="p-4 rounded-xl border space-y-2 bg-[var(--color-surface-secondary)] border-[var(--color-border)] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-accent-subtle)]">
                      <Sun size={16} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text)]">Rooftop Solar PV</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">{solarEnabled ? 'Micro-Inverter Array' : 'Optional / Standby'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--color-accent)]">
                    {displaySolarKw.toFixed(1)} kW
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  <span>Offsetting: <strong>{solarEnabled ? `${selfSufficiency}%` : '0%'}</strong></span>
                  <span className="font-mono text-[10px] text-[var(--color-accent)]">
                    {solarEnabled ? 'Generating' : 'Grid-Only Mode'}
                  </span>
                </div>
              </div>

              {/* Mobile flow guide arrow */}
              <div className="lg:hidden flex items-center justify-center py-2 text-[var(--color-accent)]">
                <span className="text-xs font-mono">↓ Energy flows to 5AMPERE Core ↓</span>
              </div>
            </div>

            {/* STAGE 2: 5AMPERE HARDWARE MONITORING DEVICE (Col 4-6) */}
            <div className="lg:col-span-3 flex flex-col justify-between p-5 rounded-2xl border text-center relative overflow-hidden"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-accent)',
                boxShadow: '0 0 28px var(--energy-glow-color)',
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] font-mono font-semibold uppercase text-[var(--color-accent)] tracking-wider">
                    2. 5AMPERE Core
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                </div>

                <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner"
                  style={{
                    backgroundColor: 'var(--color-accent-subtle)',
                    borderColor: 'var(--color-accent)',
                  }}
                >
                  <Cpu size={28} style={{ color: 'var(--color-accent)' }} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text)]">5AMPERE Edge Hub</h4>
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">DIN 35mm Sub-Panel Mount</p>
                </div>

                <div className="p-2.5 rounded-xl border text-[11px] font-mono space-y-1 text-left bg-[var(--color-surface-secondary)] border-[var(--color-border)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Sampling:</span>
                    <span className="font-semibold text-[var(--color-text)]">1.2 kHz True-RMS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Channels:</span>
                    <span className="font-semibold text-[var(--color-accent)]">6 CT Split-Core</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Max Bus:</span>
                    <span className="font-semibold text-[var(--color-text)]">{metadata.mainBreakerAmps}A Continuous</span>
                  </div>
                </div>
              </div>

              {/* Mobile flow guide arrow */}
              <div className="lg:hidden flex items-center justify-center pt-3 text-[var(--color-accent)]">
                <span className="text-xs font-mono">↓ Live Telemetry ↓</span>
              </div>
            </div>

            {/* STAGE 3: USER TELEMETRY DASHBOARD DISPLAY (Col 7-9) */}
            <div className="lg:col-span-3 flex flex-col justify-between p-5 rounded-2xl border bg-[var(--color-surface-secondary)] border-[var(--color-border)]">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold uppercase text-[var(--color-text-muted)] tracking-wider">
                    3. Live Telemetry
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-accent)]">Sub-Second</span>
                </div>

                <div className="mt-3 p-3.5 rounded-xl border bg-[var(--color-surface)] border-[var(--color-border)]">
                  <p className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)]">
                    Total Active Load
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-mono font-extrabold text-[var(--color-text)]">
                      {totalActiveKw.toFixed(2)}
                    </span>
                    <span className="text-sm font-mono text-[var(--color-accent)] font-semibold">kW</span>
                  </div>

                  {/* Dynamic load bar */}
                  <div className="w-full h-2 rounded-full bg-[var(--color-surface-secondary)] mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (totalActiveKw / metadata.contractedLoadKw) * 100)}%`,
                        backgroundColor: 'var(--color-accent)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] mt-1 text-[var(--color-text-muted)] font-mono">
                    <span>0 kW</span>
                    <span>Sanctioned {metadata.contractedLoadKw.toFixed(1)} kW</span>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="pt-3 border-t border-[var(--color-border)] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
                  <span>Current Draw:</span>
                  <span className="font-mono font-semibold text-[var(--color-text)]">{currentAmps} A @ 230V</span>
                </div>
                <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
                  <span>Load Shedding Relays:</span>
                  <span className="font-mono text-[var(--color-accent)] font-medium">Armed &amp; Ready</span>
                </div>
              </div>

              {/* Mobile flow guide arrow */}
              <div className="lg:hidden flex items-center justify-center pt-3 text-[var(--color-accent)]">
                <span className="text-xs font-mono">↓ Distribution to Appliances ↓</span>
              </div>
            </div>

            {/* STAGE 4: CONNECTED APPLIANCES & RELAYS (Col 10-12) */}
            <div className="lg:col-span-3 space-y-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase text-[var(--color-text-muted)] tracking-wider">
                  4. Monitored Loads
                </span>
                <span className="text-[10px] font-mono text-[var(--color-accent)]">Click to Toggle</span>
              </div>

              {/* 4 Representative Monitored Loads */}
              {[acLoad, geyserLoad, fridgeLoad, fansLoad].map((item) => {
                const itemAmps = ((item.drawKw * 1000) / 230).toFixed(1);
                const Icon = item.id === 'ac' ? Wind : item.id === 'geyser' ? Flame : item.id === 'refrigerator' ? Zap : Lightbulb;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleLoad(item.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                      item.active
                        ? 'border-[var(--color-accent)] bg-[var(--color-surface)] shadow-xs'
                        : 'border-[var(--color-border)] opacity-50 bg-[var(--color-surface-secondary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          backgroundColor: item.active ? 'var(--color-accent-subtle)' : 'var(--color-surface-secondary)',
                          border: `1px solid ${item.active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        }}
                      >
                        <Icon size={14} style={{ color: item.active ? 'var(--color-accent)' : 'var(--color-text-muted)' }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--color-text)]">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)]">
                          {item.active ? `${itemAmps} A · ${item.drawKw.toFixed(2)} kW` : 'OFFLINE'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-semibold text-[var(--color-accent)]">
                        {item.active ? 'ON' : 'OFF'}
                      </span>
                      {item.active ? (
                        <ToggleRight size={18} className="text-[var(--color-accent)]" />
                      ) : (
                        <ToggleLeft size={18} className="text-[var(--color-text-muted)]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG Animated Energy Conduit & High-Visibility Flow Layer (Desktop Overlay) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1100 360" preserveAspectRatio="none">
              <defs>
                <radialGradient id="high-vis-particle" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="35%" stopColor="var(--energy-particle-color)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--energy-particle-color)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Feed 1: Grid Line -> 5AMPERE Core */}
              <path
                id="vis-grid"
                d="M 270 120 C 320 120, 330 180, 370 180"
                fill="none"
                stroke="var(--energy-line-color)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                style={{
                  animation: prefersReduced ? 'none' : `flow-forward ${flowSpeed} linear infinite`,
                }}
              />

              {/* Feed 2: Solar Line -> 5AMPERE Core */}
              {solarEnabled && (
                <path
                  id="vis-solar"
                  d="M 270 240 C 320 240, 330 180, 370 180"
                  fill="none"
                  stroke="var(--energy-line-color)"
                  strokeWidth="2.5"
                  strokeDasharray="6 8"
                  style={{
                    animation: prefersReduced ? 'none' : `flow-forward ${flowSpeed} linear infinite`,
                    opacity: profile === 'standby' ? 0.2 : 1,
                  }}
                />
              )}

              {/* Core Output -> Dashboard Link */}
              <path
                id="vis-telemetry"
                d="M 550 180 C 580 180, 590 180, 620 180"
                fill="none"
                stroke="var(--energy-line-color)"
                strokeWidth="2.5"
                strokeDasharray="4 6"
                style={{
                  animation: prefersReduced ? 'none' : `flow-forward ${fastSpeed} linear infinite`,
                }}
              />

              {/* Core Output -> Branch Circuits */}
              {acLoad.active && (
                <path
                  d="M 820 180 C 850 180, 860 90, 890 90"
                  fill="none"
                  stroke="var(--energy-line-color)"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  style={{ animation: prefersReduced ? 'none' : `flow-forward ${flowSpeed} linear infinite` }}
                />
              )}

              {geyserLoad.active && (
                <path
                  d="M 820 180 C 850 180, 860 145, 890 145"
                  fill="none"
                  stroke="var(--energy-line-color)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  style={{ animation: prefersReduced ? 'none' : `flow-forward-fast ${fastSpeed} linear infinite` }}
                />
              )}

              {fridgeLoad.active && (
                <path
                  d="M 820 180 C 850 180, 860 215, 890 215"
                  fill="none"
                  stroke="var(--energy-line-color)"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  style={{ animation: prefersReduced ? 'none' : `flow-forward ${flowSpeed} linear infinite` }}
                />
              )}

              {fansLoad.active && (
                <path
                  d="M 820 180 C 850 180, 860 270, 890 270"
                  fill="none"
                  stroke="var(--energy-line-color)"
                  strokeWidth="1.75"
                  strokeDasharray="4 8"
                  style={{ animation: prefersReduced ? 'none' : `flow-forward ${flowSpeed} linear infinite` }}
                />
              )}

              {/* --- VISIBLY MOVING HIGH-LUMINANCE ENERGY PARTICLES --- */}
              {!prefersReduced && (
                <g>
                  {/* Grid to Core: Multi-particle stream */}
                  <g>
                    <circle r="4.5" fill="var(--color-accent)" opacity="1">
                      <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 270 120 C 320 120, 330 180, 370 180" />
                    </circle>
                    <circle r="2" fill="#FFFFFF" opacity="0.9">
                      <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 270 120 C 320 120, 330 180, 370 180" />
                    </circle>
                    <circle r="3.5" fill="var(--color-accent)" opacity="0.8">
                      <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 270 120 C 320 120, 330 180, 370 180" begin="1.1s" />
                    </circle>
                  </g>

                  {/* Solar to Core: Moving particle stream */}
                  {solarEnabled && profile !== 'standby' && (
                    <g>
                      <circle r="4.5" fill="var(--color-accent)" opacity="1">
                        <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 270 240 C 320 240, 330 180, 370 180" begin="0.5s" />
                      </circle>
                      <circle r="2" fill="#FFFFFF" opacity="0.9">
                        <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 270 240 C 320 240, 330 180, 370 180" begin="0.5s" />
                      </circle>
                    </g>
                  )}

                  {/* Core to Dashboard Telemetry: Fast pulses */}
                  <g>
                    <circle r="4" fill="var(--color-accent)" opacity="1">
                      <animateMotion dur={fastSpeed} repeatCount="indefinite" path="M 550 180 C 580 180, 590 180, 620 180" />
                    </circle>
                    <circle r="1.8" fill="#FFFFFF" opacity="0.95">
                      <animateMotion dur={fastSpeed} repeatCount="indefinite" path="M 550 180 C 580 180, 590 180, 620 180" />
                    </circle>
                  </g>

                  {/* Core to Inverter AC */}
                  {acLoad.active && (
                    <g>
                      <circle r="4" fill="var(--color-accent)" opacity="1">
                        <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 90, 890 90" />
                      </circle>
                      <circle r="1.8" fill="#FFFFFF" opacity="0.9">
                        <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 90, 890 90" />
                      </circle>
                    </g>
                  )}

                  {/* Core to Geyser */}
                  {geyserLoad.active && (
                    <g>
                      <circle r="5" fill="var(--color-accent)" opacity="1">
                        <animateMotion dur={fastSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 145, 890 145" />
                      </circle>
                      <circle r="2.2" fill="#FFFFFF" opacity="1">
                        <animateMotion dur={fastSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 145, 890 145" />
                      </circle>
                      <circle r="3.5" fill="var(--color-accent)" opacity="0.8">
                        <animateMotion dur={fastSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 145, 890 145" begin="0.4s" />
                      </circle>
                    </g>
                  )}

                  {/* Core to Refrigerator */}
                  {fridgeLoad.active && (
                    <g>
                      <circle r="3.8" fill="var(--color-accent)" opacity="1">
                        <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 215, 890 215" begin="0.7s" />
                      </circle>
                      <circle r="1.6" fill="#FFFFFF" opacity="0.9">
                        <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 215, 890 215" begin="0.7s" />
                      </circle>
                    </g>
                  )}

                  {/* Core to Fans & Lighting */}
                  {fansLoad.active && (
                    <g>
                      <circle r="3.5" fill="var(--color-accent)" opacity="0.95">
                        <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 270, 890 270" begin="1.3s" />
                      </circle>
                      <circle r="1.5" fill="#FFFFFF" opacity="0.9">
                        <animateMotion dur={flowSpeed} repeatCount="indefinite" path="M 820 180 C 850 180, 860 270, 890 270" begin="1.3s" />
                      </circle>
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Interactive Note & Accessibility Status */}
          <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <Sliders size={13} style={{ color: 'var(--color-accent)' }} />
              <span>Interactive Controls: Click any load to toggle its physical circuit relay and stop/resume energy particle flow.</span>
            </span>
            <span className="font-mono text-[11px] text-[var(--color-accent)] font-semibold">
              {prefersReduced ? 'Reduced-motion active (static)' : 'Active 60fps GPU SVG Particle Engine'}
            </span>
          </div>
        </Surface>
      </div>
    </section>
  );
}
