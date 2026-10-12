import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Wrench,
  CheckCircle2,
  Sliders,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

export function AppointmentsPage() {
  const navigate = useNavigate();
  const { appointments, customerHomes, updateHomeWorkflowStage } = useAuth();

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredAppointments = appointments.filter((apt) => {
    if (activeFilter === 'pending') {
      return apt.status === 'visit_scheduled' || apt.status === 'pending_assessment';
    }
    if (activeFilter === 'in_progress') {
      return apt.status === 'installation_in_progress' || apt.status === 'assessment_completed';
    }
    if (activeFilter === 'completed') {
      return apt.status === 'configured' || apt.status === 'completed';
    }
    return true;
  });

  const handleAdvanceStage = (homeId, currentStatus) => {
    let nextStage = 'assessment_completed';
    if (currentStatus === 'visit_scheduled' || currentStatus === 'pending_assessment') {
      nextStage = 'assessment_completed';
    } else if (currentStatus === 'assessment_completed') {
      nextStage = 'installation_in_progress';
    } else if (currentStatus === 'installation_in_progress') {
      nextStage = 'configured';
    } else if (currentStatus === 'configured') {
      nextStage = 'completed';
    }
    updateHomeWorkflowStage(homeId, nextStage, `Stage advanced to ${nextStage} by field technician.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Field Scheduling"
        title="Field Appointments &amp; Dispatch Calendar"
        badge="Zone Roster"
        badgeColor="var(--color-accent)"
        description="Schedule on-site customer visits, manage panel installation timeslots, and advance electrical commissioning stages."
      >
        <Link to="/technician/configure">
          <Button variant="primary" size="sm">
            <Sliders size={14} />
            <span>Open Hardware Configurator</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
        {[
          { id: 'all', label: `All Appointments (${appointments.length})` },
          { id: 'pending', label: 'Scheduled / Pending' },
          { id: 'in_progress', label: 'Active on Site' },
          { id: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[var(--color-surface-selected)] text-[var(--color-accent)] border border-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3.5">
        {filteredAppointments.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
            No appointments match this filter.
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const home = customerHomes.find((h) => h.id === apt.homeId);

            return (
              <Surface
                key={apt.id}
                variant="primary"
                padding="md"
                className="border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-accent)] border border-[var(--color-border)]">
                      {apt.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">
                        {apt.customerName}
                      </h3>
                      <span className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-[var(--color-accent)] shrink-0" />
                        <span>{apt.address}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        apt.status === 'completed' || apt.status === 'configured'
                          ? 'bg-green-500/10 text-green-700 dark:text-green-300'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {apt.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--color-text)] px-2.5 py-1 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                      {apt.scheduledTime}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--color-text-secondary)]">
                  <div>
                    <strong className="text-[var(--color-text)] block">Appointment Type:</strong>
                    <span>{apt.type}</span>
                  </div>
                  <div>
                    <strong className="text-[var(--color-text)] block">Customer Phone:</strong>
                    <span>{apt.phone}</span>
                  </div>
                  <div>
                    <strong className="text-[var(--color-text)] block">Sanction Load:</strong>
                    <span>{home?.sanctionedLoadKw || 5.0} kW ({home?.discom?.split(' ')[0] || 'UPPCL'})</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
                  <strong className="text-[var(--color-text)]">Work Scope: </strong>
                  <span>{apt.scope}</span>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      Current Stage: <strong className="text-[var(--color-accent)] uppercase">{apt.status.replace('_', ' ')}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAdvanceStage(apt.homeId, apt.status)}
                      className="text-xs font-semibold"
                    >
                      <Check size={13} />
                      <span>Advance Stage →</span>
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
          })
        )}
      </div>
    </div>
  );
}

export default AppointmentsPage;

