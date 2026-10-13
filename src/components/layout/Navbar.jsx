import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { BrandWordmark } from '../brand/BrandWordmark';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../ui/Button';
import { useEnergyData } from '../../context/EnergyDataContext';

/**
 * Navbar — Primary application navigation bar for 5AMPERE.
 *
 * Professional energy-management application header:
 *   - 5AMPERE brand mark with home anchor
 *   - Direct view navigation (Overview, Usage Trends, Loads & Circuits, Topology, Insights)
 *   - Active State DISCOM / Tariff selector trigger pill (UPPCL / MSEDCL / BSES etc.)
 *   - Live system status telemetry badge (230V · 50 Hz Nominal)
 *   - Light/Dark theme toggle
 *   - Hardware Panel Config action
 *   - Responsive mobile drawer
 */
export function Navbar({ theme, onToggleTheme, onOpenSizing }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/index.html';
  const { activeTariff, openTariffModal } = useEnergyData();

  const navLinks = [
    { label: 'Overview', href: isHome ? '#overview' : '/#overview' },
    { label: 'Usage Trends', href: isHome ? '#usage-trends' : '/#usage-trends' },
    { label: 'Loads & Circuits', href: isHome ? '#loads' : '/#loads' },
    { label: 'System Topology', href: isHome ? '#topology' : '/#topology' },
    { label: 'Insights & Rules', href: isHome ? '#insights' : '/#insights' },
  ];

  const handleNavClick = (e, href) => {
    if (href.startsWith('#') && isHome) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b transition-colors duration-200"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Left */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:shadow-(--focus-ring) rounded-lg shrink-0"
        >
          <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
        </Link>

        {/* Desktop Product Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary)"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Status & Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Active Tariff Pill Trigger */}
          <button
            type="button"
            onClick={openTariffModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all hover:border-(--color-accent) cursor-pointer"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            title="Configure Indian State Electricity Tariff and DISCOM Slabs"
          >
            <Zap size={13} className="text-(--color-accent)" />
            <span className="font-semibold">{activeTariff.discom.split(' ')[0]}</span>
            <span className="text-(--color-text-secondary)">
              (₹{activeTariff.slabs[0]?.ratePerKWh.toFixed(2)}–₹{activeTariff.slabs[activeTariff.slabs.length - 1]?.ratePerKWh.toFixed(2)})
            </span>
            <span
              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                activeTariff.verified
                  ? 'bg-(--color-accent-subtle) text-(--color-accent)'
                  : 'bg-(--color-surface-secondary) text-(--color-text-secondary)'
              }`}
            >
              {activeTariff.verified ? 'Verified' : 'Demo'}
            </span>
          </button>

          {/* Hardware Connection Indicator */}
          <div
            className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-mono"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-(--color-success) animate-pulse" />
            <span>230V · 50 Hz</span>
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenSizing}
            className="shadow-xs font-semibold text-xs"
          >
            <span>Panel Config</span>
          </Button>

          {/* Reference Design System link */}
          <Link
            to="/preview"
            className="text-[11px] font-mono text-(--color-text-muted) hover:text-(--color-text) transition-colors px-1 py-1"
            title="Design System Reference"
          >
            DS
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={openTariffModal}
            className="px-2 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1 text-(--color-text) border-(--color-border)"
          >
            <Zap size={12} className="text-(--color-accent)" />
            <span>{activeTariff.discom.split(' ')[0]}</span>
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary) transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden border-b px-4 py-4 space-y-3"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          {/* Tariff quick switch trigger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openTariffModal();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
          >
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-(--color-accent)" />
              <div className="text-left">
                <span className="block font-bold">{activeTariff.name}</span>
                <span className="text-[10px] text-(--color-text-secondary)">
                  {activeTariff.state} · {activeTariff.verified ? 'Verified Tariff' : 'Editable Template'}
                </span>
              </div>
            </div>
            <span className="text-xs text-(--color-accent) font-semibold">Change →</span>
          </button>

          <div className="pb-1 border-b border-(--color-border-subtle) flex items-center justify-between text-xs font-mono text-(--color-text-secondary)">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-(--color-success) animate-pulse" />
              <span>5AMPERE Hardware Telemetry</span>
            </span>
            <span className="text-(--color-text-muted)">230V AC</span>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-(--color-text) hover:bg-(--color-surface-secondary)"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSizing?.();
              }}
              className="w-full"
            >
              Hardware Panel Config
            </Button>
            <Link
              to="/preview"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs font-mono text-(--color-text-muted) py-1"
            >
              Design System Foundation Preview →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
