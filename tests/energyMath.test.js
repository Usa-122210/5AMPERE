import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  wattsToKWh,
  calculateSlabCharge,
  getMarginalSlabRate,
  calculateMonthlyBill,
  calculatePeriodEstimate,
  calculateMarginalSavings,
  calculateHourlyCostEstimate,
  calculateBillBreakdown,
} from '../src/utils/energyMath.js';
import { TARIFF_REGISTRY } from '../src/services/tariffData.js';

test('1. wattsToKWh conversion', async (t) => {
  await t.test('calculates correct kWh for standard appliance power and hours', () => {
    // 1000W for 2 hours = 2 kWh
    assert.strictEqual(wattsToKWh(1000, 2), 2);
    // 1450W for 1 hour = 1.45 kWh
    assert.strictEqual(wattsToKWh(1450, 1), 1.45);
    // 95W for 5.5 hours = 0.5225 kWh
    assert.strictEqual(wattsToKWh(95, 5.5), 0.5225);
    // 0W for 10 hours = 0 kWh
    assert.strictEqual(wattsToKWh(0, 10), 0);
  });

  await t.test('strictly validates inputs and returns null for invalid / negative inputs', () => {
    assert.strictEqual(wattsToKWh(-100, 2), null);
    assert.strictEqual(wattsToKWh(100, -2), null);
    assert.strictEqual(wattsToKWh(NaN, 2), null);
    assert.strictEqual(wattsToKWh(100, Infinity), null);
    assert.strictEqual(wattsToKWh(undefined, 2), null);
    assert.strictEqual(wattsToKWh(null, 2), null);
  });
});

test('2. calculateSlabCharge progressive calculations', async (t) => {
  const uppclSlabs = TARIFF_REGISTRY['uppcl-urban'].slabs;

  await t.test('returns 0 for zero or negative units', () => {
    assert.strictEqual(calculateSlabCharge(0, uppclSlabs), 0);
    assert.strictEqual(calculateSlabCharge(-10, uppclSlabs), 0);
  });

  await t.test('calculates slab 1 correctly (0-100 units @ ₹5.50)', () => {
    assert.strictEqual(calculateSlabCharge(50, uppclSlabs), 275);
    assert.strictEqual(calculateSlabCharge(100, uppclSlabs), 550);
  });

  await t.test('calculates slab 2 correctly (101-150 units @ ₹5.50)', () => {
    assert.strictEqual(calculateSlabCharge(150, uppclSlabs), 825);
  });

  await t.test('calculates slab 3 correctly (151-300 units @ ₹6.00)', () => {
    assert.strictEqual(calculateSlabCharge(200, uppclSlabs), 1125);
    assert.strictEqual(calculateSlabCharge(300, uppclSlabs), 1725);
  });

  await t.test('supports open-ended final slab (>300 units @ ₹6.50)', () => {
    assert.strictEqual(calculateSlabCharge(400, uppclSlabs), 2375);
  });

  await t.test('evaluates precise slab boundaries without jumping tiers', () => {
    // Exactly at boundaries: 100, 150, 300
    assert.strictEqual(calculateSlabCharge(100, uppclSlabs), 550);
    assert.strictEqual(calculateSlabCharge(150, uppclSlabs), 825);
    assert.strictEqual(calculateSlabCharge(300, uppclSlabs), 1725);
    // 301 units = 1725 + (1 * 6.50) = 1731.50
    assert.strictEqual(calculateSlabCharge(301, uppclSlabs), 1731.5);
  });
});

