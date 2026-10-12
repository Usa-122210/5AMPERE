import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * EnergyFlowBackground — Reusable ambient energy-flow visual shell.
 *
 * Renders clearly visible, smooth, premium energy conduits with traveling
 * particles, moving electrical surges, and pulsing distribution nodes.
 *
 * Features:
 *   - Luminous multi-particle streams traveling along main conduits
 *   - Layered glowing energy lines with animated dash flow
 *   - Pulsing grid nodes with concentric energy rings
 *   - Non-interactive (pointer-events: none)
 *   - Respects prefers-reduced-motion accessibility setting
 */
export function EnergyFlowBackground({ intensity = 'subtle' }) {
  const prefersReduced = useReducedMotion();

  const opacityMap = {
    subtle: prefersReduced ? 0.3 : 0.75,
    visible: prefersReduced ? 0.45 : 0.95,
  };

  const containerOpacity = opacityMap[intensity] || opacityMap.subtle;

  // Main electrical conduit paths
  const conduit1 = 'M -100 320 C 220 180, 480 420, 720 280 S 1100 160, 1540 360';
  const conduit2 = 'M -50 560 C 280 420, 620 680, 880 520 S 1220 360, 1540 500';
  const conduit3 = 'M -100 190 C 260 110, 520 290, 780 180 S 1150 90, 1540 210';
  const conduit4 = 'M 320 80 C 440 280, 660 260, 820 480 S 1080 690, 1300 880';

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        pointerEvents: 'none',
        zIndex: 0,
        opacity: containerOpacity,
      }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial soft background illumination */}
          <radialGradient id="energy-glow-primary" cx="45%" cy="35%" r="45%">
            <stop offset="0%" stopColor="var(--energy-glow-color)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="energy-glow-secondary" cx="75%" cy="65%" r="35%">
            <stop offset="0%" stopColor="var(--energy-glow-color)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Particle luminous glow */}
          <radialGradient id="particle-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--energy-particle-color)" stopOpacity="1" />
            <stop offset="60%" stopColor="var(--energy-particle-color)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--energy-particle-color)" stopOpacity="0" />
          </radialGradient>

          {/* Soft drop shadow filter for glowing conduits */}
          <filter id="energy-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient radial energy halos */}
        <rect
          x="0"
          y="0"
          width="1440"
          height="900"
          fill="url(#energy-glow-primary)"
          style={{
            animation: prefersReduced ? 'none' : 'glow-pulse 6s ease-in-out infinite',
          }}
        />
        <rect
          x="0"
          y="0"
          width="1440"
          height="900"
          fill="url(#energy-glow-secondary)"
          style={{
            animation: prefersReduced ? 'none' : 'glow-pulse 8s ease-in-out infinite 2s',
          }}
        />

        {/* --- Conduit Base Layers (subtle glowing guide rails) --- */}
        <g fill="none" strokeWidth="2.5" opacity="0.3" filter="url(#energy-filter)">
          <path d={conduit1} stroke="var(--energy-line-glow)" />
          <path d={conduit2} stroke="var(--energy-line-glow)" />
          <path d={conduit3} stroke="var(--energy-line-glow)" />
          <path d={conduit4} stroke="var(--energy-line-glow)" />
        </g>

        {/* --- Active Moving Energy Conduits (crisp animated pulses) --- */}
        <g fill="none" stroke="var(--energy-line-color)">
          {/* Conduit 1: Primary Transmission Flow */}
          <path
            d={conduit1}
            strokeWidth="1.5"
            strokeDasharray="16 28"
            style={{
              animation: prefersReduced ? 'none' : 'energy-drift 14s linear infinite',
            }}
          />

          {/* Conduit 2: Secondary Distribution Loop */}
          <path
            d={conduit2}
            strokeWidth="1.25"
            strokeDasharray="10 24"
            style={{
              animation: prefersReduced ? 'none' : 'energy-drift-reverse 16s linear infinite',
            }}
          />

          {/* Conduit 3: High-Voltage Bus Bar */}
          <path
            d={conduit3}
            strokeWidth="1.2"
            strokeDasharray="14 30"
            style={{
              animation: prefersReduced ? 'none' : 'energy-drift 18s linear infinite',
            }}
          />

          {/* Conduit 4: Cross-grid feeder line */}
          <path
            d={conduit4}
            strokeWidth="1"
            strokeDasharray="8 20"
            style={{
              animation: prefersReduced ? 'none' : 'energy-drift 12s linear infinite',
            }}
          />
        </g>

        {/* --- Streaming Energy Particles (Visibly traveling along paths) --- */}
        {!prefersReduced && (
          <g>
            {/* Stream on Conduit 1 (3 staggered glowing particles) */}
            <g>
              <circle r="4" fill="var(--color-accent)" opacity="0.95">
                <animateMotion dur="7s" repeatCount="indefinite" path={conduit1} />
              </circle>
              <circle r="1.8" fill="#FFFFFF" opacity="0.9">
                <animateMotion dur="7s" repeatCount="indefinite" path={conduit1} />
              </circle>
            </g>
            <circle r="3" fill="var(--color-accent)" opacity="0.8">
              <animateMotion dur="7s" repeatCount="indefinite" path={conduit1} begin="2.3s" />
            </circle>
            <circle r="3.5" fill="var(--color-accent)" opacity="0.85">
              <animateMotion dur="7s" repeatCount="indefinite" path={conduit1} begin="4.6s" />
            </circle>

            {/* Stream on Conduit 2 (Staggered reverse flow) */}
            <g>
              <circle r="4" fill="var(--color-accent)" opacity="0.95">
                <animateMotion dur="8.5s" repeatCount="indefinite" path={conduit2} begin="0.5s" />
              </circle>
              <circle r="1.8" fill="#FFFFFF" opacity="0.9">
                <animateMotion dur="8.5s" repeatCount="indefinite" path={conduit2} begin="0.5s" />
              </circle>
            </g>
            <circle r="3" fill="var(--color-accent)" opacity="0.8">
              <animateMotion dur="8.5s" repeatCount="indefinite" path={conduit2} begin="4.2s" />
            </circle>

            {/* Stream on Conduit 3 (Upper feeder) */}
            <circle r="3.5" fill="var(--color-accent)" opacity="0.85">
              <animateMotion dur="9s" repeatCount="indefinite" path={conduit3} begin="1.5s" />
            </circle>
            <circle r="2.8" fill="var(--color-accent)" opacity="0.7">
              <animateMotion dur="9s" repeatCount="indefinite" path={conduit3} begin="6s" />
            </circle>

            {/* Stream on Conduit 4 (Diagonal cross feeder) */}
            <circle r="3.5" fill="var(--color-accent)" opacity="0.85">
              <animateMotion dur="6.5s" repeatCount="indefinite" path={conduit4} begin="3s" />
            </circle>
          </g>
        )}

        {/* --- Smart Hub Junction Nodes with Concentric Energy Halos --- */}
        <g>
          {/* Junction 1: Central Sub-Station Hub */}
          <g transform="translate(720, 280)">
            <circle r="4" fill="var(--color-accent)" opacity="0.9" />
            <circle r="8" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.4" />
            {!prefersReduced && (
              <circle
                r="18"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.2"
                style={{
                  transformOrigin: 'center',
                  animation: 'energy-beacon-ring 2.8s cubic-bezier(0.2, 0.8, 0.4, 1) infinite',
                }}
              />
            )}
          </g>

          {/* Junction 2: Secondary Feeder Node */}
          <g transform="translate(880, 520)">
            <circle r="3.5" fill="var(--color-accent)" opacity="0.85" />
            <circle r="7" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.35" />
            {!prefersReduced && (
              <circle
                r="16"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1"
                style={{
                  transformOrigin: 'center',
                  animation: 'energy-beacon-ring 3.4s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 1.2s',
                }}
              />
            )}
          </g>

          {/* Junction 3: Input Feeder Hub */}
          <g transform="translate(320, 240)">
            <circle r="3" fill="var(--color-accent)" opacity="0.75" />
            <circle r="6" fill="none" stroke="var(--color-accent)" strokeWidth="0.8" opacity="0.3" />
          </g>

          {/* Junction 4: Output Circuit Hub */}
          <g transform="translate(1100, 240)">
            <circle r="3.5" fill="var(--color-accent)" opacity="0.8" />
            <circle r="7" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.35" />
            {!prefersReduced && (
              <circle
                r="16"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1"
                style={{
                  transformOrigin: 'center',
                  animation: 'energy-beacon-ring 3s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 0.7s',
                }}
              />
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
