import { useState, useMemo } from 'react';
import {
  Activity,
  Info,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Surface } from '../ui/Surface';
import { useEnergyData } from '../../context/EnergyDataContext';
import { HOURLY_LOAD_CURVE } from '../../data/demoHouseholdData';

/**
 * EnergyUsageTrends — 24-Hour Household Electricity Profile & Diurnal Analytics.
 *
 * Provides clear, accurate SVG visualizations of Indian residential consumption:
 *   - 24-Hour hourly load profile (kW)
 *   - Solar rooftop generation overlay (optional / toggled)
 *   - Continuous vampire standby baseline reference line (95 W)
 *   - Estimated hourly energy charges in Indian Rupees (₹ / INR) based on effective slab rate
 *   - Interactive data point inspection with circuit attribution and transparent approximations
 */
export function EnergyUsageTrends() {
  const {
    activeTariff,
    periodEstimate,
    projectedMonthlyBill,
    solarEnabled,
    solarPeakKw,
    totalActiveKw,
    formatINR,
  } = useEnergyData();

  const [activeMetric, setActiveMetric] = useState('load'); // 'load' | 'solar' | 'cost'
  const [hoveredHour, setHoveredHour] = useState(20); // Default to 20:00 evening peak

  // Effective and marginal slab rates from monthly billing cycle projection
  const effectiveRate = periodEstimate?.effectiveEnergyRate || projectedMonthlyBill?.effectiveEnergyRate || activeTariff.slabs[0]?.ratePerKWh || 5.5;
  const marginalRate = projectedMonthlyBill?.marginalSlabRate || activeTariff.slabs[activeTariff.slabs.length - 1]?.ratePerKWh || 6.5;


  // Synthesize 24-hour profile with solar generation curve if solar is enabled
  const hourlyData = useMemo(() => {
    return HOURLY_LOAD_CURVE.map((point) => {
      // Solar bell-curve between 07:00 and 17:00 peaking at 12:00
      let solar = 0;
      if (solarEnabled) {
        if (point.hour >= 7 && point.hour <= 17) {
          const dist = Math.abs(point.hour - 12);
          solar = Math.max(0, Math.round((solarPeakKw * Math.cos((dist / 6) * (Math.PI / 2))) * 100) / 100);
        }
      }

      // Cost calculation based on effective slab rate
      const cost = Math.round(point.baseLoad * effectiveRate * 100) / 100;

      return {
        ...point,
        load: point.baseLoad,
        solar,
        rate: effectiveRate,
        cost,
      };
    });
  }, [effectiveRate, solarEnabled, solarPeakKw]);

  const maxVal = 4.0; // Max kW on vertical axis
  const chartHeight = 200;
  const chartWidth = 720;
  const barWidth = 20;

  // Selected hour details
  const currentDetail = hourlyData[hoveredHour] || hourlyData[20];
  const netGridKw = Math.max(0, currentDetail.load - currentDetail.solar).toFixed(2);
  const hourCost = (currentDetail.load * effectiveRate);

  return (
    <Surface variant="primary" padding="lg" className="border border-(--color-border) space-y-6">
      {/* Chart Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--color-border)">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-(--color-text)">
              24-Hour Consumption &amp; Load Profile
            </h3>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold border bg-(--color-surface-secondary) border-(--color-border) text-(--color-accent)"
            >
              1.2 kHz CT Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm mt-0.5 text-(--color-text-secondary)">
            Hover over any hour to inspect circuit attribution, effective tariff rate, and net grid flow.
          </p>
        </div>

        {/* Metric Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) self-start sm:self-auto">
          {[
            { id: 'load', label: 'Household Load (kW)' },
            { id: 'solar', label: 'Solar vs Load' },
            { id: 'cost', label: 'Hourly Cost (₹)' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMetric(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeMetric === m.id
                  ? 'bg-(--color-surface) text-(--color-text) shadow-xs font-semibold'
                  : 'text-(--color-text-secondary) hover:text-(--color-text)'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Approximation Disclaimer Banner */}
      <div className="p-2.5 rounded-lg bg-(--color-surface-secondary) border border-(--color-border) text-[11px] text-(--color-text-secondary) flex items-center gap-2">
        <Info size={14} className="text-(--color-accent) shrink-0" />
        <span>
          <strong>Billing Note:</strong> Hourly costs shown in this chart are estimated energy charges evaluated at the projected monthly billing tier ({formatINR(effectiveRate)}/kWh effective, {formatINR(marginalRate)}/kWh marginal).
          Slabs apply strictly to cumulative monthly billing cycles. Monthly fixed demand charges ({formatINR(activeTariff.fixedChargeRate)}{activeTariff.fixedChargeType === 'per_kw_per_month' ? '/kW/mo' : '/mo'}) are billed per month, not per hour.
        </span>
      </div>

      {/* SVG Chart Viewport */}
      <div className="relative pt-2 pb-4 overflow-x-auto">
        <div className="min-w-[680px]">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="w-full overflow-visible" preserveAspectRatio="none">
            <defs>
              {/* Load Bar Gradient */}
              <linearGradient id="load-bar-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.4" />
              </linearGradient>

              {/* Solar Bar Gradient */}
              <linearGradient id="solar-bar-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-warning)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--color-warning)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Grid Horizontal Guidelines */}
            {[1, 2, 3].map((kW) => {
              const y = chartHeight - (kW / maxVal) * chartHeight;
              return (
                <g key={kW}>
                  <line
                    x1="40"
                    y1={y}
                    x2={chartWidth - 10}
                    y2={y}
                    stroke="var(--color-border-subtle)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x="32"
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-(--color-text-muted) select-none"
                  >
                    {kW} kW
                  </text>
                </g>
              );
            })}

            {/* Baseline Standby Vampire Load Dashed Marker (95W = 0.095 kW) */}
            {(() => {
              const yBase = chartHeight - (0.15 / maxVal) * chartHeight;
              return (
                <g>
                  <line
                    x1="40"
                    y1={yBase}
                    x2={chartWidth - 10}
                    y2={yBase}
                    stroke="var(--color-danger)"
                    strokeWidth="1.25"
                    strokeDasharray="4 4"
                    opacity="0.65"
                  />
                  <text
                    x={chartWidth - 15}
                    y={yBase - 4}
                    textAnchor="end"
                    className="text-[9px] font-mono fill-(--color-danger) font-semibold select-none"
                  >
                    Standby Vampire Draw (95 W)
                  </text>
                </g>
              );
            })()}

            {/* Hourly Bars */}
            {hourlyData.map((d, idx) => {
              const x = 50 + idx * 27;
              const hLoad = (d.load / maxVal) * chartHeight;
              const yLoad = chartHeight - hLoad;
              const hSolar = (d.solar / maxVal) * chartHeight;
              const ySolar = chartHeight - hSolar;
              const isHovered = hoveredHour === idx;

              return (
                <g
                  key={d.hour}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredHour(idx)}
                  onClick={() => setHoveredHour(idx)}
                >
                  {/* Active Selection Glow Ring */}
                  {isHovered && (
                    <rect
                      x={x - 2}
                      y="0"
                      width={barWidth + 4}
                      height={chartHeight}
                      fill="var(--color-accent-subtle)"
                      opacity="0.4"
                      rx="4"
                    />
                  )}

                  {/* Load Bar */}
                  <rect
                    x={x}
                    y={yLoad}
                    width={barWidth}
                    height={hLoad}
                    fill={isHovered ? 'var(--color-accent)' : 'url(#load-bar-grad)'}
                    rx="3"
                    className="transition-all duration-150"
                  />

                  {/* Solar Overlay Bar (if solar metric selected or active) */}
                  {activeMetric === 'solar' && d.solar > 0 && (
                    <rect
                      x={x + 3}
                      y={ySolar}
                      width={barWidth - 6}
                      height={hSolar}
                      fill="url(#solar-bar-grad)"
                      rx="2"
                      opacity="0.9"
                    />
                  )}

                  {/* Hour Axis Label (every 3 hours) */}
                  {idx % 3 === 0 && (
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight + 18}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-(--color-text-secondary) font-medium select-none"
                    >
                      {d.time}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Interactive Detail Inspection Panel (Displays on Hover/Click) */}
      <div className="p-4 rounded-xl border bg-(--color-surface-secondary) border-(--color-border)">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-(--color-accent)">
                Selected Hour: {currentDetail.time}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-(--color-surface) border border-(--color-border) text-(--color-text)">
                {activeTariff.discom.split(' ')[0]} ({formatINR(effectiveRate)}/kWh)
              </span>
            </div>

            <p className="text-xs text-(--color-text-secondary)">
              Observed Household Load: <strong className="text-(--color-text)">{currentDetail.primary}</strong>
            </p>
          </div>

          {/* Real-time stats at selected hour */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <div>
              <p className="text-[10px] text-(--color-text-muted) uppercase">Power Draw</p>
              <p className="text-base font-extrabold text-(--color-accent)">
                {currentDetail.load.toFixed(2)} kW
              </p>
            </div>

            {solarEnabled && (
              <div>
                <p className="text-[10px] text-(--color-text-muted) uppercase">Solar Offset</p>
                <p className="text-base font-extrabold text-(--color-warning)">
                  {currentDetail.solar.toFixed(2)} kW
                </p>
              </div>
            )}

            <div>
              <p className="text-[10px] text-(--color-text-muted) uppercase">Net Grid</p>
              <p className="text-base font-extrabold text-(--color-text)">
                {netGridKw} kW
              </p>
            </div>

            <div>
              <p className="text-[10px] text-(--color-text-muted) uppercase">Est. Energy Charge</p>
              <p className="text-base font-extrabold text-(--color-text)">
                {formatINR(hourCost)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytic Insights Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="p-3 rounded-lg border bg-(--color-surface) border-(--color-border) flex items-start gap-2.5">
          <TrendingUp size={16} className="text-(--color-danger) shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-(--color-text)">Evening Peak: 2.65 kW at 20:00</span>
            <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
              Simultaneous Inverter AC cooling, TV entertainment, and kitchen activity.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg border bg-(--color-surface) border-(--color-border) flex items-start gap-2.5">
          <Activity size={16} className="text-(--color-warning) shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-(--color-text)">Morning Heating: 2.10 kW at 07:00</span>
            <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
              15L water geyser heating cycle + submersible pump filling overhead tank.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-lg border bg-(--color-surface) border-(--color-border) flex items-start gap-2.5">
          <TrendingDown size={16} className="text-(--color-success) shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-(--color-text)">Night Base: 0.28 kW at 03:00</span>
            <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
              Stable Inverter AC maintaining setpoint, refrigerator cycling, and 95W standby.
            </p>
          </div>
        </div>
      </div>
    </Surface>
  );
}
