/**
 * IconButton — A compact icon-only button with an accessible label.
 *
 * Always requires an `aria-label` for screen readers.
 */
export function IconButton({
  children,
  className = '',
  size = 'md',
  variant = 'ghost',
  'aria-label': ariaLabel,
  ...props
}) {
  const sizeStyles = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-lg',
    lg: 'w-12 h-12 rounded-xl',
  };

  const variantStyles = {
    ghost: [
      'bg-transparent text-[var(--color-text-secondary)]',
      'hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text)]',
      'active:bg-[var(--color-surface-selected)]',
    ].join(' '),

    secondary: [
      'border border-[var(--color-border)]',
      'bg-[var(--color-surface)] text-[var(--color-text)]',
      'hover:bg-[var(--color-surface-secondary)]',
    ].join(' '),
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={[
        'inline-flex items-center justify-center',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]',
        'disabled:opacity-50 disabled:pointer-events-none',
        'cursor-pointer select-none',
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.ghost,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

