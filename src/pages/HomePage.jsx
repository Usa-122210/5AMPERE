import { Link, useOutletContext } from 'react-router-dom';
import { Cpu, LogIn, UserPlus, LayoutDashboard, ArrowRight, ShieldCheck, Code2 } from 'lucide-react';
import { EnergyOverview } from '../components/dashboard/EnergyOverview';
import { EnergyUsageTrends } from '../components/dashboard/EnergyUsageTrends';
import { HouseholdLoads } from '../components/dashboard/HouseholdLoads';
import { EnergyInsights } from '../components/dashboard/EnergyInsights';
import { ProductVisualization } from '../components/home/ProductVisualization';
import { Footer } from '../components/home/Footer';
import { useAuth } from '../context/AuthContext';

/**
 * HomePage — 5AMPERE Smart Energy Management Platform Application.
 *
 * Public homepage accessible to all visitors without logging in, featuring:
 *   1. Public Platform Banner & Quick Role Access
 *   2. Hardware Sub-Panel Status Banner (Local edge telemetry, DIN-rail status)
 *   3. Energy Overview (Live kW/A draw, daily kWh, tariff cost, solar self-consumption)
 *   4. Energy Usage Trends (Interactive 24-hour profile chart with tariff shading)
 *   5. Household Loads & Circuit Relays (Contactor switching, sheddable loads)
 *   6. System Topology & Flow (Physical CT sensing to digital telemetry pipeline)
 *   7. Actionable Insights & Automations (Standby vampire cutoffs, tariff shifts)
 *   8. Technical Platform Footer
 */
export function HomePage() {
  const context = useOutletContext();
  const openSizing = context?.openSizing;
  const { currentUser } = useAuth();

  const dashboardRoute =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'developer' || currentUser?.role === 'technician'
      ? '/developer'
      : '/dashboard';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 0. Public Platform Welcome & Role Entry Banner */}
      <div className="p-5 rounded-2xl border bg-(--color-surface) border-(--color-border) shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-(--color-accent-subtle) text-(--color-accent) border border-(--color-accent)/25">
              5AMPERE Smart Energy Platform
            </span>
            <span className="text-xs font-mono text-(--color-text-muted)">
              Public Interactive Showcase · No Login Required to Explore
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-(--color-text)">
            Panel-Level Telemetry, Indian Tariff Intelligence & Circuit Automation
          </h1>
          <p className="text-xs text-(--color-text-secondary) max-w-3xl">
            Explore live interactive telemetry below, or sign in as a <strong>User</strong>, <strong>Developer</strong>, or <strong>Admin</strong> to configure property setups, manage hardware catalogues, and track installations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {currentUser ? (
            <Link
              to={dashboardRoute}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-(--color-accent) text-(--color-accent-contrast) hover:opacity-95 transition-all shadow-xs"
            >
              {currentUser.role === 'admin' ? (
                <ShieldCheck size={15} />
              ) : currentUser.role === 'developer' || currentUser.role === 'technician' ? (
                <Code2 size={15} />
              ) : (
                <LayoutDashboard size={15} />
              )}
              <span>
                Open {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'developer' || currentUser.role === 'technician' ? 'Developer' : 'User'} Dashboard
              </span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-(--color-border) bg-(--color-surface-secondary) text-(--color-text) hover:border-(--color-accent) transition-all"
              >
                <LayoutDashboard size={14} className="text-(--color-accent)" />
                <span>User Setup & Dashboard</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-accent) transition-all"
              >
                <LogIn size={14} className="text-(--color-accent)" />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-(--color-accent) text-(--color-accent-contrast) hover:opacity-95 transition-all shadow-xs"
              >
                <UserPlus size={14} />
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 1. Hardware Workspace Status Bar */}
      <div className="p-4 rounded-2xl border bg-(--color-surface) border-(--color-border) shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: 'var(--color-accent-subtle)',
              borderColor: 'var(--color-accent)',
            }}
          >
            <Cpu size={20} style={{ color: 'var(--color-accent)' }} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-(--color-text)">
                Panel Unit #01 · Main Breaker Enclosure
              </span>
              <span className="w-2 h-2 rounded-full bg-(--color-success) animate-pulse" />
              <span className="text-[10px] font-mono text-(--color-success) font-semibold uppercase">
                Online Telemetry
              </span>
            </div>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
              DIN 35mm Mount · 230V AC Single-Phase · 6 Split-Core CT Sensors Active · Local MQTT Stream
            </p>
          </div>
        </div>

        {/* Quick status indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono self-start md:self-auto">
          <div className="px-2.5 py-1 rounded-lg bg-(--color-surface-secondary) border border-(--color-border) text-(--color-text-secondary)">
            Sampling: <strong className="text-(--color-text)">1.2 kHz True-RMS</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-(--color-surface-secondary) border border-(--color-border) text-(--color-text-secondary)">
            Service: <strong className="text-(--color-accent)">50A Main Rating</strong>
          </div>
        </div>
      </div>

      {/* 2. Executive Energy Overview (Real-time kW, kWh, Cost, Solar) */}
      <section id="overview" className="space-y-4">
        <EnergyOverview />
      </section>

      {/* 3. 24-Hour Energy Usage Trends Chart */}
      <section id="usage-trends" className="space-y-4">
        <EnergyUsageTrends />
      </section>

      {/* 4. Household Loads & Sub-Circuit Contactor Relays */}
      <section id="loads" className="space-y-4">
        <HouseholdLoads />
      </section>

      {/* 5. Physical-to-Digital System Topology & Energy Conduit Flow */}
      <section id="topology" className="space-y-4">
        <ProductVisualization />
      </section>

      {/* 6. Actionable Energy Insights & Automations */}
      <section id="insights" className="space-y-4">
        <EnergyInsights />
      </section>

      {/* 7. Platform Specifications & Footer */}
      <Footer onOpenSizing={openSizing} />
    </div>
  );
}

export default HomePage;
