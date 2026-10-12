import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Wrench,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Phone,
  Cpu,
  Sliders,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

export function TechnicianOverviewPage() {
  const navigate = useNavigate();
  const { customerHomes, appointments, updateHomeWorkflowStage } = useAuth();

  // Metrics computation
  const pendingAssessments = customerHomes.filter(
    (h) => h.installationStatus === 'pending_assessment' || h.installationStatus === 'visit_scheduled'
  );
  const activeInstallations = customerHomes.filter(
    (h) => h.installationStatus === 'installation_in_progress' || h.installationStatus === 'assessment_completed'
  );
  const configuredCompleted = customerHomes.filter(
    (h) => h.installationStatus === 'configured' || h.installationStatus === 'completed' || h.installationStatus === 'active'
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Field Engineering"
        title="Technician Operations Console"
        badge="Zone: Gautam Buddha Nagar"
        badgeColor="var(--color-accent)"
        description="Monitor installation queues, field technician dispatches, site assessments, and active customer hardware deployments."
      >
        <Link to="/technician/configure">
          <Button variant="primary" size="sm">
            <Sliders size={14} />
            <span>Open Hardware Configurator</span>
          </Button>
        </Link>
      </PageHeader>

      {/* 4 Operations KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
            <span>Pending Site Visits</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[var(--color-text)]">
              {pendingAssessments.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Awaiting Assessment
            </span>
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)] block">
            Scheduled within 48 hours
          </span>
        </Surface>

        {/* KPI 2 */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
            <span>Active Installations</span>
            <Wrench size={16} className="text-[var(--color-accent)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[var(--color-text)]">
              {activeInstallations.length}
            </span>
            <span className="text-xs text-[var(--color-accent)] font-medium">
              In Progress
            </span>
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)] block">
            Panel mounting &amp; wiring
          </span>
        </Surface>

        {/* KPI 3 */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
            <span>Configured Homes</span>
            <CheckCircle2 size={16} className="text-[var(--color-success)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[var(--color-text)]">
              {configuredCompleted.length}
            </span>
            <span className="text-xs text-[var(--color-success)] font-medium">
              Active Telemetry
            </span>
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)] block">
            Calibrated against utility meter
          </span>
        </Surface>

        {/* KPI 4 */}
        <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-secondary)]">
            <span>Field Van Inventory</span>
            <Cpu size={16} className="text-[var(--color-accent)]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[var(--color-text)]">
              48
            </span>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              Certified Modules
            </span>
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)] block">
            Gateways, CTs &amp; Relays stocked
          </span>
        </Surface>
      </div>

      {/* Main Grid: Today's Appointments & Customer Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Field Appointments & Dispatches */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              <Calendar size={16} className="text-[var(--color-accent)]" />
              <span>Assigned Field Visits &amp; Commissioning Queue</span>
            </h3>
            <Link
              to="/technician/appointments"
              className="text-xs font-semibold text-[var(--color-accent)] hover:underline"
            >
              View Full Calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {appointments.map((apt) => {
              const home = customerHomes.find((h) => h.id === apt.homeId);

              return (
                <Surface
                  key={apt.id}
                  variant="primary"
                  padding="md"
                  className="border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-accent)] border border-[var(--color-border)]">
                          {apt.id}
                        </span>
                        <h4 className="text-sm font-bold text-[var(--color-text)]">
                          {apt.customerName}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                          {apt.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1.5">
                        <MapPin size={12} className="shrink-0 text-[var(--color-accent)]" />
                        <span>{apt.address}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-mono text-[var(--color-text-muted)] block">Time Window</span>
                      <span className="text-xs font-bold text-[var(--color-text)] font-mono">
                        {apt.scheduledTime}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                    <div>
                      <strong className="text-[var(--color-text)]">Task: </strong>
                      <span>{apt.type}</span>
                    </div>
                    <div>
                      <strong className="text-[var(--color-text)]">Scope: </strong>
                      <span className="text-[var(--color-text-muted)]">{apt.scope}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        <span>{apt.phone}</span>
                      </span>
                      <span>Sanction: {home?.sanctionedLoadKw || 5.0} kW</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/technician/customers?id=${apt.homeId}`)}
                        className="text-xs"
                      >
                        Profile
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/technician/configure/${apt.homeId}`)}
                        className="text-xs font-bold"
                      >
                        <Sliders size={13} />
                        <span>Configure Setup</span>
                      </Button>
                    </div>
                  </div>
                </Surface>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Customer Search Snippet */}
        <div className="space-y-4">
          <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <Users size={16} className="text-[var(--color-accent)]" />
                <span>Recent Customer Properties</span>
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Quick access to customer electrical panels
              </p>
            </div>

            <div className="space-y-2">
              {customerHomes.slice(0, 4).map((home) => (
                <div
                  key={home.id}
                  onClick={() => navigate(`/technician/configure/${home.id}`)}
                  className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--color-accent)] cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text)]">
                      {home.customerName}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        home.installationStatus === 'active' || home.installationStatus === 'completed'
                          ? 'bg-green-500/10 text-green-700 dark:text-green-300'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {home.installationStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] truncate">
                    {home.locality} · {home.sanctionedLoadKw} kW
                  </div>
                </div>
              ))}
            </div>

            <Link to="/technician/customers" className="block text-center">
              <Button variant="secondary" size="sm" className="w-full text-xs">
                <span>View All Customers ({customerHomes.length})</span>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </Surface>

          {/* Van Tooling & Calibration Checklist */}
          <Surface variant="primary" padding="md" className="border border-[var(--color-border)] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[var(--color-success)]" />
              <span>Technician Field Protocol</span>
            </h4>
            <ul className="text-xs text-[var(--color-text-secondary)] space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
                <span>Always verify incoming voltage with calibrated digital multimeter (230V ± 6%).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
                <span>Align CT clamp arrow in the direction of power flow (Source → Load).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1.5 shrink-0" />
                <span>Pair EdgeCore gateway with customer 2.4GHz Wi-Fi before closing DB door.</span>
              </li>
            </ul>
          </Surface>
        </div>
      </div>
    </div>
  );
}

export default TechnicianOverviewPage;
