import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * ConfirmationModal — Safe confirmation dialog for appliance contactor relays & shedding.
 * Prevents accidental circuit switching on critical appliances like refrigerators.
 */
export function ConfirmationModal({ modalState, onClose }) {
  if (!modalState || !modalState.isOpen) return null;

  const { title, message, isDangerous, confirmLabel, onConfirm } = modalState;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border shadow-xl bg-(--color-surface) border-(--color-border) p-5 sm:p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isDangerous ? 'rgba(217, 87, 87, 0.15)' : 'var(--color-accent-subtle)',
                color: isDangerous ? 'var(--color-danger)' : 'var(--color-accent)',
              }}
            >
              {isDangerous ? <ShieldAlert size={22} /> : <AlertTriangle size={22} />}
            </div>
            <div>
              <h3 id="confirm-modal-title" className="text-base font-bold text-(--color-text)">
                {title || 'Confirm Action'}
              </h3>
              <span className="text-[10px] font-mono uppercase tracking-wider text-(--color-text-muted) font-semibold">
                Contactor Relay Safety Interlock
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-surface-secondary) transition-colors cursor-pointer"
            aria-label="Cancel and close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-(--color-text-secondary) leading-relaxed">
          {message}
        </p>

        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-(--color-border-subtle)">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isDangerous ? 'secondary' : 'primary'}
            size="sm"
            onClick={onConfirm}
            className={isDangerous ? 'border border-(--color-danger) text-(--color-danger)' : ''}
          >
            {confirmLabel || 'Confirm Action'}
          </Button>
        </div>
      </div>
    </div>
  );
}

