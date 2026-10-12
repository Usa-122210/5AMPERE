import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Sliders,
  Wrench,
  Cpu,
  User,
  MapPin,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/common/PageHeader';
import { useAuth } from '../../context/AuthContext';

export function ServiceRequestsPage() {
  const navigate = useNavigate();
  const { customerHomes, marketplaceHardware, updateHomeWorkflowStage } = useAuth();

  // Aggregate all requested devices across all homes
  const allRequests = [];
  customerHomes.forEach((home) => {
    (home.requestedDevices || []).forEach((req) => {
      allRequests.push({
        ...req,
        homeId: home.id,
        customerName: home.customerName,
        locality: home.locality,
        phone: home.phone,
        address: home.address,
      });
    });
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Service Management"
        title="Hardware &amp; Installation Service Requests"
        badge="Live Customer Queue"
        badgeColor="var(--color-accent)"
        description="Review inbound device installation and maintenance requests submitted by homeowners across your service territory."
      >
        <Link to="/technician/configure">
          <Button variant="primary" size="sm">
            <Sliders size={14} />
            <span>Open Hardware Configurator</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Requests Queue */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--color-text)]">
            Active Hardware Addition Requests ({allRequests.length})
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
            Auto-synced from Customer Portal
          </span>
        </div>

        {allRequests.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-[var(--color-border)] text-center text-xs text-[var(--color-text-muted)]">
            No pending service requests in queue.
          </div>
        ) : (
          allRequests.map((req) => {
            const hw = marketplaceHardware.find((h) => h.id === req.deviceId);

            return (
              <Surface
                key={req.requestId}
                variant="primary"
                padding="md"
                className="border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all space-y-3 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-accent)] border border-[var(--color-border)]">
                      {req.requestId}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">
                        {hw ? hw.name : req.deviceName || req.deviceId}
                      </h3>
                      <span className="text-xs text-[var(--color-text-secondary)] mt-0.5 block">
                        Customer: <strong>{req.customerName}</strong> ({req.locality})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold uppercase">
                      {req.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--color-accent)]">
                      {req.requestedDate}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--color-text-secondary)]">
                  <div>
                    <strong className="text-[var(--color-text)] block">Preferred Slot:</strong>
                    <span>{req.preferredSlot}</span>
                  </div>
                  <div>
                    <strong className="text-[var(--color-text)] block">Contact Phone:</strong>
                    <span>{req.phone}</span>
                  </div>
                  <div>
                    <strong className="text-[var(--color-text)] block">Hardware Model:</strong>
                    <span className="font-mono">{hw?.model || 'Standard DIN Module'}</span>
                  </div>
                </div>

                {req.notes && (
                  <div className="p-2.5 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-secondary)]">
                    <strong className="text-[var(--color-text)]">Customer Notes: </strong>
                    <span>&ldquo;{req.notes}&rdquo;</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    Hardware Category: {hw?.category || 'Energy Monitoring'}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/technician/configure/${req.homeId}?attachDevice=${req.deviceId}`)}
                      className="text-xs font-bold"
                    >
                      <Sliders size={13} />
                      <span>Fulfill in Configurator</span>
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

export default ServiceRequestsPage;
