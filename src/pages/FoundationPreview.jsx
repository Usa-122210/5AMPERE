import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  Layers,
  Palette,
  Settings,
  Type,
  XCircle,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Surface } from '../components/ui/Surface';
import { IconButton } from '../components/ui/IconButton';
import { LogoConcepts } from '../components/brand/LogoConcepts';
import { EnergyFlowVisualizer } from '../components/motion/EnergyFlowVisualizer';

/**
 * FoundationPreview — Visual validation screen for the design system.
 *
 * Demonstrates: colour tokens, typography hierarchy, button variants,
 * surface treatment, semantic states, brand lockup, and spacing.
 * This is NOT the final dashboard — it's a design reference.
 */
export function FoundationPreview() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">

      {/* ===== Hero Section ===== */}
      <section className="space-y-4 pt-4">
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: 'var(--color-accent)' }}
        >
          Phase 1 — Foundation Preview
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          Design System
        </h1>
        <p
          className="text-base sm:text-lg max-w-2xl leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          A visual reference for the 5AMPERE interface foundation.
          Colours, typography, components, and interaction patterns
          are demonstrated below for both light and dark themes.
        </p>
      </section>

      {/* ===== Brand Section ===== */}
      <section className="space-y-6">
        <SectionHeading icon={Zap} title="Brand Identity & Three Logo Concepts" />
        <LogoConcepts />
      </section>

      {/* ===== Dynamic Energy Flow Animation System ===== */}
      <section className="space-y-6">
        <SectionHeading icon={Activity} title="Dynamic Energy Flow Animation System" />
        <EnergyFlowVisualizer />
      </section>

      {/* ===== Colour System ===== */}
      <section className="space-y-6">
        <SectionHeading icon={Palette} title="Colour System" />

        {/* Core palette */}
        <div className="space-y-3">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Core Palette
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <ColourSwatch name="Background" token="--color-bg" />
            <ColourSwatch name="Surface" token="--color-surface" />
            <ColourSwatch name="Surface 2" token="--color-surface-secondary" />
            <ColourSwatch name="Border" token="--color-border" />
            <ColourSwatch name="Accent" token="--color-accent" />
            <ColourSwatch name="Accent Hover" token="--color-accent-hover" />
          </div>
        </div>

        {/* Text colours */}
        <div className="space-y-3">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Text Colours
          </h3>
          <Surface variant="secondary" padding="lg">
            <div className="space-y-2">
              <p className="text-base font-medium" style={{ color: 'var(--color-text)' }}>
                Primary text — clear and readable
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Secondary text — supporting information and descriptions
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Muted text — metadata, timestamps, and tertiary labels
              </p>
            </div>
          </Surface>
        </div>

        {/* Semantic colours */}
        <div className="space-y-3">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Semantic States
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SemanticCard
              icon={CheckCircle2}
              label="Healthy"
              description="System operating normally"
              color="var(--color-success)"
            />
            <SemanticCard
              icon={AlertTriangle}
              label="Attention"
              description="Unusual consumption detected"
              color="var(--color-warning)"
            />
            <SemanticCard
              icon={XCircle}
              label="Critical"
              description="Connection lost to device"
              color="var(--color-danger)"
            />
            <SemanticCard
              icon={Info}
              label="Offline"
              description="Device powered down"
              color="var(--color-neutral)"
            />
          </div>
        </div>
      </section>

      {/* ===== Typography ===== */}
      <section className="space-y-6">
        <SectionHeading icon={Type} title="Typography" />
        <Surface>
          <div className="space-y-5">
            <div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Display — 48px
              </span>
              <p className="text-5xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
                Energy Overview
              </p>
            </div>
            <div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Page heading — 32px
              </span>
              <p className="text-3xl font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
                Room Dashboard
              </p>
            </div>
            <div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Section heading — 22px
              </span>
              <h3 className="text-[22px] font-semibold" style={{ color: 'var(--color-text)' }}>
                Active Devices
              </h3>
            </div>
            <div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Card heading — 16px
              </span>
              <h4 className="text-base font-medium" style={{ color: 'var(--color-text)' }}>
                Living Room — Power Usage
              </h4>
            </div>
            <div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Body — 14px
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Monitor real-time energy consumption across connected appliances.
                Track patterns, set limits, and reduce your electricity costs
                with intelligent automation.
              </p>
            </div>
            <div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Label — 12px
              </span>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Last updated: 2 minutes ago · Device ID: ESP32-A1B2
              </p>
            </div>
          </div>
        </Surface>
      </section>

      {/* ===== Buttons ===== */}
      <section className="space-y-6">
        <SectionHeading icon={Layers} title="Button Components" />

        {/* Variants */}
        <div className="space-y-3">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Variants
          </h3>
          <Surface>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">
                <Zap size={16} />
                Primary Action
              </Button>
              <Button variant="secondary">
                <Settings size={16} />
                Secondary
              </Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">
                <XCircle size={16} />
                Destructive
              </Button>
            </div>
          </Surface>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Sizes
          </h3>
          <Surface>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
          </Surface>
        </div>

        {/* States */}
        <div className="space-y-3">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            States
          </h3>
          <Surface>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Enabled</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="secondary">Enabled</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </Surface>
        </div>

        {/* Icon buttons */}
        <div className="space-y-3">
          <h3
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Icon Buttons
          </h3>
          <Surface>
            <div className="flex flex-wrap items-center gap-3">
              <IconButton aria-label="Settings" variant="ghost">
                <Settings size={18} />
              </IconButton>
              <IconButton aria-label="Activity monitor" variant="ghost">
                <Activity size={18} />
              </IconButton>
              <IconButton aria-label="Navigate" variant="secondary">
                <ArrowRight size={18} />
              </IconButton>
              <IconButton aria-label="Layers" variant="secondary">
                <Layers size={18} />
              </IconButton>
            </div>
          </Surface>
        </div>
      </section>

      {/* ===== Surface Variants ===== */}
      <section className="space-y-6">
        <SectionHeading icon={Layers} title="Surface Treatments" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Surface variant="primary">
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Primary Surface
            </h4>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Default card background with border. Used for most content panels.
            </p>
          </Surface>
          <Surface variant="secondary">
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Secondary Surface
            </h4>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Subtle background for nested content or grouped information.
            </p>
          </Surface>
          <Surface variant="flat" className="border border-dashed" style={{ borderColor: 'var(--color-border)' }}>
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
              Flat Surface
            </h4>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Transparent. Content sits directly on the page background.
            </p>
          </Surface>
        </div>
      </section>

      {/* ===== Spacing & Radius ===== */}
      <section className="space-y-6">
        <SectionHeading icon={Settings} title="Spacing & Radius" />
        <Surface>
          <div className="space-y-6">
            {/* Spacing scale */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Spacing Scale (4px base)
              </h4>
              <div className="flex flex-wrap items-end gap-3">
                {[4, 8, 12, 16, 24, 32, 48].map((px) => (
                  <div key={px} className="flex flex-col items-center gap-1">
                    <div
                      className="rounded"
                      style={{
                        width: px,
                        height: px,
                        backgroundColor: 'var(--color-accent)',
                        opacity: 0.6,
                      }}
                    />
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      {px}px
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radius scale */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Border Radius
              </h4>
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { label: 'sm (8px)', radius: 'var(--radius-sm)' },
                  { label: 'md (12px)', radius: 'var(--radius-md)' },
                  { label: 'card (14px)', radius: 'var(--radius-card)' },
                  { label: 'lg (16px)', radius: 'var(--radius-lg)' },
                  { label: 'xl (20px)', radius: 'var(--radius-xl)' },
                  { label: 'pill', radius: 'var(--radius-pill)' },
                ].map(({ label, radius }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div
                      className="w-12 h-12 border-2"
                      style={{
                        borderRadius: radius,
                        borderColor: 'var(--color-accent)',
                        opacity: 0.5,
                      }}
                    />
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Surface>
      </section>

      {/* ===== Footer ===== */}
      <footer className="pt-8 pb-12 text-center">
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          5AMPERE · Phase 1 Foundation · Design System Reference
        </p>
      </footer>
    </div>
  );
}

/* --- Internal helper components --- */

function SectionHeading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg"
        style={{ backgroundColor: 'var(--color-accent-subtle)' }}
      >
        <Icon size={16} style={{ color: 'var(--color-accent)' }} />
      </div>
      <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
        {title}
      </h2>
    </div>
  );
}

function ColourSwatch({ name, token }) {
  return (
    <div className="space-y-1.5">
      <div
        className="w-full h-14 rounded-lg border"
        style={{
          backgroundColor: `var(${token})`,
          borderColor: 'var(--color-border)',
        }}
      />
      <p className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
        {name}
      </p>
      <p className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {token}
      </p>
    </div>
  );
}

function SemanticCard({ icon: Icon, label, description, color }) {
  return (
    <Surface padding="md">
      <div className="flex items-start gap-3">
        <Icon size={18} style={{ color, flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-sm font-medium" style={{ color }}>
            {label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {description}
          </p>
        </div>
      </div>
    </Surface>
  );
}

