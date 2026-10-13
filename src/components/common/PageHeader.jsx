/**
 * PageHeader — Standardized page title, category badge, and action bar across all pages.
 */
export function PageHeader({ title, category, badge, description, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-(--color-border)">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          {category && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-(--color-accent) font-bold">
              {category}
            </span>
          )}
          {category && <span className="text-(--color-text-muted)">·</span>}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-(--color-text)">
            {title}
          </h1>
          {badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border font-semibold bg-(--color-surface-secondary) border-(--color-border) text-(--color-accent)">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-(--color-text-secondary) max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}