test('3. getMarginalSlabRate identifies active marginal tier', async (t) => {
  const uppclSlabs = TARIFF_REGISTRY['uppcl-urban'].slabs;

  await t.test('correctly identifies marginal tier for different consumption points', () => {
    assert.strictEqual(getMarginalSlabRate(50, uppclSlabs), 5.50);
    assert.strictEqual(getMarginalSlabRate(100, uppclSlabs), 5.50);
    assert.strictEqual(getMarginalSlabRate(125, uppclSlabs), 5.50);
    assert.strictEqual(getMarginalSlabRate(150, uppclSlabs), 5.50);
    assert.strictEqual(getMarginalSlabRate(151, uppclSlabs), 6.00);
    assert.strictEqual(getMarginalSlabRate(300, uppclSlabs), 6.00);
    assert.strictEqual(getMarginalSlabRate(301, uppclSlabs), 6.50);
    assert.strictEqual(getMarginalSlabRate(735, uppclSlabs), 6.50);
  });
});

test('4. calculateMonthlyBill — full 30-day billing cycle evaluation', async (t) => {
  const uppcl = TARIFF_REGISTRY['uppcl-urban'];

  await t.test('calculates 735 kWh monthly household baseline with high mathematical precision', () => {
    const bill = calculateMonthlyBill(735, uppcl, 5);

    // Energy Charge:
    // Slab 1 (0-100 @ ₹5.50): 550.00
    // Slab 2 (101-150 @ ₹5.50): 275.00
    // Slab 3 (151-300 @ ₹6.00): 900.00
    // Slab 4 (301-735 = 435 @ ₹6.50): 2827.50
    // Total Energy Charge = 4552.50
    assert.strictEqual(bill.energyCharge, 4552.5);

    // Fixed Charge: 5 kW * ₹110/kW/mo = ₹550
    assert.strictEqual(bill.fixedCharge, 550);

    // Electricity Duty: 5% of 4552.50 = 227.63
    assert.strictEqual(bill.electricityDuty, 227.63);

    // Total Bill: 4552.50 + 550 + 227.63 = 5330.13
    assert.strictEqual(bill.totalBill, 5330.13);

    // Effective Energy Rate: 4552.50 / 735 ≈ 6.19
    assert.strictEqual(bill.effectiveEnergyRate, 6.19);

    // Marginal Slab Rate: 6.50
    assert.strictEqual(bill.marginalSlabRate, 6.50);

    // Verified tariff status
    assert.strictEqual(bill.isVerifiedTariff, true);
    assert.strictEqual(bill.isValid, true);
  });

  await t.test('handles zero consumption: fixed charge persists but zero energy charges', () => {
    const zeroBill = calculateMonthlyBill(0, uppcl, 5);
    assert.strictEqual(zeroBill.energyCharge, 0);
    assert.strictEqual(zeroBill.electricityDuty, 0);
    assert.strictEqual(zeroBill.fixedCharge, 550);
    assert.strictEqual(zeroBill.totalBill, 550);
  });

  await t.test('scales fixed charge with contracted load kW', () => {
    const bill2kW = calculateMonthlyBill(200, uppcl, 2);
    assert.strictEqual(bill2kW.fixedCharge, 220); // 2 kW * 110

    const bill10kW = calculateMonthlyBill(200, uppcl, 10);
    assert.strictEqual(bill10kW.fixedCharge, 1100); // 10 kW * 110
  });
});

