import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Cpu,
  ShieldCheck,
  ArrowRight,
  Layers,
  Receipt,
  Sliders,
  Home,
  School,
  Building,
  Factory,
  CheckCircle2,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Calculator,
  Activity,
  Lock,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Code2,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { EnergyFlowVisualizer } from '../components/motion/EnergyFlowVisualizer';
import { useAuth } from '../context/AuthContext';

/**
 * HomePage — Commercial Public Landing Page for 5AMPERE.
 *
 * Accessible without login. Contains zero private user data, zero household
 * relay controls, and zero sidebar navigation.
 *
 * Sections:
 *   1. Hero (#hero)
 *   2. Features & Capabilities (#features)
 *   3. How It Works (#how-it-works)
 *   4. Interactive Hardware Architecture (#architecture)
 *   5. Hardware Packages & Sizing (#pricing)
 *   6. About & Indian Grid Compliance (#about)
 *   7. Frequently Asked Questions (#faq)
 *   8. Contact & Consultation (#contact)
 */
export function HomePage() {
  const context = useOutletContext();
  const openSizing = context?.openSizing;
  const { currentUser } = useAuth();

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    propertyType: 'Residential Home',
    discom: 'UPPCL / State DISCOM',
    message: '',
  });

  const dashboardRoute =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'developer' || currentUser?.role === 'technician'
      ? '/developer'
      : '/dashboard';

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) return;
    setContactSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20">
      {/* =====================================================================
          1. HERO SECTION (#hero)
      ===================================================================== */}
      <section id="hero" className="pt-2 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full border border-(--color-accent)/30 bg-(--color-accent-subtle)">
              <span className="w-2 h-2 rounded-full bg-(--color-accent) animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-(--color-accent)">
                5AMPERE Smart Energy Platform
              </span>
              <span className="text-[11px] font-mono text-(--color-text-secondary)">
                · 230V / 415V Indian Grid Ready
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-(--color-text)">
              Sub-Circuit Energy Intelligence &amp; Automated Bill Reduction
            </h1>

            <p className="text-sm sm:text-base text-(--color-text-secondary) leading-relaxed max-w-2xl">
              Stop guessing what drives your monthly electricity bill. 5AMPERE combines
              DIN-rail split-core CT hardware with an Indian progressive DISCOM tariff engine
              to monitor every appliance, forecast slab jumps before they happen, and automate
              heavy loads across homes, schools, offices, and industries.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {currentUser ? (
                <Link to={dashboardRoute}>
                  <Button variant="primary" size="md" className="font-bold text-xs sm:text-sm shadow-sm">
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck size={16} />
                    ) : currentUser.role === 'developer' || currentUser.role === 'technician' ? (
                      <Code2 size={16} />
                    ) : (
                      <LayoutDashboard size={16} />
                    )}
                    <span>
                      Go to {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'developer' || currentUser.role === 'technician' ? 'Developer' : 'User'} Dashboard
                    </span>
                    <ArrowRight size={15} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button variant="primary" size="md" className="font-bold text-xs sm:text-sm shadow-sm">
                      <UserPlus size={16} />
                      <span>Get Started — Sign Up</span>
                      <ArrowRight size={15} />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="md" className="font-bold text-xs sm:text-sm">
                      <LogIn size={16} className="text-(--color-accent)" />
                      <span>Login to Portal</span>
                    </Button>
                  </Link>
                </>
              )}

              {openSizing && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={openSizing}
                  className="font-semibold text-xs sm:text-sm"
                >
                  <Calculator size={15} className="text-(--color-accent)" />
                  <span>Panel Sizing Calculator</span>
                </Button>
              )}
            </div>

            {/* Key Engineering Benchmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-(--color-border)">
              {[
                { value: '1.2 kHz', label: 'True-RMS Sampling' },
                { value: '15–28%', label: 'Bill Slab Reduction' },
                { value: '±0.5%', label: 'Split-Core CT Accuracy' },
                { value: '< 30 Min', label: 'DIN-Rail Installation' },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-(--color-surface) border border-(--color-border)">
                  <p className="text-base sm:text-lg font-mono font-extrabold text-(--color-accent)">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Hardware & Architecture Summary Card */}
          <div className="lg:col-span-5">
            <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-(--color-border) pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-(--color-accent-subtle) border border-(--color-accent) flex items-center justify-center">
                    <Cpu size={20} className="text-(--color-accent)" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-(--color-text)">
                      5AMPERE Edge Hub Architecture
                    </h2>
                    <p className="text-[11px] font-mono text-(--color-text-secondary)">
                      Model 5A-DIN16 · 35mm Enclosure Mount
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-(--color-accent-subtle) text-(--color-accent) border border-(--color-accent)/30">
                  Hardware + SaaS
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Non-Invasive Split-Core CT Sensors',
                    desc: 'Clamps onto existing MCB phase wires inside your distribution box without cutting cables.',
                    badge: '6–24 Channels',
                  },
                  {
                    title: 'Progressive Indian DISCOM Slab Engine',
                    desc: 'Tracks telescopic & non-telescopic slab rates, fixed charges/kW, FPPPA & electricity duty.',
                    badge: 'INR (₹) Native',
                  },
                  {
                    title: 'DIN-Rail Contactor Relay Automation',
                    desc: 'Automatically sheds geysers, HVAC & EV chargers before crossing into expensive marginal slabs.',
                    badge: '40A / 63A Relays',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-3.5 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-(--color-text)">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-(--color-surface) text-(--color-accent) border border-(--color-border) shrink-0">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-(--color-text-secondary) leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-(--color-border) flex items-center justify-between text-xs">
                <span className="text-(--color-text-muted) font-mono text-[11px]">
                  Supports User, Developer &amp; Admin Portals
                </span>
                <a
                  href="#how-it-works"
                  className="font-bold text-(--color-accent) hover:underline inline-flex items-center gap-1"
                >
                  <span>See How It Works</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </Surface>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FEATURES & CAPABILITIES SECTION (#features)
      ===================================================================== */}
      <section id="features" className="space-y-8 scroll-mt-20">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-(--color-accent) font-bold">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-text)">
            Engineered for Complete Visibility &amp; Control
          </h2>
          <p className="text-xs sm:text-sm text-(--color-text-secondary) leading-relaxed">
            Traditional utility meters only show a single cumulative kWh number at the end of the month.
            5AMPERE disaggregates your electricity usage circuit-by-circuit in real time.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Activity,
              title: 'Sub-Circuit Telemetry',
              desc: 'Measure real-time active power (kW), current (Amps), voltage (230V), and power factor across individual room and appliance circuits at 1.2 kHz.',
              tag: 'Hardware Sensing',
            },
            {
              icon: Receipt,
              title: 'Indian Tariff Forecasting',
              desc: 'Calculates exact monthly bills across progressive DISCOM slabs (0–100, 101–150, 151–300, 300+ units) including fixed kW charges and duty.',
              tag: 'DISCOM Engine',
            },
            {
              icon: Sliders,
              title: 'Contactor Load Shedding',
              desc: 'Prevent peak load penalties and top-tier slab crossings by automating heavy resistive and inductive loads via DIN-rail relays.',
              tag: 'Smart Relays',
            },
            {
              icon: Layers,
              title: 'Multi-Role Workspaces',
              desc: 'Dedicated portals for Property Owners (User), Field Commissioning Engineers (Developer), and System Administrators (Admin).',
              tag: 'Role Separation',
            },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <Surface
                key={feat.title}
                variant="primary"
                padding="lg"
                className="border border-(--color-border) flex flex-col justify-between space-y-4 hover:border-(--color-accent) transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-(--color-accent-subtle) border border-(--color-accent)/30 flex items-center justify-center">
                      <Icon size={20} className="text-(--color-accent)" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-(--color-surface-secondary) text-(--color-text-muted) border border-(--color-border)">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-(--color-text)">{feat.title}</h3>
                  <p className="text-xs text-(--color-text-secondary) leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </Surface>
            );
          })}
        </div>

        {/* Supported Property Types Strip */}
        <div className="p-6 rounded-2xl border border-(--color-border) bg-(--color-surface) space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-(--color-text)">
                Built for Every Property Scale
              </h3>
              <p className="text-xs text-(--color-text-secondary)">
                During onboarding or technician commissioning, 5AMPERE adapts its topology to your property type:
              </p>
            </div>
            <Link
              to="/signup"
              className="text-xs font-bold text-(--color-accent) hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Configure Your Property</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Home,
                type: 'Residential Homes',
                load: '3 kW – 15 kW Sanctioned',
                items: 'Inverter ACs, Water Geysers, Kitchen Appliances, Rooftop Solar PV',
              },
              {
                icon: School,
                type: 'Schools & Campuses',
                load: '50 kW – 150 kW Sanctioned',
                items: 'Classroom HVAC Wings, Computer Labs, Water Coolers, Campus Lighting',
              },
              {
                icon: Building,
                type: 'Commercial Offices',
                load: '25 kW – 100 kW Sanctioned',
                items: 'Central Chiller Plants, Server Racks, Workstation Floors, EV Bays',
              },
              {
                icon: Factory,
                type: 'Industrial Facilities',
                load: '100 kW – 500 kW Sanctioned',
                items: '3-Phase CNC Feeders, Air Compressors, Capacitor Banks, LT Panels',
              },
            ].map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.type}
                  className="p-4 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-(--color-accent-subtle) text-(--color-accent) flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-(--color-text)">{sector.type}</h4>
                      <span className="text-[10px] font-mono text-(--color-accent) font-semibold">
                        {sector.load}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-(--color-text-secondary) leading-relaxed">
                    {sector.items}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. HOW IT WORKS SECTION (#how-it-works)
      ===================================================================== */}
      <section id="how-it-works" className="space-y-8 scroll-mt-20">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-(--color-accent) font-bold">
            Deployment Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-text)">
            How 5AMPERE Works in 4 Simple Steps
          </h2>
          <p className="text-xs sm:text-sm text-(--color-text-secondary) leading-relaxed">
            Zero rewiring required. Our modular DIN-rail hardware installs directly inside your existing
            MCB distribution board and begins streaming circuit-level data immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Mount DIN-Rail Hub',
              desc: 'Snap the 5AMPERE Core Edge unit onto the standard 35mm DIN rail inside your main electrical distribution panel.',
            },
            {
              step: '02',
              title: 'Clamp Split-Core CTs',
              desc: 'Clip non-invasive Current Transformer sensors around individual outgoing MCB wires (AC, Geyser, Kitchen, Solar).',
            },
            {
              step: '03',
              title: 'Select DISCOM Tariff',
              desc: 'Log in to your User Portal, choose your state DISCOM slab schedule, and map rooms and appliances.',
            },
            {
              step: '04',
              title: 'Monitor & Automate',
              desc: 'Track real-time kW draw, receive marginal slab alerts, and enable automated Saving Mode schedules.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl border border-(--color-border) bg-(--color-surface) space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-(--color-accent-subtle) text-(--color-accent) border border-(--color-accent)/30">
                  STEP {item.step}
                </span>
                <CheckCircle2 size={16} className="text-(--color-accent)" />
              </div>
              <h3 className="text-base font-bold text-(--color-text)">{item.title}</h3>
              <p className="text-xs text-(--color-text-secondary) leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. INTERACTIVE HARDWARE ARCHITECTURE SHOWCASE (#architecture)
      ===================================================================== */}
      <section id="architecture" className="space-y-6 scroll-mt-20">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-(--color-accent) font-bold">
            Interactive Architecture Concept
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-text)">
            See How Energy Flows Through 5AMPERE
          </h2>
          <p className="text-xs sm:text-sm text-(--color-text-secondary) leading-relaxed">
            Test our interactive topology model below: switch between Balanced, Peak Surge, and Eco Solar modes
            or click individual circuit loads to observe how the 5AMPERE Smart Unit monitors branch conduits.
          </p>
        </div>

        <EnergyFlowVisualizer />
      </section>

      {/* =====================================================================
          5. HARDWARE PACKAGES & SIZING (#pricing)
      ===================================================================== */}
      <section id="pricing" className="space-y-8 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-(--color-accent) font-bold">
              Hardware &amp; Platform Packages
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-text)">
              Transparent Hardware Kits for Every Property
            </h2>
            <p className="text-xs sm:text-sm text-(--color-text-secondary)">
              One-time hardware kit pricing with full access to the 5AMPERE web dashboard, Indian tariff engine, and local MQTT telemetry.
            </p>
          </div>

          {openSizing && (
            <Button variant="secondary" size="sm" onClick={openSizing} className="self-start md:self-auto">
              <Calculator size={14} className="text-(--color-accent)" />
              <span>Launch Panel Sizing Calculator</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Home Starter Kit',
              subtitle: 'For 1BHK – 4BHK Apartments & Villas',
              price: '₹14,500',
              unit: 'One-Time Hardware + Installation',
              popular: false,
              features: [
                '5AMPERE Core DIN-Rail Hub (Single-Phase 230V)',
                '6x Split-Core CT Clamps (20A / 32A / 63A)',
                '2x Smart Contactor Relays for AC & Geyser',
                'Progressive State DISCOM Bill Forecasting',
                'User Energy Portal & Saving Mode Automation',
              ],
            },
            {
              name: 'Commercial & Campus Pro',
              subtitle: 'For Schools, Offices & Retail Spaces',
              price: '₹34,000',
              unit: 'Three-Phase 415V Distribution Kit',
              popular: true,
              features: [
                '3-Phase 5AMPERE Pro Hub (415V AC · 50 Hz)',
                '12x High-Accuracy CT Sensors (±0.5% RMS)',
                '4x Heavy-Duty 63A DIN Contactor Relays',
                'Peak Demand & Time-of-Day (ToD) Tariff Guard',
                'Wing / Floor-Wise Load Disaggregation',
              ],
            },
            {
              name: 'Industrial LT Panel Suite',
              subtitle: 'For Manufacturing Units & Plants',
              price: 'Custom',
              unit: 'Tailored to Sanctioned kVA / kW Load',
              popular: false,
              features: [
                '24+ Channel Multi-Panel Telemetry Array',
                '200A–600A Busbar Split-Core CT Transformers',
                'Power Factor (PF) & Harmonic Distortion Alerts',
                'Dedicated Field Engineer Commissioning',
                'Full API, Local MQTT & Modbus RTU Export',
              ],
            },
          ].map((plan) => (
            <Surface
              key={plan.name}
              variant="primary"
              padding="lg"
              className={`border flex flex-col justify-between space-y-6 ${
                plan.popular ? 'border-(--color-accent) shadow-md' : 'border-(--color-border)'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-(--color-accent)">
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-(--color-accent) text-white">
                      Most Popular
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono font-extrabold text-(--color-text)">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-(--color-text-muted) mt-0.5">
                    {plan.unit}
                  </p>
                  <p className="text-xs text-(--color-text-secondary) mt-2">
                    {plan.subtitle}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-3 border-t border-(--color-border)">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-(--color-text-secondary)">
                      <CheckCircle2 size={14} className="text-(--color-accent) shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Link to="/signup">
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="md"
                    className="w-full justify-center font-bold text-xs"
                  >
                    <span>Select {plan.name}</span>
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </Surface>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. ABOUT & INDIAN GRID COMPLIANCE SECTION (#about)
      ===================================================================== */}
      <section id="about" className="space-y-6 scroll-mt-20">
        <div className="p-6 sm:p-8 rounded-2xl border border-(--color-border) bg-(--color-surface) grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-(--color-accent) font-bold">
              About 5AMPERE Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-text)">
              Designed for Indian Electrical Realities
            </h2>
            <p className="text-xs sm:text-sm text-(--color-text-secondary) leading-relaxed">
              Imported smart plugs melt under 16A Indian geyser and air-conditioner loads, and foreign apps
              only multiply flat kWh rates. 5AMPERE is engineered from the ground up for Indian 230V/415V
              distribution boards, handling wide voltage swings (170V–270V AC) and progressive state DISCOM
              billing structures.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'IS/IEC 61010-1 Safety Compliant CT Isolation',
                'Flame-Retardant Polycarbonate DIN 35mm Enclosure',
                'Offline Edge Autonomy (Relays work without internet)',
                'Safety Lockout on Medical & Critical Refrigerator Circuits',
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-xs text-(--color-text)">
                  <ShieldCheck size={15} className="text-(--color-success) shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="p-5 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-(--color-accent)">
                <Lock size={14} />
                <span>Role-Based Platform Access</span>
              </div>
              <p className="text-xs text-(--color-text-secondary) leading-relaxed">
                Explore the 5AMPERE platform using your personal account or evaluate our role-based portals on the Login page:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-between">
                  <div>
                    <strong className="text-(--color-text) block">User Portal</strong>
                    <span className="text-[11px] text-(--color-text-secondary)">
                      Live kWh, appliance relays, DISCOM bills &amp; savings
                    </span>
                  </div>
                  <Link to="/login" className="text-[11px] font-bold text-(--color-accent) hover:underline">
                    Login →
                  </Link>
                </div>
                <div className="p-2.5 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-between">
                  <div>
                    <strong className="text-(--color-text) block">Developer / Technician Workspace</strong>
                    <span className="text-[11px] text-(--color-text-secondary)">
                      Hardware catalogue, panel configurator &amp; installations
                    </span>
                  </div>
                  <Link to="/login?role=developer" className="text-[11px] font-bold text-(--color-accent) hover:underline">
                    Login →
                  </Link>
                </div>
                <div className="p-2.5 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-between">
                  <div>
                    <strong className="text-(--color-text) block">Admin Control Center</strong>
                    <span className="text-[11px] text-(--color-text-secondary)">
                      System oversight, user accounts &amp; audit logs
                    </span>
                  </div>
                  <Link to="/login?role=admin" className="text-[11px] font-bold text-(--color-accent) hover:underline">
                    Login →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. FREQUENTLY ASKED QUESTIONS (#faq)
      ===================================================================== */}
      <section id="faq" className="space-y-6 scroll-mt-20">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-(--color-accent) font-bold">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-(--color-text)">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              q: 'Do I need to cut wires or replace my existing MCB board?',
              a: 'No. 5AMPERE uses split-core Current Transformers (CTs) that clip around your existing phase wires inside the distribution box. Installation takes under 30 minutes by a certified electrician.',
            },
            {
              q: 'How does 5AMPERE calculate Indian electricity bills accurately?',
              a: 'Unlike generic apps that use a single flat rate, our tariff engine evaluates progressive DISCOM slabs (e.g., UPPCL, MSEDCL, BSES), sanctioned load fixed charges per kW, FPPPA fuel surcharge, and state electricity duty.',
            },
            {
              q: 'What happens if my home Wi-Fi or internet goes down?',
              a: 'The 5AMPERE DIN-rail hub runs local edge firmware. All safety cutoffs, thermal limits, and scheduled contactor timers execute locally on the device and sync when connectivity returns.',
            },
            {
              q: 'Is it compatible with rooftop solar net-metering?',
              a: 'Yes. Dedicated bi-directional CT channels track both solar inverter generation and utility grid import/export in real time, calculating your exact solar self-sufficiency.',
            },
          ].map((item) => (
            <div
              key={item.q}
              className="p-5 rounded-2xl border border-(--color-border) bg-(--color-surface) space-y-2"
            >
              <div className="flex items-start gap-2.5">
                <HelpCircle size={16} className="text-(--color-accent) shrink-0 mt-0.5" />
                <h3 className="text-sm font-bold text-(--color-text)">{item.q}</h3>
              </div>
              <p className="text-xs text-(--color-text-secondary) leading-relaxed pl-6">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          8. CONTACT & DEPLOYMENT CONSULTATION (#contact)
      ===================================================================== */}
      <section id="contact" className="scroll-mt-20">
        <Surface variant="primary" padding="lg" className="border border-(--color-border)">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-(--color-accent) font-bold">
                Contact &amp; Commissioning
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight text-(--color-text)">
                Request a Site Assessment or Hardware Quote
              </h2>
              <p className="text-xs sm:text-sm text-(--color-text-secondary) leading-relaxed">
                Have questions about sizing 5AMPERE for your home, campus, or industrial facility?
                Reach out to our field engineering team or sign up directly to configure your property online.
              </p>

              <div className="space-y-3 pt-2 text-xs text-(--color-text-secondary)">
                <div className="flex items-center gap-2.5">
                  <Mail size={15} className="text-(--color-accent)" />
                  <span>engineering@5ampere.in</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-(--color-accent)" />
                  <span>+91 (120) 456-7890 · Mon–Sat (9:00 AM – 7:00 PM IST)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} className="text-(--color-accent)" />
                  <span>Sector 62, Noida, Uttar Pradesh · Pan-India Installation Network</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {contactSubmitted ? (
                <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-3">
                  <CheckCircle2 size={28} className="text-emerald-500 mx-auto" />
                  <h3 className="text-base font-bold text-(--color-text)">
                    Inquiry Received — Thank You, {contactForm.name}!
                  </h3>
                  <p className="text-xs text-(--color-text-secondary) max-w-md mx-auto">
                    Our field engineering team has logged your request for a{' '}
                    <strong>{contactForm.propertyType}</strong> setup under{' '}
                    <strong>{contactForm.discom}</strong>. You can also create an account right now to explore the portal.
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <Link to="/signup">
                      <Button variant="primary" size="sm">
                        <span>Create Account Now</span>
                        <ArrowRight size={13} />
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setContactSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-(--color-text) mb-1">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Vikram Mehta"
                      className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-(--color-text) mb-1">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. vikram@company.in"
                      className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-property" className="block text-xs font-semibold text-(--color-text) mb-1">
                      Property Category
                    </label>
                    <select
                      id="contact-property"
                      value={contactForm.propertyType}
                      onChange={(e) => setContactForm({ ...contactForm, propertyType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    >
                      <option value="Residential Home">Residential Home (1BHK–Villa)</option>
                      <option value="School / Campus">Educational School / Campus</option>
                      <option value="Commercial Office">Commercial Office / Retail</option>
                      <option value="Industrial Facility">Industrial Plant / Factory</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-discom" className="block text-xs font-semibold text-(--color-text) mb-1">
                      State / Utility DISCOM
                    </label>
                    <input
                      id="contact-discom"
                      type="text"
                      value={contactForm.discom}
                      onChange={(e) => setContactForm({ ...contactForm, discom: e.target.value })}
                      placeholder="e.g. UPPCL, MSEDCL, BSES, BESCOM"
                      className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-msg" className="block text-xs font-semibold text-(--color-text) mb-1">
                      Project Requirements / Sanctioned Load
                    </label>
                    <textarea
                      id="contact-msg"
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us about your sanctioned load (kW) or number of distribution boards..."
                      className="w-full px-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between gap-4">
                    <span className="text-[11px] text-(--color-text-muted)">
                      Instant online setup is also available via Sign Up.
                    </span>
                    <Button type="submit" variant="primary" size="md" className="font-bold text-xs">
                      <span>Submit Inquiry</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Surface>
      </section>
    </div>
  );
}

export default HomePage;
