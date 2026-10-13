import { Check, Layers } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { BrandWordmark } from './BrandWordmark';
import { Surface } from '../ui/Surface';
import { Button } from '../ui/Button';
import { useLogoConcept } from '../../hooks/useLogoConcept';

/**
 * LogoConcepts — Interactive Logo Comparison & Selection Suite for 5AMPERE.
 *
 * Allows the user to inspect and compare three distinct, production-grade
 * logo concepts before making an official selection:
 *
 * Concept 1: Toroidal Current Transformer (Precision CT Loop)
 * Concept 2: Geometric "5A" Monogram (Architectural Circuit)
 * Concept 3: Sinusoidal Current Shunt (Energy Pulse Vector)
 */
export function LogoConcepts({ className = '', compact = false }) {
  const { activeConcept, setConcept } = useLogoConcept();

  const concepts = [
    {
      id: 'concept-1',
      title: 'Concept 1: Toroidal Current Transformer',
      subtitle: 'Precision Split-Core CT Loop',
      tag: 'Hardware Sensing',
      description:
        'Directly reflects the physical current transformer (CT) clamp at the heart of 5AMPERE hardware. Features a calibrated split ring, micro-winding air gap, and an embedded magnetic flux directional vector.',
      rationale:
        'Grounds the brand in authentic electrical engineering and non-invasive panel measurement. Visually communicating physical hardware telemetry rather than generic cloud SaaS.',
      technicalDetails: [
        'Split-core toroidal clamp geometry with calibrated gap',
        'Concentric inner magnetic induction winding ring',
        'Directional forward flux chevron & precision center node',
      ],
    },
    {
      id: 'concept-2',
      title: 'Concept 2: Geometric "5A" Monogram',
      subtitle: 'Architectural Circuit Trace',
      tag: 'Iconic Monogram',
      description:
        'A single continuous architectural electrical trace that seamlessly interlocks the numeral "5" and the capital "A" (Ampere). Features dual surface-mount terminal test points and precision 45° conductive angles.',
      rationale:
        'High memorability and bold brand recognition. Unites the company name (5AMPERE) into a unified, indelible emblem suitable for laser-etching on DIN-rail hardware enclosures.',
      technicalDetails: [
        'Single continuous conductive PCB trace connecting 5 and A',
        'Dual surface-mount circuit terminal nodes',
        'Balanced 45° chamfers optimized for industrial hardware casting',
      ],
    },
    {
      id: 'concept-3',
      title: 'Concept 3: Sinusoidal Current Shunt',
      subtitle: 'Energy Pulse Vector',
      tag: 'Active Telemetry',
      description:
        'A calibrated 50/60 Hz AC sinusoidal waveform intersecting a precision hexagonal meter enclosure. Includes a central zero-crossing energy pulse node and high/low threshold calibration rails.',
      rationale:
        'Symbolizes real-time dynamic energy telemetry, grid frequency synchronization, and sub-second power factor monitoring. Communicates intelligent, active optimization.',
      technicalDetails: [
        'Pure calibrated sinusoidal AC power wave curve',
        'Precision hexagonal DIN enclosure boundary',
        'Central zero-crossing metering node & dual calibration rails',
      ],
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Banner / Selection Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-(--color-surface-secondary) border-(--color-border)">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--color-accent-subtle)' }}
          >
            <Layers size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase text-(--color-accent)">
                Brand Identity Evaluation
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-(--color-surface) border border-(--color-border) text-(--color-text-secondary)">
                Interactive Selector
              </span>
            </div>
            <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--color-text)' }}>
              Compare Three Distinct 5AMPERE Logo Concepts
            </p>
          </div>
        </div>

        {/* Quick concept switcher pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-(--color-surface) border border-(--color-border) self-start sm:self-auto">
          {concepts.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setConcept(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeConcept === c.id
                  ? 'bg-(--color-accent) text-(--color-accent-text) shadow-xs'
                  : 'text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary)'
              }`}
            >
              <span>Concept {idx + 1}</span>
              {activeConcept === c.id && <Check size={12} />}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {concepts.map((item, idx) => {
          const isSelected = activeConcept === item.id;

          return (
            <Surface
              key={item.id}
              variant="primary"
              padding="lg"
              className={`flex flex-col justify-between border transition-all duration-200 relative ${
                isSelected
                  ? 'border-(--color-accent) shadow-md ring-2 ring-(--color-accent) ring-opacity-20'
                  : 'border-(--color-border) hover:border-(--color-border-subtle)'
              }`}
            >
              {/* Active Badge */}
              {isSelected && (
                <div
                  className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs flex items-center gap-1"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-accent-text)',
                  }}
                >
                  <Check size={11} />
                  <span>Currently Active</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Visual Mark & Wordmark Showcase Box */}
                <div
                  className="p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 text-center transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface-secondary)',
                    borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                  }}
                >
                  {/* High-Res Mark */}
                  <div className="p-3 rounded-2xl bg-(--color-surface) border border-(--color-border) shadow-xs">
                    <BrandMark size={56} concept={item.id} />
                  </div>

                  {/* Wordmark Lockup */}
                  <BrandWordmark size="md" concept={item.id} showBadge={true} />
                </div>

                {/* Concept Title & Description */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-semibold uppercase text-(--color-accent)">
                      {item.tag}
                    </span>
                    <span className="text-[11px] font-mono text-(--color-text-muted)">
                      Option 0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mt-1" style={{ color: 'var(--color-text)' }}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-(--color-text-secondary) mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Technical Geometry Breakdown */}
                <div className="pt-3 border-t border-(--color-border) space-y-2">
                  <p className="text-[11px] font-mono font-semibold uppercase text-(--color-text-muted)">
                    Engineering Geometry:
                  </p>
                  <ul className="space-y-1.5">
                    {item.technicalDetails.map((detail) => (
                      <li
                        key={detail}
                        className="text-xs text-(--color-text-secondary) flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-(--color-accent) mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Design Rationale */}
                <div
                  className="p-3 rounded-xl border text-xs text-(--color-text-secondary) leading-relaxed"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <span className="font-semibold text-(--color-text) block mb-1">
                    Design Rationale:
                  </span>
                  {item.rationale}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-(--color-border)">
                <Button
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setConcept(item.id)}
                  className="w-full justify-center"
                >
                  {isSelected ? (
                    <span className="flex items-center gap-1.5">
                      <Check size={14} /> Selected Concept
                    </span>
                  ) : (
                    <span>Select Concept {idx + 1} to Preview</span>
                  )}
                </Button>
              </div>
            </Surface>
          );
        })}
      </div>

      {/* Multi-Size Scalability Preview Strip */}
      <Surface variant="primary" padding="md" className="border border-(--color-border)">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-semibold uppercase text-(--color-text-muted)">
              Scalability &amp; Legibility Verification (Active Concept: {activeConcept.toUpperCase()})
            </span>
            <span className="text-[11px] text-(--color-text-secondary)">
              Tested at standard icon resolutions (16px to 64px)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-around gap-6 py-4 px-4 rounded-xl bg-(--color-surface-secondary) border border-(--color-border)">
            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2 rounded-lg bg-(--color-surface) border border-(--color-border)">
                <BrandMark size={16} concept={activeConcept} />
              </div>
              <span className="text-[10px] font-mono text-(--color-text-muted)">16px (Favicon)</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2 rounded-lg bg-(--color-surface) border border-(--color-border)">
                <BrandMark size={24} concept={activeConcept} />
              </div>
              <span className="text-[10px] font-mono text-(--color-text-muted)">24px (Mobile Bar)</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="p-2.5 rounded-lg bg-(--color-surface) border border-(--color-border)">
                <BrandMark size={32} concept={activeConcept} />
              </div>
              <span className="text-[10px] font-mono text-(--color-text-muted)">32px (Desktop Nav)</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="p-3 rounded-lg bg-(--color-surface) border border-(--color-border)">
                <BrandMark size={48} concept={activeConcept} />
              </div>
              <span className="text-[10px] font-mono text-(--color-text-muted)">48px (Hero Feature)</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="p-3.5 rounded-lg bg-(--color-surface) border border-(--color-border)">
                <BrandMark size={64} concept={activeConcept} />
              </div>
              <span className="text-[10px] font-mono text-(--color-text-muted)">64px (Enclosure Mark)</span>
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

