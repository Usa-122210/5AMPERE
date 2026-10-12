import { useLogoConcept } from '../../hooks/useLogoConcept';

/**
 * BrandMark — Three Distinct Engineering Logo Concepts for 5AMPERE.
 *
 * Supports live switching and side-by-side comparison:
 *   - Concept 1: 'concept-1' -> Toroidal Current Transformer (Precision CT Loop)
 *   - Concept 2: 'concept-2' -> Geometric "5A" Monogram (Architectural Circuit)
 *   - Concept 3: 'concept-3' -> Sinusoidal Current Shunt (Energy Pulse Vector)
 *
 * Scalable vector geometry optimized from 16px to 96px.
 */
export function BrandMark({ size = 28, concept, className = '' }) {
  const { activeConcept } = useLogoConcept();
  const selectedConcept = concept || activeConcept || 'concept-1';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-all duration-200 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="var(--color-accent-hover)" />
        </linearGradient>
      </defs>

      {/* =========================================================
          CONCEPT 1: TOROIDAL CURRENT TRANSFORMER (Precision CT Loop)
          Split-core circular induction loop, coil markers, and flux core
          ========================================================= */}
      {selectedConcept === 'concept-1' && (
        <g id="logo-concept-1">
          {/* Split-core CT outer toroidal ring (gap at bottom right) */}
          <path
            d="M 23 25.5 A 12.5 12.5 0 1 0 25.5 22.5"
            stroke="var(--color-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Precision CT clamp split notches */}
          <line
            x1="23.5"
            y1="23"
            x2="26.5"
            y2="26"
            stroke="var(--color-accent)"
            strokeWidth="1.75"
            strokeLinecap="round"
          />

          {/* Concentric inner winding ring */}
          <circle
            cx="15.5"
            cy="15.5"
            r="8"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="2.5 3"
            opacity="0.8"
          />

          {/* Directional AC magnetic flux chevron / flow vector */}
          <path
            d="M 12.5 12.5 L 18 15.5 L 12.5 18.5"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Core sensing pulse node */}
          <circle cx="15.5" cy="15.5" r="1.8" fill="var(--color-accent)" />
        </g>
      )}

      {/* =========================================================
          CONCEPT 2: GEOMETRIC "5A" MONOGRAM (Architectural Circuit)
          Single continuous architectural conductive trace combining "5" and "A"
          ========================================================= */}
      {selectedConcept === 'concept-2' && (
        <g id="logo-concept-2">
          {/* Continuous conductive 5-to-A monogram trace */}
          <path
            d="M 19.5 8 H 10 V 16 H 18.5 C 21 16 22.5 17.5 22.5 20 C 22.5 22.5 20.5 24 18 24 H 9.5"
            stroke="var(--color-accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Intersecting Ampere crossbar vector bridging to the A apex */}
          <path
            d="M 14 16 L 22.5 8"
            stroke="var(--color-accent)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Circuit terminal node 1 (Upper input) */}
          <circle cx="19.5" cy="8" r="1.6" fill="var(--color-accent)" />

          {/* Circuit terminal node 2 (Lower output) */}
          <circle cx="9.5" cy="24" r="1.6" fill="var(--color-accent)" />

          {/* Precision circuit datum dot */}
          <circle cx="22.5" cy="8" r="1.6" fill="var(--color-accent)" />
        </g>
      )}

      {/* =========================================================
          CONCEPT 3: SINUSOIDAL CURRENT SHUNT (Energy Pulse Vector)
          Calibrated AC sine wave inside precision metering hexagon/frame
          ========================================================= */}
      {selectedConcept === 'concept-3' && (
        <g id="logo-concept-3">
          {/* Hexagonal metering enclosure boundary */}
          <path
            d="M 16 4.5 L 26.5 10.5 V 21.5 L 16 27.5 L 5.5 21.5 V 10.5 Z"
            stroke="var(--color-border)"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />

          {/* Calibrated AC pure sine wave pulse */}
          <path
            d="M 7.5 16 C 10.5 9, 13 9, 16 16 C 19 23, 21.5 23, 24.5 16"
            stroke="var(--color-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Central zero-crossing precision energy beacon */}
          <circle cx="16" cy="16" r="2.2" fill="var(--color-accent)" />

          {/* High/Low calibrated rail markers */}
          <line
            x1="12"
            y1="10"
            x2="20"
            y2="10"
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeDasharray="1.5 2"
            opacity="0.6"
          />
          <line
            x1="12"
            y1="22"
            x2="20"
            y2="22"
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeDasharray="1.5 2"
            opacity="0.6"
          />
        </g>
      )}
    </svg>
  );
}
