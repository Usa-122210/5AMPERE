import { useState } from 'react';
import {
  AlertCircle,
  Check,
  ExternalLink,
  Info,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { useEnergyData } from '../../context/EnergyDataContext';
import { Button } from '../ui/Button';

/**
 * TariffConfigModal — User Electricity Tariff & DISCOM Selection.
 *
 * Fully compliant with Indian regulatory structures:
 *   - Select State & DISCOM (Official UPPCL verified rates + state presets)
 *   - Consumer Category (LMV-1 Domestic Urban Metered)
 *   - Slabs breakdown table with transparent rate per kWh (₹)
 *   - Fixed charge per kW sanctioned load and Electricity Duty percentage
 *   - Direct link to official state regulatory / DISCOM tariff order portal
 *   - Editable custom tariff mode for manual bill tuning
 */
export function TariffConfigModal({ isOpen, onClose }) {
  const {
    tariffs,
    selectedTariffId,
    setSelectedTariffId,
    customTariff,
    updateCustomTariff,
    activeTariff,
    contractedLoadKw,
    setContractedLoadKw,
    formatINR,
  } = useEnergyData();

  const [activeTab, setActiveTab] = useState('select'); // 'select' | 'custom'
  const [editableCustom, setEditableCustom] = useState(customTariff);

  if (!isOpen) return null;

  const handleSelectTariff = (id) => {
    setSelectedTariffId(id);
    if (id === 'custom') {
      setActiveTab('custom');
    }
  };

  const handleSaveCustom = () => {
    updateCustomTariff(editableCustom);
    setSelectedTariffId('custom');
  };

  const handleSlabChange = (index, field, value) => {
    const updatedSlabs = [...editableCustom.slabs];
    updatedSlabs[index] = {
      ...updatedSlabs[index],
      [field]: field === 'ratePerKWh' ? parseFloat(value) || 0 : value === '' ? Infinity : parseFloat(value) || 0,
    };
    setEditableCustom({ ...editableCustom, slabs: updatedSlabs });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tariff-modal-title"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-xl bg-(--color-surface) border-(--color-border) p-5 sm:p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-(--color-border)">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-accent-subtle)' }}
              >
                <Zap size={18} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 id="tariff-modal-title" className="text-lg font-bold tracking-tight text-(--color-text)">
                Electricity Tariff &amp; DISCOM Settings
              </h2>
            </div>
            <p className="text-xs text-(--color-text-secondary)">
              Cost calculations are derived directly from the selected regulatory tariff schedule.
              Do not use a fixed arbitrary rate across Indian households.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-(--color-text-muted) hover:text-(--color-text) hover:bg-(--color-surface-secondary) transition-colors cursor-pointer"
            aria-label="Close tariff dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-(--color-surface-secondary) border border-(--color-border)">
          <button
            type="button"
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'select'
                ? 'bg-(--color-surface) text-(--color-text) shadow-xs'
                : 'text-(--color-text-secondary) hover:text-(--color-text)'
            }`}
          >
            Select State &amp; Utility Schedule
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-(--color-surface) text-(--color-text) shadow-xs'
                : 'text-(--color-text-secondary) hover:text-(--color-text)'
            }`}
          >
            Custom Tariff Editor
          </button>
        </div>

        {activeTab === 'select' ? (
          <div className="space-y-5">
            {/* Tariff Preset Radio Cards */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary)">
                Available State Distribution Utilities (DISCOMs)
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {Object.values(tariffs).map((tariff) => {
                  const isSelected = selectedTariffId === tariff.id;

                  return (
                    <div
                      key={tariff.id}
                      onClick={() => handleSelectTariff(tariff.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-(--color-surface-selected) border-(--color-accent) shadow-xs ring-1 ring-(--color-accent)'
                          : 'bg-(--color-surface) border-(--color-border) hover:border-(--color-text-secondary)'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-(--color-text)">
                            {tariff.name}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                              tariff.verified
                                ? 'bg-(--color-accent-subtle) text-(--color-accent) border-(--color-accent)'
                                : 'bg-(--color-warning-subtle) text-(--color-warning) border-(--color-warning)'
                            }`}
                          >
                            {tariff.verificationBadge}
                          </span>
                        </div>

                        <p className="text-xs text-(--color-text-secondary)">
                          {tariff.state} · {tariff.consumerCategory}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
                        <div className="text-right">
                          <span className="text-[11px] text-(--color-text-muted) block">Initial Slab</span>
                          <span className="font-bold text-(--color-accent)">
                            {formatINR(tariff.slabs[0].ratePerKWh)}/kWh
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-(--color-accent) border-(--color-accent) text-(--color-accent-text)'
                              : 'border-(--color-border)'
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Status Banner */}
            {!activeTariff.verified ? (
              <div className="p-3 rounded-xl bg-(--color-warning-subtle) border border-(--color-warning) text-xs text-(--color-warning) flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Unverified Tariff Schedule — Demo Only</strong>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    {activeTariff.verificationNotice} Calculations for {activeTariff.state} are indicative estimates and not verified against current official tariff orders. For an accurate bill, select UPPCL or configure your exact slab rates in the Custom Tariff Editor.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-(--color-accent-subtle) border border-(--color-accent) text-xs text-(--color-accent) flex items-start gap-2.5">
                <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Official Verified Tariff Schedule</strong>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    {activeTariff.verificationNotice} ({activeTariff.effectiveFrom}). Slabs apply strictly to cumulative consumption per monthly billing cycle.
                  </p>
                </div>
              </div>
            )}

            {/* Contracted Sanctioned Load Input */}
            <div className="p-3.5 rounded-xl border bg-(--color-surface-secondary) border-(--color-border) flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-(--color-text) block">
                  Sanctioned / Contracted Load (kW)
                </span>
                <span className="text-[11px] text-(--color-text-secondary)">
                  Used to compute monthly fixed demand charges ({formatINR(activeTariff.fixedChargeRate)}
                  {activeTariff.fixedChargeType === 'per_kw_per_month' ? '/kW/mo' : '/mo'})
                </span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.5"
                  value={contractedLoadKw}
                  onChange={(e) => setContractedLoadKw(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-20 px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold text-center bg-(--color-surface) border-(--color-border) text-(--color-text)"
                />
                <span className="text-xs font-mono font-semibold text-(--color-text-secondary)">kW</span>
              </div>
            </div>

            {/* Selected Tariff Schedule Deep Breakdown */}
            <div className="p-4 rounded-xl border bg-(--color-surface) border-(--color-border) space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-(--color-border-subtle)">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-(--color-text)">
                    Active Schedule: {activeTariff.name}
                  </h4>
                  <p className="text-[11px] text-(--color-text-muted) mt-0.5">
                    {activeTariff.notes}
                  </p>
                </div>

                {activeTariff.sourceUrl && (
                  <a
                    href={activeTariff.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-semibold text-(--color-accent) hover:underline shrink-0"
                  >
                    <span>Official Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Slabs Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-(--color-border-subtle) text-(--color-text-muted) text-[10px] uppercase">
                      <th className="py-1.5">Consumption Slab</th>
                      <th className="py-1.5">Unit Range (kWh)</th>
                      <th className="py-1.5 text-right">Energy Charge (₹/kWh)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--color-border-subtle)">
                    {activeTariff.slabs.map((slab, i) => (
                      <tr key={slab.id || i} className="text-(--color-text)">
                        <td className="py-1.5 font-sans font-medium text-(--color-text-secondary)">
                          Slab {i + 1}
                        </td>
                        <td className="py-1.5">
                          {slab.upToUnits === Infinity || slab.upToUnits === null
                            ? `> ${slab.fromUnits || activeTariff.slabs[i - 1]?.upToUnits || 300} units`
                            : `${slab.fromUnits || (i === 0 ? 0 : activeTariff.slabs[i - 1]?.upToUnits + 1)} – ${slab.upToUnits} units`}
                        </td>
                        <td className="py-1.5 text-right font-bold text-(--color-accent)">
                          {formatINR(slab.ratePerKWh)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Fixed & Duty Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-(--color-text-secondary)">
                <span className="px-2 py-0.5 rounded bg-(--color-surface-secondary) border border-(--color-border)">
                  Fixed Demand: <strong className="text-(--color-text)">{formatINR(activeTariff.fixedChargeRate)}</strong>
                  {activeTariff.fixedChargeType === 'per_kw_per_month' ? '/kW/mo' : '/mo'}
                </span>
                <span className="px-2 py-0.5 rounded bg-(--color-surface-secondary) border border-(--color-border)">
                  Electricity Duty: <strong className="text-(--color-text)">{activeTariff.electricityDutyPercent}%</strong> of energy charge
                </span>
                <span className="px-2 py-0.5 rounded bg-(--color-surface-secondary) border border-(--color-border)">
                  Effective Schedule: <strong className="text-(--color-text)">{activeTariff.effectiveFrom}</strong>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Custom Tariff Editor */
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) text-xs text-(--color-text-secondary) flex items-start gap-2">
              <Info size={16} className="text-(--color-accent) shrink-0 mt-0.5" />
              <span>
                Enter your exact utility slab rates from your physical electricity bill.
                All calculations in 5AMPERE will adapt to these values immediately.
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-(--color-text-secondary)">
                Progressive Slabs
              </label>

              {editableCustom.slabs.map((slab, idx) => (
                <div key={slab.id || idx} className="p-3 rounded-lg border bg-(--color-surface) border-(--color-border) flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-(--color-text) w-16">
                    Slab {idx + 1}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-(--color-text-muted) font-mono text-[11px]">Up to kWh:</span>
                    <input
                      type="number"
                      placeholder="Infinity"
                      value={slab.upToUnits === Infinity ? '' : slab.upToUnits}
                      onChange={(e) => handleSlabChange(idx, 'upToUnits', e.target.value)}
                      className="w-20 px-2 py-1 rounded border font-mono text-center bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-(--color-text-muted) font-mono text-[11px]">Rate (₹):</span>
                    <input
                      type="number"
                      step="0.1"
                      value={slab.ratePerKWh}
                      onChange={(e) => handleSlabChange(idx, 'ratePerKWh', e.target.value)}
                      className="w-20 px-2 py-1 rounded border font-mono font-bold text-center bg-(--color-surface-secondary) border-(--color-border) text-(--color-accent)"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-(--color-text-secondary)">
                  Fixed Charge Rate (₹/kW/month)
                </label>
                <input
                  type="number"
                  value={editableCustom.fixedChargeRate}
                  onChange={(e) =>
                    setEditableCustom({ ...editableCustom, fixedChargeRate: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-lg border font-mono bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-(--color-text-secondary)">
                  Electricity Duty (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={editableCustom.electricityDutyPercent}
                  onChange={(e) =>
                    setEditableCustom({ ...editableCustom, electricityDutyPercent: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-lg border font-mono bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="sm" onClick={handleSaveCustom}>
                <Check size={14} />
                <span>Apply Custom Tariff</span>
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-(--color-border) flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-(--color-text-muted) font-mono">
            <ShieldCheck size={14} className="text-(--color-success)" />
            <span>State: {activeTariff.state}</span>
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

