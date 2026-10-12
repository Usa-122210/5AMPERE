import { ArrowUp, Cpu, Github, Shield, Terminal, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandWordmark } from '../brand/BrandWordmark';
import { Button } from '../ui/Button';

/**
 * Footer — Platform Specifications & Application Footer.
 *
 * Provides:
 *   - Direct section navigation for the energy platform
 *   - Hardware specifications (DIN-Rail, 230V, MQTT, Non-invasive CT)
 *   - Link to Design System reference
 *   - Platform status and copyright
 */
export function Footer({ onOpenSizing }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="border-t transition-colors duration-200 mt-12 pt-8"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-2">
            <BrandWordmark size="md" showBadge={true} badgeText="IoT Energy Hub" />
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
              5AMPERE is a hardware-integrated smart energy management platform designed
              for sub-circuit telemetry, continuous standby elimination, and automated
              household load-shedding.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] pt-1">
              <span>230V · 50/60 Hz Standard</span>
              <span>·</span>
              <span>DIN-Rail 35mm Mount</span>
              <span>·</span>
              <span>Local MQTT / REST Protocol</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-text)]">
              Application Views
            </p>
            <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
              <li><a href="#overview" className="hover:text-[var(--color-text)] transition-colors">Energy Overview</a></li>
              <li><a href="#usage-trends" className="hover:text-[var(--color-text)] transition-colors">24-Hour Usage Profile</a></li>
              <li><a href="#loads" className="hover:text-[var(--color-text)] transition-colors">Household Loads &amp; Relays</a></li>
              <li><a href="#topology" className="hover:text-[var(--color-text)] transition-colors">Conduit Topology &amp; Flow</a></li>
              <li><a href="#insights" className="hover:text-[var(--color-text)] transition-colors">Insights &amp; Automations</a></li>
            </ul>
          </div>

          {/* Tools & Hardware Config */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--color-text)]">
              Hardware Tools
            </p>
            <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={onOpenSizing}
                  className="hover:text-[var(--color-text)] transition-colors cursor-pointer text-left"
                >
                  Panel Sizing Calculator
                </button>
              </li>
              <li><Link to="/preview" className="hover:text-[var(--color-text)] transition-colors">Design System Preview</Link></li>
              <li><span className="text-[var(--color-text-muted)] font-mono text-[11px]">Firmware: v0.3.0-prod</span></li>
              <li><span className="text-[var(--color-text-muted)] font-mono text-[11px]">CT Accuracy: ±0.5% RMS</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <p>© {new Date().getFullYear()} 5AMPERE. Smart Energy Monitoring &amp; Automation Platform.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">Local Edge Compute: Active</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:text-[var(--color-text)] transition-colors cursor-pointer flex items-center gap-1"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} />
              <span className="text-[10px]">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
