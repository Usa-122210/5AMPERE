/**
 * 5AMPERE — Energy Math & Indian Tariff Calculation Utilities
 *
 * Strict, pure utility functions for electrical unit conversion,
 * Indian currency formatting (INR / ₹), progressive slab billing,
 * billing-cycle projections, and explainable savings calculations.
 *
 * Regulatory & Billing Principles:
 *   1. Indian DISCOM tariffs (e.g. UPPCL LMV-1) define consumption slabs
 *      strictly for cumulative units across a billing cycle (typically 30 days).
 *   2. Slabs MUST NEVER be applied directly to a 1-day or 7-day unit total as
 *      if that total represented a full monthly bill.
 *   3. Sub-period costs (daily, weekly, hourly) are estimates derived from the
 *      household's projected billing-cycle consumption tier.
 *   4. Fixed demand charges (₹/kW/month) are billed monthly and must not be
 *      confused with marginal hourly or daily energy consumption charges.
 */

/**
 * Standard Indian Rupee (INR) currency formatter.
 * Formats according to Indian numbering standards (e.g. ₹1,250.50, ₹14,500.00).
 *
 * @param {number} amount - Numerical currency value in INR.
 * @returns {string} Formatted string with ₹ symbol and commas.
 */
export const formatINR = (amount) => {
  if (!Number.isFinite(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Converts electrical Power (W) and operating duration (hours) to Energy (kWh).
 * Formula: Energy (kWh) = Power (W) × Time (hours) / 1000
 *
 * Validates inputs strictly: returns null for invalid, negative, or non-finite inputs
 * to prevent silent error masking.
 *
 * @param {number} watts - Power in Watts. Must be >= 0.
 * @param {number} hours - Time duration in hours. Must be >= 0.
 * @returns {number|null} Energy in kWh, or null if input is invalid.
 */
export function wattsToKWh(watts, hours) {
  if (
    !Number.isFinite(watts) ||
    !Number.isFinite(hours) ||
    watts < 0 ||
    hours < 0
  ) {
    return null;
  }

  return (watts * hours) / 1000;
}

/**
 * Calculates progressive energy charges across tiered slabs for cumulative units.
 * Supports open-ended final slabs (upToUnits = Infinity or null).
 *
 * @param {number} units - Energy consumed in kWh.
 * @param {Array<{upToUnits: number|null, ratePerKWh: number}>} slabs - Tiered pricing slabs.
 * @returns {number} Energy charge in INR.
 */
export function calculateSlabCharge(units, slabs) {
  if (!Number.isFinite(units) || units <= 0 || !Array.isArray(slabs) || slabs.length === 0) {
    return 0;
  }

  let remaining = units;
  let previousLimit = 0;
  let total = 0;

  for (const slab of slabs) {
    const isInfinity =
      slab.upToUnits === null ||
      slab.upToUnits === undefined ||
      slab.upToUnits === Infinity;

    const upperLimit = isInfinity ? Infinity : Number(slab.upToUnits);
    const rate = Number(slab.ratePerKWh);

    if (!Number.isFinite(rate) || rate < 0) {
      continue;
    }

    const slabCapacity = isInfinity ? remaining : Math.max(0, upperLimit - previousLimit);
    const unitsInSlab = Math.max(0, Math.min(remaining, slabCapacity));

    total += unitsInSlab * rate;
    remaining -= unitsInSlab;
    previousLimit = upperLimit;

    if (remaining <= 0) break;
  }

  return Math.round(total * 100) / 100;
}

/**
 * Finds the marginal rate per kWh for the highest active slab reached by a given consumption.
 *
 * @param {number} units - Cumulative billing cycle units.
 * @param {Array<{upToUnits: number|null, ratePerKWh: number}>} slabs - Pricing slabs.
 * @returns {number} Marginal rate in INR/kWh.
 */
export function getMarginalSlabRate(units, slabs) {
  if (!Array.isArray(slabs) || slabs.length === 0) return 0;
  if (!Number.isFinite(units) || units <= 0) return slabs[0]?.ratePerKWh || 0;

  let previousLimit = 0;
  for (const slab of slabs) {
    const isInfinity =
      slab.upToUnits === null ||
      slab.upToUnits === undefined ||
      slab.upToUnits === Infinity;
    const upperLimit = isInfinity ? Infinity : Number(slab.upToUnits);

    if (units <= upperLimit) {
      return slab.ratePerKWh;
    }
    previousLimit = upperLimit;
  }

  return slabs[slabs.length - 1]?.ratePerKWh || 0;
}

/**
 * Calculates a complete, official monthly electricity bill for a full billing cycle.
 * Incorporates progressive energy slabs, sanctioned demand fixed charges, and electricity duty.
 *
 * @param {number} monthlyUnits - Total kWh consumed in the 30-day billing cycle.
 * @param {object} tariffConfig - Active tariff configuration.
 * @param {number} [contractedLoadKw=5] - Sanctioned load in kW.
 * @returns {object} Complete monthly billing breakdown.
 */
export function calculateMonthlyBill(monthlyUnits, tariffConfig, contractedLoadKw = 5) {
  if (!tariffConfig || !Array.isArray(tariffConfig.slabs) || tariffConfig.slabs.length === 0) {
    return {
      monthlyUnits: monthlyUnits || 0,
      energyCharge: 0,
      fixedCharge: 0,
      electricityDuty: 0,
      additionalCharges: 0,
      totalBill: 0,
      effectiveEnergyRate: 0,
      marginalSlabRate: 0,
      effectiveTotalRate: 0,
      isVerifiedTariff: false,
      isValid: false,
      error: 'Invalid or missing tariff schedule',
    };
  }

  const validUnits = Number.isFinite(monthlyUnits) && monthlyUnits > 0 ? monthlyUnits : 0;
  const energyCharge = calculateSlabCharge(validUnits, tariffConfig.slabs);

  // Fixed demand charge per monthly tariff schedule
  let fixedCharge = 0;
  if (tariffConfig.fixedChargeType === 'per_kw_per_month') {
    fixedCharge = (tariffConfig.fixedChargeRate || 0) * (contractedLoadKw || 1);
  } else if (tariffConfig.fixedChargeType === 'flat_per_month') {
    fixedCharge = tariffConfig.fixedChargeRate || 0;
  }

  // Electricity Duty (e.g. 5% on energy charges under UP Electricity Duty Act)
  const dutyPercent = Number.isFinite(tariffConfig.electricityDutyPercent)
    ? tariffConfig.electricityDutyPercent
    : 5;
  const electricityDuty = (energyCharge * dutyPercent) / 100;

  // Additional surcharges
  let additionalCharges = 0;
  if (Array.isArray(tariffConfig.additionalCharges)) {
    for (const chg of tariffConfig.additionalCharges) {
      if (chg.type === 'percent_of_energy') {
        additionalCharges += (energyCharge * (chg.rate || 0)) / 100;
      } else if (chg.type === 'per_kwh') {
        additionalCharges += validUnits * (chg.rate || 0);
      }
    }
  }

  const totalBill = energyCharge + fixedCharge + electricityDuty + additionalCharges;
  const effectiveEnergyRate = validUnits > 0 ? energyCharge / validUnits : (tariffConfig.slabs[0]?.ratePerKWh || 5.5);
  const marginalSlabRate = getMarginalSlabRate(validUnits, tariffConfig.slabs);
  const effectiveTotalRate = validUnits > 0 ? totalBill / validUnits : effectiveEnergyRate;

  return {
    monthlyUnits: validUnits,
    energyCharge: Math.round(energyCharge * 100) / 100,
    fixedCharge: Math.round(fixedCharge * 100) / 100,
    electricityDuty: Math.round(electricityDuty * 100) / 100,
    dutyPercent,
    additionalCharges: Math.round(additionalCharges * 100) / 100,
    totalBill: Math.round(totalBill * 100) / 100,
    effectiveEnergyRate: Math.round(effectiveEnergyRate * 100) / 100,
    marginalSlabRate,
    effectiveTotalRate: Math.round(effectiveTotalRate * 100) / 100,
    isVerifiedTariff: tariffConfig.verified === true,
    isValid: true,
  };
}

/**
 * Calculates electricity cost for sub-periods (daily or weekly) WITHOUT improperly
 * applying monthly progressive slabs to short-duration unit counts.
 *
 * Uses the household's projected monthly billing cycle consumption to determine the
 * applicable progressive slab tier and effective rate.
 *
 * @param {number} periodUnits - Energy consumed in the selected window (kWh).
 * @param {number} projectedMonthlyUnits - Expected total consumption for the 30-day billing cycle (kWh).
 * @param {object} tariffConfig - Active tariff configuration.
 * @param {number} [contractedLoadKw=5] - Sanctioned load in kW.
 * @param {string} [period='today'] - 'today' | 'week' | 'month'.
 * @returns {object} Transparent sub-period cost breakdown and billing notes.
 */
export function calculatePeriodEstimate(
  periodUnits,
  projectedMonthlyUnits,
  tariffConfig,
  contractedLoadKw = 5,
  period = 'today'
) {
  if (period === 'month') {
    const monthlyBill = calculateMonthlyBill(projectedMonthlyUnits, tariffConfig, contractedLoadKw);
    return {
      ...monthlyBill,
      periodLabel: 'Projected 30-Day Billing Cycle',
      isSubPeriodEstimate: false,
      allocatedTotal: monthlyBill.totalBill,
      energyCost: Math.round((monthlyBill.energyCharge + monthlyBill.electricityDuty) * 100) / 100,
      proRataFixedCharge: monthlyBill.fixedCharge,
      explanation: `Full projected monthly bill under ${tariffConfig?.name || 'selected tariff'}. Slabs and fixed charges apply to the complete 30-day cycle.`,
    };
  }

  const validPeriodUnits = Number.isFinite(periodUnits) && periodUnits > 0 ? periodUnits : 0;
  const validMonthlyUnits = Number.isFinite(projectedMonthlyUnits) && projectedMonthlyUnits > 0
    ? projectedMonthlyUnits
    : (validPeriodUnits * (period === 'today' ? 30 : 30 / 7));

  // Compute monthly cycle parameters
  const monthlyCycle = calculateMonthlyBill(validMonthlyUnits, tariffConfig, contractedLoadKw);

  if (!monthlyCycle.isValid) {
    return {
      periodUnits: validPeriodUnits,
      projectedMonthlyUnits: validMonthlyUnits,
      energyCharge: 0,
      fixedCharge: 0,
      electricityDuty: 0,
      allocatedTotal: 0,
      energyCost: 0,
      proRataFixedCharge: 0,
      effectiveEnergyRate: 0,
      marginalSlabRate: 0,
      isSubPeriodEstimate: true,
      periodLabel: period === 'today' ? 'Today (Est.)' : 'This Week (Est.)',
      isVerifiedTariff: false,
      isValid: false,
      explanation: 'Insufficient tariff data to calculate estimate.',
    };
  }

  // Energy charge for this period = period units × effective billing rate from monthly cycle
  const periodEnergyCharge = validPeriodUnits * monthlyCycle.effectiveEnergyRate;
  const periodDuty = (periodEnergyCharge * monthlyCycle.dutyPercent) / 100;
  const periodEnergyCost = periodEnergyCharge + periodDuty;

  // Pro-rata fixed charge allocation (for reference only)
  const periodDays = period === 'today' ? 1 : period === 'week' ? 7 : 30;
  const proRataFixedCharge = (monthlyCycle.fixedCharge / 30) * periodDays;
  const allocatedTotal = periodEnergyCost + proRataFixedCharge;

  return {
    periodUnits: validPeriodUnits,
    projectedMonthlyUnits: validMonthlyUnits,
    energyCharge: Math.round(periodEnergyCharge * 100) / 100,
    electricityDuty: Math.round(periodDuty * 100) / 100,
    energyCost: Math.round(periodEnergyCost * 100) / 100,
    proRataFixedCharge: Math.round(proRataFixedCharge * 100) / 100,
    monthlyFixedCharge: monthlyCycle.fixedCharge,
    allocatedTotal: Math.round(allocatedTotal * 100) / 100,
    effectiveEnergyRate: monthlyCycle.effectiveEnergyRate,
    marginalSlabRate: monthlyCycle.marginalSlabRate,
    periodLabel: period === 'today' ? 'Today (Estimated)' : 'This Week (Estimated)',
    isSubPeriodEstimate: true,
    isVerifiedTariff: monthlyCycle.isVerifiedTariff,
    isValid: true,
    explanation: `Sub-period energy estimate evaluated at the projected ${validMonthlyUnits} kWh/mo billing tier (${formatINR(monthlyCycle.effectiveEnergyRate)}/kWh effective, ${formatINR(monthlyCycle.marginalSlabRate)}/kWh marginal). Slabs apply strictly to cumulative monthly billing cycles.`,
  };
}

/**
 * Calculates actual monthly bill savings when consumption is reduced under progressive slabs.
 * Formula: BillSavings = MonthlyBill(BaseUnits) - MonthlyBill(BaseUnits - SavedUnits)
 *
 * This accounts for units being saved from the top-most progressive slab, plus associated duty.
 *
 * @param {number} baseMonthlyUnits - Baseline household consumption for the month (kWh).
 * @param {number} savedMonthlyUnits - Monthly kWh reduction from the energy efficiency measure.
 * @param {object} tariffConfig - Active tariff configuration.
 * @param {number} [contractedLoadKw=5] - Contracted load.
 * @returns {object} Mathematically supported savings breakdown.
 */
export function calculateMarginalSavings(
  baseMonthlyUnits,
  savedMonthlyUnits,
  tariffConfig,
  contractedLoadKw = 5
) {
  if (!tariffConfig || !Array.isArray(tariffConfig.slabs) || tariffConfig.slabs.length === 0) {
    return {
      savedKwhPerMonth: savedMonthlyUnits || 0,
      monthlyBillSavings: 0,
      marginalRate: 0,
      dutyPercent: 5,
      isVerifiedTariff: false,
      isValid: false,
    };
  }

  const validBase = Math.max(1, baseMonthlyUnits || 735);
  const validSaved = Math.max(0, Math.min(validBase, savedMonthlyUnits || 0));

  const baseBill = calculateMonthlyBill(validBase, tariffConfig, contractedLoadKw);
  const reducedBill = calculateMonthlyBill(validBase - validSaved, tariffConfig, contractedLoadKw);

  const billSavings = Math.max(0, baseBill.totalBill - reducedBill.totalBill);
  const energySavings = Math.max(0, baseBill.energyCharge - reducedBill.energyCharge);
  const dutySavings = Math.max(0, baseBill.electricityDuty - reducedBill.electricityDuty);

  return {
    savedKwhPerMonth: Math.round(validSaved * 100) / 100,
    baseMonthlyUnits: validBase,
    reducedMonthlyUnits: validBase - validSaved,
    monthlyBillSavings: Math.round(billSavings * 100) / 100,
    energySavings: Math.round(energySavings * 100) / 100,
    dutySavings: Math.round(dutySavings * 100) / 100,
    marginalRate: baseBill.marginalSlabRate,
    dutyPercent: baseBill.dutyPercent,
    isVerifiedTariff: tariffConfig.verified === true,
    isValid: true,
  };
}

/**
 * Calculates hourly energy cost for instantaneous power draw.
 * Hourly draw is an estimate using the marginal rate of the projected monthly billing tier.
 *
 * @param {number} activeWatts - Instantaneous power draw in Watts.
 * @param {object} tariffConfig - Active tariff configuration.
 * @param {number} [projectedMonthlyUnits=735] - Projected monthly baseline consumption.
 * @returns {number} Estimated cost per hour in INR.
 */
export function calculateHourlyCostEstimate(activeWatts, tariffConfig, projectedMonthlyUnits = 735) {
  if (!Number.isFinite(activeWatts) || activeWatts <= 0 || !tariffConfig) return 0;
  const kWh = wattsToKWh(activeWatts, 1);
  if (kWh === null) return 0;

  const marginalRate = getMarginalSlabRate(projectedMonthlyUnits, tariffConfig.slabs || []);
  const dutyMultiplier = 1 + ((tariffConfig.electricityDutyPercent || 5) / 100);

  return Math.round(kWh * marginalRate * dutyMultiplier * 100) / 100;
}

/**
 * calculateBillBreakdown — Unified billing calculation function.
 *
 * Enforces strict separation between billing cycle consumption and sub-period estimates:
 *   - For 'monthly': applies full progressive slabs, sanctioned load fixed charges, and electricity duty.
 *   - For 'daily' or 'weekly': derives energy charges from the projected monthly tier to prevent slab distortion,
 *     and apportions fixed charges pro-rata (1/30 or 7/30).
 *   - For 'hourly': excludes monthly fixed charges entirely (0) and flags isPartialEstimate: true.
 *
 * @param {number} units - Consumption in kWh for the period.
 * @param {object} tariffConfig - Tariff configuration object.
 * @param {number} [contractedLoadKw=5] - Sanctioned load in kW.
 * @param {string} [period='monthly'] - 'monthly' | 'daily' | 'weekly' | 'hourly'.
 * @param {number} [projectedMonthlyUnits=null] - Optional override for monthly run-rate.
 * @returns {object} Standardized bill breakdown.
 */
export function calculateBillBreakdown(
  units,
  tariffConfig,
  contractedLoadKw = 5,
  period = 'monthly',
  projectedMonthlyUnits = null
) {
  if (!tariffConfig || !Array.isArray(tariffConfig.slabs) || tariffConfig.slabs.length === 0) {
    return {
      units: units || 0,
      energyCharge: 0,
      fixedCharge: 0,
      electricityDuty: 0,
      additionalCharges: 0,
      totalBill: 0,
      effectiveRatePerKWh: 0,
      marginalSlabRate: 0,
      isPartialEstimate: true,
      isVerifiedTariff: false,
      isValid: false,
      error: 'Invalid or missing tariff schedule',
    };
  }

  const validUnits = Number.isFinite(units) && units > 0 ? units : 0;

  if (period === 'monthly') {
    const monthly = calculateMonthlyBill(validUnits, tariffConfig, contractedLoadKw);
    return {
      ...monthly,
      units: validUnits,
      effectiveRatePerKWh: monthly.effectiveEnergyRate,
      isPartialEstimate: false,
    };
  }

  // Sub-period calculations (daily, weekly, hourly)
  const projectedMonthly = Number.isFinite(projectedMonthlyUnits) && projectedMonthlyUnits > 0
    ? projectedMonthlyUnits
    : (period === 'daily' ? validUnits * 30 : period === 'weekly' ? validUnits * (30 / 7) : 735);

  const monthlyCycle = calculateMonthlyBill(projectedMonthly, tariffConfig, contractedLoadKw);
  const periodEnergyCharge = Math.round(validUnits * monthlyCycle.effectiveEnergyRate * 100) / 100;
  const periodDuty = Math.round(((periodEnergyCharge * monthlyCycle.dutyPercent) / 100) * 100) / 100;

  let fixedCharge = 0;
  if (period === 'daily') {
    fixedCharge = Math.round((monthlyCycle.fixedCharge / 30) * 100) / 100;
  } else if (period === 'weekly') {
    fixedCharge = Math.round(((monthlyCycle.fixedCharge / 30) * 7) * 100) / 100;
  } else {
    // hourly or instantaneous
    fixedCharge = 0;
  }

  const totalBill = Math.round((periodEnergyCharge + periodDuty + fixedCharge) * 100) / 100;

  return {
    units: validUnits,
    projectedMonthlyUnits: projectedMonthly,
    energyCharge: periodEnergyCharge,
    fixedCharge,
    electricityDuty: periodDuty,
    additionalCharges: 0,
    totalBill,
    effectiveRatePerKWh: monthlyCycle.effectiveEnergyRate,
    marginalSlabRate: monthlyCycle.marginalSlabRate,
    isPartialEstimate: true,
    isVerifiedTariff: tariffConfig.verified === true,
    isValid: true,
    period,
  };
}

/**
 * Calculates estimated current (Amps) for a given active wattage, nominal voltage, and power factor.
 * Formula: Current (A) = ActivePower (W) / (Voltage (V) * PowerFactor)
 *
 * Clearly documented as an estimated calculated quantity, not raw physical sensor telemetry.
 *
 * @param {number} activeWatts - Active power in Watts.
 * @param {number} [nominalVoltage=230] - Line voltage in Volts.
 * @param {number} [powerFactor=0.95] - Assumed power factor (0 < PF <= 1.0).
 * @returns {number} Estimated RMS current in Amperes.
 */
export function calculateCurrentEstimate(activeWatts, nominalVoltage = 230, powerFactor = 0.95) {
  if (!Number.isFinite(activeWatts) || activeWatts <= 0) return 0;
  const v = Number.isFinite(nominalVoltage) && nominalVoltage > 0 ? nominalVoltage : 230;
  const pf = Number.isFinite(powerFactor) && powerFactor > 0 && powerFactor <= 1.0 ? powerFactor : 0.95;
  return Math.round((activeWatts / (v * pf)) * 10) / 10;
}

/**
 * Calculates estimated energy (kWh) and cost in INR for an individual appliance.
 *
 * @param {number} drawKw - Rated or observed power draw in kW.
 * @param {number} dailyRunHours - Average daily operating duration in hours.
 * @param {number} effectiveRatePerKWh - Effective electricity rate in INR/kWh from billing tier.
 * @returns {object} Breakdown of daily and monthly units and estimated costs.
 */
export function calculateApplianceCost(drawKw, dailyRunHours, effectiveRatePerKWh) {
  if (!Number.isFinite(drawKw) || drawKw <= 0) {
    return { dailyKwh: 0, monthlyKwh: 0, dailyCostInr: 0, monthlyCostInr: 0 };
  }
  const hours = Number.isFinite(dailyRunHours) && dailyRunHours > 0 ? dailyRunHours : 0;
  const rate = Number.isFinite(effectiveRatePerKWh) && effectiveRatePerKWh > 0 ? effectiveRatePerKWh : 5.5;

  const dailyKwh = Math.round(drawKw * hours * 100) / 100;
  const monthlyKwh = Math.round(dailyKwh * 30 * 100) / 100;
  const dailyCostInr = Math.round(dailyKwh * rate * 100) / 100;
  const monthlyCostInr = Math.round(monthlyKwh * rate * 100) / 100;

  return { dailyKwh, monthlyKwh, dailyCostInr, monthlyCostInr };
}