test('5. Sub-period estimation does NOT improperly apply monthly slabs directly to daily counts', async (t) => {
  const uppcl = TARIFF_REGISTRY['uppcl-urban'];

  await t.test('daily consumption (24.5 kWh/day) is evaluated at the projected monthly billing tier', () => {
    // 24.5 kWh/day on a 735 kWh/month household run-rate
    const dailyEst = calculatePeriodEstimate(24.5, 735, uppcl, 5, 'today');

    // If slabs were improperly applied directly to 24.5 kWh, the rate would be ₹5.50 (Slab 1).
    // But since the household consumes 735 kWh/mo, its actual monthly tier has an effective rate of ₹6.19/kWh.
    assert.strictEqual(dailyEst.effectiveEnergyRate, 6.19);
    assert.strictEqual(dailyEst.marginalSlabRate, 6.50);

    // Pro-rata fixed charge is 550 / 30 = 18.33
    assert.strictEqual(dailyEst.proRataFixedCharge, 18.33);

    // Energy charge for 24.5 units = 24.5 * 6.19 = 151.66
    assert.strictEqual(dailyEst.energyCharge, 151.66);

    // Energy cost (energy + 5% duty = 151.66 + 7.58 = 159.24)
    assert.strictEqual(dailyEst.energyCost, 159.24);

    // Total allocated cost = 159.24 + 18.33 = 177.57
    assert.strictEqual(dailyEst.allocatedTotal, 177.57);

    // Flags indicate sub-period estimate
    assert.strictEqual(dailyEst.isSubPeriodEstimate, true);
  });

  await t.test('weekly consumption (171.5 kWh/week) maintains period apportionment', () => {
    const weeklyEst = calculatePeriodEstimate(171.5, 735, uppcl, 5, 'week');
    assert.strictEqual(weeklyEst.isSubPeriodEstimate, true);
    // Weekly pro-rata fixed charge = (550 / 30) * 7 = 128.33
    assert.strictEqual(weeklyEst.proRataFixedCharge, 128.33);
  });

  await t.test('monthly period returns full billing cycle without sub-period flag', () => {
    const monthlyEst = calculatePeriodEstimate(735, 735, uppcl, 5, 'month');
    assert.strictEqual(monthlyEst.isSubPeriodEstimate, false);
    assert.strictEqual(monthlyEst.totalBill, 5330.13);
  });
});

test('6. calculateMarginalSavings — mathematical savings under progressive slabs', async (t) => {
  const uppcl = TARIFF_REGISTRY['uppcl-urban'];
  const baselineMonthlyUnits = 735; // Household in Slab 4 (>300 units @ ₹6.50)

  await t.test('1. Standby Vampire Load (15.68 kWh/mo avoided overnight): derived from top marginal slab', () => {
    // 95W * 5.5h * 30 / 1000 = 15.68 kWh/mo
    const savings = calculateMarginalSavings(baselineMonthlyUnits, 15.68, uppcl, 5);

    // Base bill: 735 units = 5330.13
    // Reduced bill: 735 - 15.68 = 719.32 units
    // Difference is strictly from Slab 4 (15.68 units * 6.50 = 101.92) + 5% duty (5.10) = 107.02
    assert.strictEqual(savings.marginalRate, 6.50);
    assert.strictEqual(savings.savedKwhPerMonth, 15.68);
    assert.strictEqual(savings.energySavings, 101.92);
    assert.strictEqual(savings.dutySavings, 5.10);
    assert.strictEqual(savings.monthlyBillSavings, 107.02);
  });

  await t.test('2. Geyser Standing Thermal Losses (15.0 kWh/mo avoided via timer): derived from top slab', () => {
    // 0.50 kWh/day jacket dissipation * 30 days = 15.0 kWh/mo
    const savings = calculateMarginalSavings(baselineMonthlyUnits, 15.0, uppcl, 5);

    // Energy savings = 15.0 * 6.50 = 97.50
    // Duty savings = 97.50 * 5% = 4.88
    // Total savings = 97.50 + 4.88 = 102.38
    assert.strictEqual(savings.energySavings, 97.50);
    assert.strictEqual(savings.dutySavings, 4.88);
    assert.strictEqual(savings.monthlyBillSavings, 102.38);
  });

  await t.test('3. AC 24°C BEE Guideline (43.2 kWh/mo saved by 4°C setpoint raise): derived from top slab', () => {
    // 1.5T AC (1 kW draw, 6h/day = 6 kWh/day). 4°C shift * 6%/°C = 24% = 1.44 kWh/day * 30 = 43.2 kWh/mo
    const savings = calculateMarginalSavings(baselineMonthlyUnits, 43.2, uppcl, 5);

    // Energy savings = 43.2 * 6.50 = 280.80
    // Duty savings = 280.80 * 5% = 14.04
    // Total savings = 280.80 + 14.04 = 294.84
    assert.strictEqual(savings.energySavings, 280.80);
    assert.strictEqual(savings.dutySavings, 14.04);
    assert.strictEqual(savings.monthlyBillSavings, 294.84);
  });
});

