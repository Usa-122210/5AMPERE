/**
 * Surface — Reusable card/panel wrapper with theme-aware styling.
 *
 * Provides consistent backgrounds, borders, radii and padding.
 * Use `variant` to select the background level.
 */
export function Surface({
  children,
  className = '',
  variant = 'primary',
  padding = 'md',
  as: Component = 'div',
  ...props
}) {
  const variants = {
    primary: 'bg-(--color-surface) border border-(--color-border)',
    secondary: 'bg-(--color-surface-secondary) border border-(--color-border-subtle)',
    flat: 'bg-transparent',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <Component
      className={[
        'rounded-(--radius-card)',
        variants[variant] || variants.primary,
        paddings[padding] || paddings.md,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}

