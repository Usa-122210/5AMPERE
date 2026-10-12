import { BrandMark } from './BrandMark';
import { useLogoConcept } from '../../hooks/useLogoConcept';

/**
 * BrandWordmark — The full 5AMPERE brand lockup.
 *
 * Combines the active BrandMark with the 5AMPERE wordmark text.
 * Balanced typography with restrained accent emphasis on the numeral "5".
 * Supports passing an explicit concept or dynamically inheriting the active one.
 */
export function BrandWordmark({
  size = 'md',
  concept,
  className = '',
  showBadge = false,
  badgeText = 'IoT Platform',
}) {
  const { activeConcept } = useLogoConcept();
  const currentConcept = concept || activeConcept || 'concept-1';

  const sizes = {
    sm: { mark: 22, text: 'text-base', gap: 'gap-2' },
    md: { mark: 28, text: 'text-xl', gap: 'gap-2.5' },
    lg: { mark: 36, text: 'text-2xl', gap: 'gap-3' },
    xl: { mark: 44, text: 'text-3xl', gap: 'gap-3.5' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center ${s.gap} ${className}`}>
      <BrandMark size={s.mark} concept={currentConcept} />
      <div className="flex items-center gap-2">
        <span
          className={`${s.text} font-bold tracking-tight select-none`}
          style={{ color: 'var(--color-text)' }}
        >
          <span style={{ color: 'var(--color-accent)' }}>5</span>
          <span>AMPERE</span>
        </span>
        {showBadge && (
          <span
            className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold border"
            style={{
              backgroundColor: 'var(--color-surface-secondary)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-accent)',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
