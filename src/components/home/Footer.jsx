import { ArrowUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandWordmark } from '../brand/BrandWordmark';

/**
 * Footer — Platform Specifications & Commercial Application Footer.
 *
 * Provides:
 *   - Commercial platform navigation
 *   - Indian electrical grid specifications (230V · 50 Hz, CEA compliance, DIN-Rail)
 *   - Links to Login, Sign Up, Hardware Sizing Calculator
 *   - Copyright & legal notices
 */
export function Footer({ onOpenSizing }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="border-t transition-colors duration-200 mt-16 pt-12"
      style={{
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10">
          {/* Brand Column */}
          <div className="space-y-3 lg:col-span-2">
            <BrandWordmark size="md" showBadge={true} badgeText="IoT Energy Hub" />
            <p className="text-xs sm:text-sm text-(--color-text-secondary) max-w-sm leading-relaxed">
              5AMPERE is a hardware-integrated smart energy management platform designed
              for sub-circuit telemetry, marginal slab bill reduction, and automated load control
              across Indian homes, schools, offices, and industries.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-(--color-text-muted) pt-1">
              <span>230V AC Single/Three-Phase</span>
              <span>·</span>
              <span>50 Hz Nominal</span>
              <span>·</span>
              <span>DIN-Rail 35mm Mount</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider font-bold text-(--color-text)">
              Platform
            </p>
            <ul className="space-y-1.5 text-xs text-(--color-text-secondary)">
              <li>
                <a href="#features" className="hover:text-(--color-text) transition-colors">
                  Features &amp; Capabilities
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-(--color-text) transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-(--color-text) transition-colors">
                  Hardware Architecture
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-(--color-text) transition-colors">
                  Plans &amp; Packages
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-(--color-text) transition-colors">
                  Grid Compliance
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-(--color-text) transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions & Sectors */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider font-bold text-(--color-text)">
              Solutions
            </p>
            <ul className="space-y-1.5 text-xs text-(--color-text-secondary)">
              <li>
                <span className="text-(--color-text)">Residential Homes (3–10 kW)</span>
              </li>
              <li>
                <span className="text-(--color-text)">Schools &amp; Campuses (50–150 kW)</span>
              </li>
              <li>
                <span className="text-(--color-text)">Commercial Offices (25–100 kW)</span>
              </li>
              <li>
                <span className="text-(--color-text)">Industrial Plants (100–500 kW)</span>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={onOpenSizing}
                  className="font-semibold text-(--color-accent) hover:underline cursor-pointer"
                >
                  Hardware Sizing Calculator →
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Access */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider font-bold text-(--color-text)">
              Access &amp; Security
            </p>
            <ul className="space-y-1.5 text-xs text-(--color-text-secondary)">
              <li>
                <Link to="/login" className="hover:text-(--color-text) transition-colors">
                  Customer &amp; Team Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-(--color-text) transition-colors">
                  Create New Account
                </Link>
              </li>
              <li>
                <Link to="/preview" className="hover:text-(--color-text) transition-colors">
                  Design System Preview
                </Link>
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-(--color-success)">
                  <ShieldCheck size={12} />
                  <span>CEA Certified Standard</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-(--color-border-subtle) flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-(--color-text-muted)">
          <p>© {new Date().getFullYear()} 5AMPERE. Smart Energy Monitoring &amp; Automation Platform.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">Local Edge Compute: Active</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 rounded-lg border border-(--color-border) hover:text-(--color-text) transition-colors cursor-pointer flex items-center gap-1"
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

export default Footer;
