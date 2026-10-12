/**
 * Button — Reusable button component with four variants.
 *
 * Variants:
 *   primary     — Main action, accent-coloured
 *   secondary   — Bordered, neutral
 *   ghost       — Transparent, low emphasis
 *   destructive — Danger actions
 *
 * All variants include hover, pressed, focus, and disabled states.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-medium leading-none',
    'transition-colors duration-200',
    'focus-visible:outline-none',
    'disabled:opacity-50 disabled:pointer-events-none',
    'select-none cursor-pointer',
    'disabled:cursor-not-allowed',
  ].join(' ');

  const sizeStyles = {
    sm: 'rounded-lg px-3 py-2 text-xs',
    md: 'rounded-lg px-4 py-2.5 text-sm',
    lg: 'rounded-lg px-5 py-3 text-base',
  };

  const variantStyles = {
    primary: [
      'bg-[var(--color-accent)] text-[var(--color-accent-text)]',
      'hover:bg-[var(--color-accent-hover)]',
      'active:brightness-90',
      'focus-visible:shadow-[var(--focus-ring)]',
    ].join(' '),

    secondary: [
      'border border-[var(--color-border)]',
      'bg-[var(--color-surface)] text-[var(--color-text)]',
      'hover:bg-[var(--color-surface-secondary)]',
      'active:bg-[var(--color-surface-selected)]',
      'focus-visible:shadow-[var(--focus-ring)]',
    ].join(' '),

    ghost: [
      'bg-transparent text-[var(--color-text-secondary)]',
      'hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]',
      'active:bg-[var(--color-surface-selected)]',
      'focus-visible:shadow-[var(--focus-ring)]',
    ].join(' '),

    destructive: [
      'bg-[var(--color-danger)] text-white',
      'hover:brightness-110',
      'active:brightness-90',
      'focus-visible:shadow-[var(--focus-ring)]',
    ].join(' '),
  };

  return (
    <button
      type={type}
      className={`${base} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

