import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Check,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

const WORKFLOW_STAGES = [
  {
    key: 'visit_scheduled',
    label: 'Visit Scheduled',
    desc: 'Slot confirmed. Lead technician assigned and en route with hardware package.',
  },
  {
    key: 'assessment_completed',
    label: 'Site Assessment',
    desc: 'Panel space, sanction load kW, phase balance, and neutral earthing verified.',
  },
  {
    key: 'installation_in_progress',
    label: 'Hardware Installation',
    desc: 'Split-core CT clamps and DIN contactors mounted in distribution board.',
  },
  {
    key: 'configured',
    label: 'Gateway Configuration',
    desc: 'Wi-Fi mesh linked, True RMS calibration against utility DISCOM meter.',
  },
  {
    key: 'completed',
    label: 'Completed & Active',
    desc: 'Panel closed, safety seals verified, live telemetry stream active.',
  },
];

export function InstallationSupportPage() {
  const { activeCustomerHome, appointments } = useAuth();

  // Find active appointment or request for this home
  const activeAppointment = appointments.find((a) => a.homeId === activeCustomerHome?.id) || appointments[0];
  const homeStatus = activeCustomerHome?.installationStatus || 'active';

  // Map home status to stage index
  const stageIndexMap = {
    pending_assessment: 0,
    visit_scheduled: 0,
    assessment_completed: 1,
    installation_in_progress: 2,
    configured: 3,
    completed: 4,
    active: 4,
  };
  const currentStageIndex = stageIndexMap[homeStatus] ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Service & Support"
        title="Installation &amp; Field Support Tracker"
        badge={homeStatus === 'active' || homeStatus === 'completed' ? 'System Fully Operational' : 'Technician Visit in Progress'}
        badgeColor={homeStatus === 'active' || homeStatus === 'completed' ? 'var(--color-success)' : 'var(--color-warning)'}
        description="Track the status of certified 5AMPERE technician visits, electrical distribution board assessments, and hardware commissioning."
      >
        <Link to="/devices">
          <Button variant="secondary" size="sm">
            <span>Browse Device Catalogue</span>
            <ArrowRight size={14} />
          </Button>
        </Link>
      </PageHeader>

      {/* Main Status Hero Card */}
      <Surface variant="primary" padding="lg" className="border border-(--color-border) shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-(--color-border) pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-(--color-surface-secondary) text-(--color-accent) border border-(--color-border)">
              Installation Ticket #{activeAppointment ? activeAppointment.id : '5AMP-SR-1029'}
            </span>
            <h2 className="text-lg font-bold text-(--color-text) mt-1.5">
              {activeAppointment ? activeAppointment.type : '5AMPERE EdgeCore Gateway Installation'}
            </h2>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
              Property: <strong className="text-(--color-text)">{activeCustomerHome?.address || 'Noida Home'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono text-(--color-text-muted) block">Scheduled Window</span>
              <span className="text-xs font-bold text-(--color-accent) font-mono">
                {activeAppointment ? activeAppointment.scheduledTime : 'Tomorrow, 10:00 AM – 01:00 PM'}
              </span>
            </div>
            <span className="w-3 h-3 rounded-full bg-(--color-warning) animate-ping hidden md:block" />
          </div>
        </div>

        {/* 5-Step Workflow Progress Bar */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary)">
            5-Stage Commissioning Lifecycle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {WORKFLOW_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isUpcoming = idx > currentStageIndex;

              return (
                <div
                  key={stage.key}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent) shadow-xs'
                      : isPast
                      ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300'
                      : 'bg-(--color-surface) border-(--color-border) text-(--color-text-muted) opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold">
                      0{idx + 1}
                    </span>
                    {isPast ? (
                      <CheckCircle2 size={15} className="text-green-600 dark:text-green-400" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-(--color-accent) animate-pulse" />
                    ) : (
                      <Clock size={13} />
                    )}
                  </div>
                  <h4 className="text-xs font-bold block truncate">
                    {stage.label}
                  </h4>
                  <p className="text-[10px] mt-1 line-clamp-2 leading-relaxed opacity-90">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Technician Card & Site Scope */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Technician Profile Card */}
          <div className="p-4 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-(--color-text-muted) font-bold block">
              Assigned Lead Technician
            </span>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-(--color-accent) text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                RK
              </div>
              <div className="truncate">
                <h4 className="text-sm font-bold text-(--color-text)">
                  Rajesh Kumar
                </h4>
                <span className="text-xs text-(--color-text-secondary) block">
                  Senior Field Energy Specialist · ID: 5AMP-TECH-042
                </span>
                <span className="text-[10px] text-(--color-accent) font-semibold block mt-0.5">
                  CEA Certified Smart Grid Wireman
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-(--color-border-subtle) flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-(--color-text-secondary)">
                <Phone size={13} className="text-(--color-accent)" />
                <span>+91 98112 34567</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-700 dark:text-green-300 font-bold">
                Verified Technician
              </span>
            </div>
          </div>

          {/* Site Scope & Scope of Work */}
          <div className="p-4 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) space-y-2 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-(--color-text-muted) font-bold block">
              Scope of Visit &amp; Deliverables
            </span>
            <ul className="space-y-1.5 text-(--color-text-secondary)">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-(--color-accent) shrink-0 mt-0.5" />
                <span>Physical survey of Main Distribution Board &amp; 35mm DIN-rail capacity.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-(--color-accent) shrink-0 mt-0.5" />
                <span>Installation of 5AMPERE EdgeCore gateway &amp; non-invasive 100A CT clamps.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-(--color-accent) shrink-0 mt-0.5" />
                <span>True RMS telemetry calibration against official DISCOM meter standard.</span>
              </li>
            </ul>
          </div>
        </div>
      </Surface>

      {/* Pre-Installation Homeowner Checklist */}
      <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-4">
        <div>
          <h3 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
            <ShieldCheck size={18} className="text-(--color-accent)" />
            <span>Pre-Installation Preparation Checklist</span>
          </h3>
          <p className="text-xs text-(--color-text-secondary) mt-1">
            Please verify the following three items before the technician arrives to guarantee a quick and smooth 20-minute commissioning:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border bg-(--color-surface-secondary) border-(--color-border) space-y-2">
            <div className="w-7 h-7 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-center text-xs font-mono font-bold text-(--color-accent)">
              1
            </div>
            <h4 className="text-xs font-bold text-(--color-text)">
              Clear Access to MCB Board
            </h4>
            <p className="text-[11px] text-(--color-text-secondary) leading-relaxed">
              Ensure shoes cabinets, curtains, or wall hangings are cleared away from the main breaker box.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border bg-(--color-surface-secondary) border-(--color-border) space-y-2">
            <div className="w-7 h-7 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-center text-xs font-mono font-bold text-(--color-accent)">
              2
            </div>
            <h4 className="text-xs font-bold text-(--color-text)">
              Wi-Fi Credentials Ready
            </h4>
            <p className="text-[11px] text-(--color-text-secondary) leading-relaxed">
              Have your home 2.4GHz Wi-Fi SSID and password available so the EdgeCore gateway can link to the cloud.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border bg-(--color-surface-secondary) border-(--color-border) space-y-2">
            <div className="w-7 h-7 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-center text-xs font-mono font-bold text-(--color-accent)">
              3
            </div>
            <h4 className="text-xs font-bold text-(--color-text)">
              15-Min Power Interruption
            </h4>
            <p className="text-[11px] text-(--color-text-secondary) leading-relaxed">
              Main incomer power will be switched off for approximately 10 to 15 minutes during DIN module mounting.
            </p>
          </div>
        </div>
      </Surface>

      {/* Emergency Hotline & Help */}
      <div className="p-4 rounded-xl border bg-(--color-surface-secondary) border-(--color-border) flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle size={20} className="text-(--color-accent) shrink-0" />
          <div>
            <span className="font-bold text-(--color-text) block">
              Need to reschedule or speak with the operations dispatcher?
            </span>
            <span className="text-(--color-text-secondary)">
              5AMPERE Support Hotline: 1800-5AMP-ENERGY (9 AM – 7 PM, Mon–Sat) · support@5ampere.com
            </span>
          </div>
        </div>

        <a
          href="tel:+919811234567"
          className="px-3 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-(--color-text) font-semibold hover:border-(--color-accent) shrink-0 inline-flex items-center gap-1.5"
        >
          <Phone size={13} />
          <span>Call Dispatcher</span>
        </a>
      </div>
    </div>
  );
}

export default InstallationSupportPage;

