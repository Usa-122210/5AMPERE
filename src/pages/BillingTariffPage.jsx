import {
  AlertTriangle,
  Clock,
  Coins,
  ExternalLink,
  FileText,
  Receipt,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import { Surface } from '../components/ui/Surface';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/common/PageHeader';
import { useEnergyData } from '../context/EnergyDataContext';

export function BillingTariffPage() {
  const {
    activeTariff,
    isTariffVerified,
    openTariffModal,
    contractedLoadKw,
    setContractedLoadKw,
    projectedBillingCycleKwh,
    projectedMonthlyBill,
    dailyKwh,
    weeklyKwh,
    periodEstimate,
    formatINR,
    metadata,
  } = useEnergyData();

  // Breakdown figures
  const energyCharges = projectedMonthlyBill?.energyCharge || 0;
  const fixedCharges = projectedMonthlyBill?.fixedCharge || 0;
  const duty = projectedMonthlyBill?.electricityDuty || 0;
  const totalBill = projectedMonthlyBill?.totalBill || 0;
  const effectiveRate = projectedMonthlyBill?.effectiveEnergyRate || 0;
  const marginalRate = projectedMonthlyBill?.marginalSlabRate || 0;

  // Accurately compute progressive slab allocations for visualization
  const slabBreakdowns = (activeTariff.slabs || []).map((slab, i, arr) => {
    let remaining = projectedBillingCycleKwh;
    let prev = 0;
    for (let j = 0; j < i; j++) {
      const isInfPrev = arr[j].upToUnits === Infinity || arr[j].upToUnits === null || arr[j].upToUnits === undefined;
      const upperPrev = isInfPrev ? Infinity : Number(arr[j].upToUnits);
      const capPrev = isInfPrev ? remaining : Math.max(0, upperPrev - prev);
      const unitsPrev = Math.max(0, Math.min(remaining, capPrev));
      remaining = Math.max(0, remaining - unitsPrev);
      prev = upperPrev;
    }
    const isInf = slab.upToUnits === Infinity || slab.upToUnits === null || slab.upToUnits === undefined;
    const upper = isInf ? Infinity : Number(slab.upToUnits);
    const cap = isInf ? remaining : Math.max(0, upper - prev);
    const units = Math.max(0, Math.min(remaining, cap));
    const cost = Math.round(units * slab.ratePerKWh * 100) / 100;
    return { units: Math.round(units * 10) / 10, cost };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Billing"
        title="Electricity Bill &amp; Tariff Schedule"
        badge={isTariffVerified ? 'Official Tariff Order' : 'Unverified — Demo Only'}
        badgeColor={isTariffVerified ? 'var(--color-success)' : 'var(--color-warning)'}
        description="Transparent breakdown of your electricity bill calculated using progressive consumption slabs, sanctioned demand charges, and statutory electricity duty."
      >
        <Button variant="secondary" onClick={openTariffModal}>
          <Settings2 size={16} />
          <span>Switch Utility / Edit Rates</span>
        </Button>
      </PageHeader>

      {/* 1. Official Tariff Verification Status Banner */}
      <div
        className="p-4 rounded-2xl border bg-(--color-surface) shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ borderColor: isTariffVerified ? 'var(--color-success)' : 'var(--color-warning)' }}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: isTariffVerified ? 'var(--color-success-subtle, rgba(34, 197, 94, 0.1))' : 'var(--color-warning-subtle, rgba(234, 179, 8, 0.1))',
              borderColor: isTariffVerified ? 'var(--color-success)' : 'var(--color-warning)',
            }}
          >
            {isTariffVerified ? (
              <ShieldCheck size={20} className="text-(--color-success)" />
            ) : (
              <AlertTriangle size={20} className="text-(--color-warning)" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase text-(--color-text)">
                {activeTariff.discom} · {activeTariff.consumerCategory || activeTariff.category || 'Domestic Light & Power'}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isTariffVerified
                    ? 'bg-[var(--color-success-subtle, rgba(34, 197, 94, 0.1))] text-(--color-success) border-(--color-success)'
                    : 'bg-[var(--color-warning-subtle, rgba(234, 179, 8, 0.1))] text-(--color-warning) border-(--color-warning)'
                }`}
              >
                {isTariffVerified ? 'Verified Official Order' : 'Unverified — Demo Only'}
              </span>
            </div>
            <p className="text-xs text-(--color-text-secondary) mt-1">
              Effective: {activeTariff.effectiveFrom || activeTariff.effectiveDate || 'Active Schedule'}. Fixed charges: ₹{activeTariff.fixedChargeRate || 110}/kW/month. Electricity duty: {activeTariff.electricityDutyPercent}%.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {activeTariff.sourceUrl && (
            <a
              href={activeTariff.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-(--color-accent) hover:underline"
            >
              <span>Regulatory Order</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: 30-Day Projected Bill */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-(--color-text-secondary)">30-Day Projected Bill</span>
            <Receipt size={16} className="text-(--color-accent)" />
          </div>
          <div className="text-2xl font-mono font-bold text-(--color-text)">
            {formatINR(totalBill)}
          </div>
          <div className="text-[11px] text-(--color-text-muted) font-mono">
            At {projectedBillingCycleKwh} kWh / billing cycle
          </div>
        </Surface>

        {/* Card 2: Average Effective Rate */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-(--color-text-secondary)">Effective Energy Rate</span>
            <Coins size={16} className="text-(--color-accent)" />
          </div>
          <div className="text-2xl font-mono font-bold text-(--color-accent)">
            {formatINR(effectiveRate)}
            <span className="text-xs font-normal text-(--color-text-secondary)">/kWh</span>
          </div>
          <div className="text-[11px] text-(--color-text-muted) font-mono">
            Marginal top slab: {formatINR(marginalRate)}/kWh
          </div>
        </Surface>

        {/* Card 3: Fixed Demand Charge */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-(--color-text-secondary)">Sanctioned Demand Cost</span>
            <FileText size={16} className="text-(--color-text-secondary)" />
          </div>
          <div className="text-2xl font-mono font-bold text-(--color-text)">
            {formatINR(fixedCharges)}
            <span className="text-xs font-normal text-(--color-text-secondary)">/mo</span>
          </div>
          <div className="text-[11px] text-(--color-text-muted) font-mono">
            {contractedLoadKw} kW @ ₹{activeTariff.fixedChargeRate || 110}/kW/mo
          </div>
        </Surface>

        {/* Card 4: Daily Energy Cost */}
        <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-(--color-text-secondary)">Estimated Daily Cost</span>
            <Clock size={16} className="text-(--color-accent)" />
          </div>
          <div className="text-2xl font-mono font-bold text-(--color-text)">
            {formatINR(totalBill / 30)}
            <span className="text-xs font-normal text-(--color-text-secondary)">/day</span>
          </div>
          <div className="text-[11px] text-(--color-text-muted) font-mono">
            ~{dailyKwh} kWh daily consumption
          </div>
        </Surface>
      </div>

      {/* 3. Progressive Slab Visualizer */}
      <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-6">
        <div className="border-b border-(--color-border) pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-(--color-text)">
              Progressive Consumption Slabs ({activeTariff.discom.split(' ')[0]})
            </h3>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
              UPPCL domestic tariffs charge progressively higher rates as consumption crosses tiered thresholds.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-(--color-surface-secondary) text-(--color-text-secondary) border border-(--color-border) self-start sm:self-auto">
            Total Cycle: {projectedBillingCycleKwh} kWh
          </span>
        </div>

        {/* Slabs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(activeTariff.slabs || []).map((slab, index) => {
            const slabBreakdown = slabBreakdowns[index] || { units: 0, cost: 0 };
            const isInf = slab.upToUnits === Infinity || slab.upToUnits === null || slab.upToUnits === undefined;
            const upper = isInf ? Infinity : Number(slab.upToUnits);
            const lower = Number(slab.fromUnits !== undefined ? slab.fromUnits : 0);
            const isFull = !isInf && projectedBillingCycleKwh >= upper;
            const isCurrent = projectedBillingCycleKwh > lower && (isInf || projectedBillingCycleKwh <= upper);

            return (
              <div
                key={slab.id || index}
                className={`p-4 rounded-xl border space-y-3 transition-all ${
                  isCurrent
                    ? 'bg-(--color-surface-secondary) border-(--color-accent) shadow-xs ring-1 ring-(--color-accent)'
                    : 'bg-(--color-surface) border-(--color-border)'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-(--color-text-secondary)">
                    Slab {index + 1}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isCurrent
                        ? 'bg-(--color-accent) text-white'
                        : isFull
                        ? 'bg-(--color-surface-secondary) text-(--color-text-secondary)'
                        : 'bg-(--color-surface-secondary) text-(--color-text-muted)'
                    }`}
                  >
                    {isCurrent ? 'ACTIVE TIER' : isFull ? 'FILLED' : 'UNREACHED'}
                  </span>
                </div>

                <div>
                  <div className="text-base font-mono font-bold text-(--color-text)">
                    {slab.label || (isInf ? `> ${lower} kWh` : `${lower} – ${upper} kWh`)}
                  </div>
                  <div className="text-xs font-mono text-(--color-accent) font-semibold mt-0.5">
                    {formatINR(slab.ratePerKWh)} / kWh
                  </div>
                </div>

                <div className="pt-2 border-t border-(--color-border) space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-(--color-text-secondary)">
                    <span>Units Billed:</span>
                    <span className="font-bold text-(--color-text)">{slabBreakdown.units} kWh</span>
                  </div>
                  <div className="flex items-center justify-between text-(--color-text-secondary)">
                    <span>Slab Charge:</span>
                    <span className="font-bold text-(--color-text)">{formatINR(slabBreakdown.cost)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Progress Bar of Units across slabs */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-(--color-text-secondary)">
            <span>Slab Progression (0 to 500+ kWh)</span>
            <span className="font-bold text-(--color-accent)">
              {projectedBillingCycleKwh} kWh consumed
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-(--color-surface-secondary) overflow-hidden flex border border-(--color-border)">
            {(activeTariff.slabs || []).map((slab, index) => {
              const slabBreakdown = slabBreakdowns[index] || { units: 0 };
              const percent = projectedBillingCycleKwh > 0
                ? (slabBreakdown.units / projectedBillingCycleKwh) * 100
                : 0;
              const colors = [
                'bg-(--color-accent)',
                'bg-blue-500',
                'bg-amber-500',
                'bg-rose-500',
              ];

              return (
                <div
                  key={index}
                  title={`Slab ${index + 1}: ${slabBreakdown.units} kWh`}
                  style={{ width: `${percent}%` }}
                  className={`h-full ${colors[index % colors.length]} transition-all duration-300`}
                />
              );
            })}
          </div>
        </div>
      </Surface>

      {/* 4. Itemized Monthly Bill Decomposition */}
      <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-6">
        <div className="border-b border-(--color-border) pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-(--color-text)">
              Itemized Monthly Bill Breakdown
            </h3>
            <p className="text-xs text-(--color-text-secondary) mt-0.5">
              Exact statutory formula: Bill = Energy Charges + Fixed Demand Charge + Electricity Duty ({activeTariff.electricityDutyPercent}%).
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-(--color-accent)">
            Billing Cycle: 30 Days
          </span>
        </div>

        <div className="space-y-3">
          {/* Energy Charges line */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-(--color-surface-secondary) text-xs">
            <div>
              <span className="font-bold text-(--color-text)">1. Energy Charges (Progressive Slabs)</span>
              <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
                Calculated across {(activeTariff.slabs || []).length} slabs for {projectedBillingCycleKwh} kWh
              </p>
            </div>
            <span className="font-mono font-bold text-sm text-(--color-text)">
              {formatINR(energyCharges)}
            </span>
          </div>

          {/* Fixed Demand Charge line */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-(--color-surface-secondary) text-xs">
            <div>
              <span className="font-bold text-(--color-text)">2. Fixed Demand Charge</span>
              <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
                {contractedLoadKw} kW Sanctioned Load × ₹{activeTariff.fixedChargeRate || 110}/kW/month
              </p>
            </div>
            <span className="font-mono font-bold text-sm text-(--color-text)">
              {formatINR(fixedCharges)}
            </span>
          </div>

          {/* Electricity Duty line */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-(--color-surface-secondary) text-xs">
            <div>
              <span className="font-bold text-(--color-text)">3. Statutory Electricity Duty</span>
              <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
                {activeTariff.electricityDutyPercent}% levied on Energy Charges ({formatINR(energyCharges)})
              </p>
            </div>
            <span className="font-mono font-bold text-sm text-(--color-text)">
              {formatINR(duty)}
            </span>
          </div>

          {/* Surcharges if any */}
          {activeTariff.regulatorySurchargePercent > 0 && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-(--color-surface-secondary) text-xs">
              <div>
                <span className="font-bold text-(--color-text)">4. Regulatory Surcharge</span>
                <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
                  {activeTariff.regulatorySurchargePercent}% on base energy charges
                </p>
              </div>
              <span className="font-mono font-bold text-sm text-(--color-text)">
                {formatINR((energyCharges * activeTariff.regulatorySurchargePercent) / 100)}
              </span>
            </div>
          )}

          {/* Total Payable Bill */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-(--color-accent) bg-(--color-accent-subtle) text-sm">
            <div>
              <span className="font-extrabold text-(--color-text) text-base">
                Total Estimated Monthly Bill
              </span>
              <p className="text-xs text-(--color-text-secondary) mt-0.5">
                Includes all applicable slabs, demand, and state tax
              </p>
            </div>
            <span className="font-mono font-extrabold text-2xl text-(--color-accent)">
              {formatINR(totalBill)}
            </span>
          </div>
        </div>
      </Surface>

      {/* 5. Sanctioned Load Adjustment Widget */}
      <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-4">
        <div>
          <h3 className="text-base font-bold text-(--color-text)">
            Sanctioned Load Configuration
          </h3>
          <p className="text-xs text-(--color-text-secondary) mt-0.5">
            Your connection's contracted demand with {activeTariff.discom.split(' ')[0]}. Fixed monthly charges scale directly with this capacity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-(--color-surface-secondary) border border-(--color-border)">
          <div>
            <div className="text-sm font-bold text-(--color-text)">
              Contracted Capacity: <span className="font-mono text-(--color-accent)">{contractedLoadKw} kW</span>
            </div>
            <span className="text-xs text-(--color-text-muted) mt-0.5 block">
              Fixed charge impact: {formatINR(contractedLoadKw * (activeTariff.fixedChargeRate || 110))} per month
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[2, 3, 5, 7, 10].map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setContractedLoadKw(kw)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-colors ${
                  contractedLoadKw === kw
                    ? 'bg-(--color-accent) text-white border-(--color-accent)'
                    : 'bg-(--color-surface) text-(--color-text) border-(--color-border) hover:border-(--color-accent)'
                }`}
              >
                {kw} kW
              </button>
            ))}
          </div>
        </div>
      </Surface>
    </div>
  );
}
export default BillingTariffPage;

