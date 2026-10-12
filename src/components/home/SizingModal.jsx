import { useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Surface } from '../ui/Surface';

/**
 * SizingModal — Interactive Hardware Sizing & Early Access Onboarding.
 *
 * Provides a functional, engaging "Get Started" experience without faking
 * a live backend or user authentication. Homeowners can configure their
 * panel specs and receive an illustrative hardware bill-of-materials.
 */
export function SizingModal({ isOpen, onClose }) {
  const [homeType, setHomeType] = useState('single');
  const [panelCapacity, setPanelCapacity] = useState('50');
  const [hasSolar, setHasSolar] = useState(true);
  const [hasEV, setHasEV] = useState(true);
  const [hasHVAC, setHasHVAC] = useState(true);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Calculate recommended hardware configuration
  const circuitCount =
    (homeType === 'apartment' ? 4 : homeType === 'single' ? 8 : 14) +
    (hasSolar ? 1 : 0) +
    (hasEV ? 1 : 0) +
    (hasHVAC ? 2 : 0);

  const relayCount = (hasHVAC ? 1 : 0) + (hasEV ? 1 : 0) + 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div
              className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-accent-subtle)' }}
            >
              <CheckCircle2 size={32} style={{ color: 'var(--color-accent)' }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
              Hardware Configuration Reserved
            </h3>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              We've saved your custom {panelCapacity}A panel architecture ({circuitCount} CT channels).
              Firmware updates and early access dispatch details will be sent to <strong>{email}</strong>.
            </p>
            <div className="pt-4">
              <Button variant="primary" onClick={() => { setSubmitted(false); onClose(); }}>
                Return to Product Overview
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border"
                  style={{
                    backgroundColor: 'var(--color-accent-subtle)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-accent)',
                  }}
                >
                  Onboarding Simulator
                </span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Phase 2 Hardware Architecture
                </span>
              </div>
              <h2 id="modal-title" className="text-xl sm:text-2xl font-bold mt-1.5" style={{ color: 'var(--color-text)' }}>
                Size Your 5AMPERE Installation
              </h2>
              <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                Configure your electrical service to determine required non-invasive CT sensor clamps,
                smart relay modules, and local gateway requirements.
              </p>
            </div>

            {/* Step 1: Home Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                1. Property Profile
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'apartment', label: 'Apartment', sub: '1-3 Rooms' },
                  { id: 'single', label: 'Single Family', sub: 'Standard Home' },
                  { id: 'villa', label: 'Estate / Villa', sub: 'Multi-Zone' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHomeType(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      homeType === item.id
                        ? 'border-[var(--color-accent)] bg-[var(--color-surface-secondary)] ring-1 ring-[var(--color-accent)]'
                        : 'border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]'
                    }`}
                  >
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                      {item.label}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      {item.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Main Panel Capacity */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                2. Main Service Breaker Rating
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: '30', label: '30 Ampere', sub: 'Standard Domestic' },
                  { id: '50', label: '50 Ampere', sub: 'Heavy Duty 230V' },
                  { id: '100', label: '100A / 3-Phase', sub: 'Commercial / High Load' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPanelCapacity(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      panelCapacity === item.id
                        ? 'border-[var(--color-accent)] bg-[var(--color-surface-secondary)] ring-1 ring-[var(--color-accent)]'
                        : 'border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)]'
                    }`}
                  >
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                      {item.label}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      {item.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: High-Draw Circuits */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                3. Dedicated High-Draw Circuits
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHasSolar(!hasSolar)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    hasSolar
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-secondary)]'
                      : 'border-[var(--color-border)] opacity-60'
                  }`}
                >
                  <span className="text-xs font-medium">Solar PV Inverter</span>
                  <span className="text-xs">{hasSolar ? '✓' : '+'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHasEV(!hasEV)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    hasEV
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-secondary)]'
                      : 'border-[var(--color-border)] opacity-60'
                  }`}
                >
                  <span className="text-xs font-medium">EV Fast Charger</span>
                  <span className="text-xs">{hasEV ? '✓' : '+'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHasHVAC(!hasHVAC)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    hasHVAC
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-secondary)]'
                      : 'border-[var(--color-border)] opacity-60'
                  }`}
                >
                  <span className="text-xs font-medium">HVAC / Heat Pump</span>
                  <span className="text-xs">{hasHVAC ? '✓' : '+'}</span>
                </button>
              </div>
            </div>

            {/* Estimated BOM Output */}
            <Surface variant="secondary" padding="md" className="border border-[var(--color-border)]">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <Cpu size={16} style={{ color: 'var(--color-accent)' }} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Recommended Hardware Specification
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[var(--color-accent)]">
                  Local Edge Ready
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-base font-mono font-bold" style={{ color: 'var(--color-text)' }}>
                    1x Core Hub
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">DIN-Rail Mounted</p>
                </div>
                <div>
                  <p className="text-base font-mono font-bold" style={{ color: 'var(--color-accent)' }}>
                    {circuitCount}x CT Clamps
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">5A Resolution Cores</p>
                </div>
                <div>
                  <p className="text-base font-mono font-bold" style={{ color: 'var(--color-text)' }}>
                    {relayCount}x Relays
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Automated Cutoff</p>
                </div>
              </div>
            </Surface>

            {/* Action Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter work or homeowner email..."
                className="flex-1 px-4 py-2.5 rounded-lg border text-sm focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              <Button type="submit" variant="primary" className="whitespace-nowrap">
                Reserve Early Hardware Access
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