test('7. calculateBillBreakdown backward compatibility & separation', async (t) => {
  const uppcl = TARIFF_REGISTRY['uppcl-urban'];

  await t.test('monthly breakdown matches calculateMonthlyBill', () => {
    const monthly = calculateBillBreakdown(250, uppcl, 5, 'monthly');
    assert.strictEqual(monthly.energyCharge, 1425); // 150 * 5.50 + 100 * 6.00
    assert.strictEqual(monthly.fixedCharge, 550);
    assert.strictEqual(monthly.electricityDuty, 71.25);
    assert.strictEqual(monthly.totalBill, 2046.25);
    assert.strictEqual(monthly.isPartialEstimate, false);
  });

  await t.test('daily breakdown apportions fixed charge and flags partial estimate', () => {
    const daily = calculateBillBreakdown(10, uppcl, 5, 'daily');
    assert.strictEqual(daily.fixedCharge, 18.33); // 550 / 30
    assert.strictEqual(daily.isPartialEstimate, true);
  });

  await t.test('hourly breakdown excludes fixed charges completely', () => {
    const hourly = calculateBillBreakdown(1, uppcl, 5, 'hourly');
    assert.strictEqual(hourly.fixedCharge, 0);
    assert.strictEqual(hourly.isPartialEstimate, true);
  });
});

test('8. Tariff Verification Status Audit', async (t) => {
  await t.test('only UPPCL Urban Domestic is verified; all other DISCOMs are explicitly unverified demo only', () => {
    assert.strictEqual(TARIFF_REGISTRY['uppcl-urban'].verified, true);
    assert.strictEqual(TARIFF_REGISTRY['uppcl-urban'].verificationBadge, 'Verified Official (UPERC Order)');

    assert.strictEqual(TARIFF_REGISTRY['msedcl-residential'].verified, false);
    assert.strictEqual(TARIFF_REGISTRY['msedcl-residential'].verificationBadge, 'Unverified — demo only');

    assert.strictEqual(TARIFF_REGISTRY['bses-delhi'].verified, false);
    assert.strictEqual(TARIFF_REGISTRY['bses-delhi'].verificationBadge, 'Unverified — demo only');

    assert.strictEqual(TARIFF_REGISTRY['bescom-bangalore'].verified, false);
    assert.strictEqual(TARIFF_REGISTRY['bescom-bangalore'].verificationBadge, 'Unverified — demo only');

    assert.strictEqual(TARIFF_REGISTRY['custom'].verified, false);
  });

  await t.test('bill calculation flags unverified tariffs honestly', () => {
    const unverifiedBill = calculateMonthlyBill(300, TARIFF_REGISTRY['msedcl-residential'], 5);
    assert.strictEqual(unverifiedBill.isVerifiedTariff, false);
  });
});

test('9. Missing or invalid tariff data does not produce false precision', () => {
  const invalidResult = calculateBillBreakdown(100, null, 5, 'monthly');
  assert.strictEqual(invalidResult.totalBill, 0);
  assert.strictEqual(invalidResult.energyCharge, 0);
  assert.strictEqual(invalidResult.isPartialEstimate, true);

  const emptySlabsResult = calculateSlabCharge(100, []);
  assert.strictEqual(emptySlabsResult, 0);
});

test('10. INR formatting matches Indian currency standards', () => {
  const f1 = formatINR(1250.5);
  assert.ok(f1.includes('₹'), 'Must contain ₹ symbol');
  assert.ok(f1.includes('1,250.50'), 'Must follow Indian grouping');

  const f2 = formatINR(145000);
  assert.ok(f2.includes('1,45,000.00'), 'Must format lakhs correctly with Indian commas');

  // Negative and zero
  assert.strictEqual(formatINR(NaN), '₹0.00');
  assert.strictEqual(formatINR(-100), '-₹100.00');
});
