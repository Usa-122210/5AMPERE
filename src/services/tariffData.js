/**
 * 5AMPERE — Electricity Tariff Configurations & Multi-DISCOM Registry
 *
 * Provides official verified tariff schedules (UPPCL LMV-1 Domestic)
 * and structured templates for major Indian state utilities.
 *
 * Verification Audit Note:
 *   - Only UPPCL Urban Domestic (LMV-1) has been verified against official
 *     UPERC Tariff Orders published on the UPPCL portal.
 *   - All other state utilities are marked explicitly as 'Unverified — demo only'.
 *   - Do not claim a tariff is verified unless the applicable tariff order
 *     has been independently checked and confirmed.
 */

export const TARIFF_REGISTRY = {
  'uppcl-urban': {
    id: 'uppcl-urban',
    name: 'UPPCL — Urban Domestic (LMV-1)',
    state: 'Uttar Pradesh',
    discom: 'UPPCL (PVVNL / DVVNL / MVVNL / PuVVNL / KESCO)',
    consumerCategory: 'Domestic Light & Power (LMV-1 Urban Metered)',
    billingPeriod: 'monthly',
    currency: 'INR',
    currencySymbol: '₹',
    verified: true,
    verificationBadge: 'Verified Official (UPERC Order)',
    verificationNotice: 'Verified against official UPERC Tariff Schedule on UPPCL Portal.',
    sourceUrl: 'https://uppcl.org/uppcl/en/article/tariff-details',
    sourceLabel: 'UPPCL Official Tariff Portal',
    effectiveFrom: 'UPERC Retail Tariff Schedule (July 2022 Order, continued)',
    lastVerified: 'October 2026',
    notes: 'Official UPERC tariff schedule for metered single-phase residential connections in urban Uttar Pradesh. Slabs apply to cumulative units per monthly billing cycle.',
    hasToD: false, // Standard domestic connections under 10 kW do not have residential ToD in UP
    fixedChargeType: 'per_kw_per_month',
    fixedChargeRate: 110, // ₹110 per kW of contracted/sanctioned load per month
    defaultContractedLoadKw: 5,
    electricityDutyPercent: 5.0, // 5% electricity duty under UP Electricity Duty Act
    slabs: [
      {
        id: 'slab-1',
        label: '0 to 100 kWh',
        fromUnits: 0,
        upToUnits: 100,
        ratePerKWh: 5.50,
      },
      {
        id: 'slab-2',
        label: '101 to 150 kWh',
        fromUnits: 101,
        upToUnits: 150,
        ratePerKWh: 5.50,
      },
      {
        id: 'slab-3',
        label: '151 to 300 kWh',
        fromUnits: 151,
        upToUnits: 300,
        ratePerKWh: 6.00,
      },
      {
        id: 'slab-4',
        label: 'Above 300 kWh',
        fromUnits: 301,
        upToUnits: Infinity,
        ratePerKWh: 6.50,
      },
    ],
    additionalCharges: [],
  },

  'msedcl-residential': {
    id: 'msedcl-residential',
    name: 'MSEDCL — Residential (LT-I B)',
    state: 'Maharashtra',
    discom: 'MSEDCL (Mahavitaran)',
    consumerCategory: 'Residential LT-I (B)',
    billingPeriod: 'monthly',
    currency: 'INR',
    currencySymbol: '₹',
    verified: false,
    verificationBadge: 'Unverified — demo only',
    verificationNotice: 'Unverified demo template. Slabs and fuel adjustment charges (FAC) are indicative only.',
    sourceUrl: 'https://www.mahadiscom.in',
    sourceLabel: 'MSEDCL Portal',
    effectiveFrom: 'Indicative MERC Baseline',
    lastVerified: 'Unverified Demo',
    notes: 'Indicative template. Do not treat as an accurate or official electricity bill.',
    hasToD: false,
    fixedChargeType: 'flat_per_month',
    fixedChargeRate: 128,
    defaultContractedLoadKw: 5,
    electricityDutyPercent: 16.0,
    slabs: [
      { id: 'm-1', label: '0 to 100 kWh', fromUnits: 0, upToUnits: 100, ratePerKWh: 4.71 },
      { id: 'm-2', label: '101 to 300 kWh', fromUnits: 101, upToUnits: 300, ratePerKWh: 10.29 },
      { id: 'm-3', label: '301 to 500 kWh', fromUnits: 301, upToUnits: 500, ratePerKWh: 14.55 },
      { id: 'm-4', label: 'Above 500 kWh', fromUnits: 501, upToUnits: Infinity, ratePerKWh: 16.64 },
    ],
    additionalCharges: [],
  },

  'bses-delhi': {
    id: 'bses-delhi',
    name: 'BSES — Domestic (Delhi)',
    state: 'Delhi (NCT)',
    discom: 'BSES Rajdhani / Yamuna Power Ltd',
    consumerCategory: 'Domestic Low Tension',
    billingPeriod: 'monthly',
    currency: 'INR',
    currencySymbol: '₹',
    verified: false,
    verificationBadge: 'Unverified — demo only',
    verificationNotice: 'Unverified demo template. Excludes Delhi Government power subsidies and PPAC surcharges.',
    sourceUrl: 'https://www.bsesdelhi.com',
    sourceLabel: 'BSES Delhi Portal',
    effectiveFrom: 'Indicative DERC Baseline',
    lastVerified: 'Unverified Demo',
    notes: 'Indicative template. Do not treat as an accurate or official electricity bill.',
    hasToD: false,
    fixedChargeType: 'per_kw_per_month',
    fixedChargeRate: 20,
    defaultContractedLoadKw: 4,
    electricityDutyPercent: 5.0,
    slabs: [
      { id: 'd-1', label: '0 to 200 kWh', fromUnits: 0, upToUnits: 200, ratePerKWh: 3.00 },
      { id: 'd-2', label: '201 to 400 kWh', fromUnits: 201, upToUnits: 400, ratePerKWh: 4.50 },
      { id: 'd-3', label: '401 to 800 kWh', fromUnits: 401, upToUnits: 800, ratePerKWh: 6.50 },
      { id: 'd-4', label: '801 to 1200 kWh', fromUnits: 801, upToUnits: 1200, ratePerKWh: 7.00 },
      { id: 'd-5', label: 'Above 1200 kWh', fromUnits: 1201, upToUnits: Infinity, ratePerKWh: 8.00 },
    ],
    additionalCharges: [],
  },

  'bescom-bangalore': {
    id: 'bescom-bangalore',
    name: 'BESCOM — Domestic (LT-2a)',
    state: 'Karnataka',
    discom: 'BESCOM (Bangalore Electricity Supply Co.)',
    consumerCategory: 'Domestic LT-2(a)',
    billingPeriod: 'monthly',
    currency: 'INR',
    currencySymbol: '₹',
    verified: false,
    verificationBadge: 'Unverified — demo only',
    verificationNotice: 'Unverified demo template. Excludes Gruha Jyothi scheme variations and FAC.',
    sourceUrl: 'https://bescom.karnataka.gov.in',
    sourceLabel: 'BESCOM Portal',
    effectiveFrom: 'Indicative KERC Baseline',
    lastVerified: 'Unverified Demo',
    notes: 'Indicative template. Do not treat as an accurate or official electricity bill.',
    hasToD: false,
    fixedChargeType: 'per_kw_per_month',
    fixedChargeRate: 110,
    defaultContractedLoadKw: 4,
    electricityDutyPercent: 9.0,
    slabs: [
      { id: 'k-1', label: '0 to 100 kWh', fromUnits: 0, upToUnits: 100, ratePerKWh: 4.75 },
      { id: 'k-2', label: 'Above 100 kWh', fromUnits: 101, upToUnits: Infinity, ratePerKWh: 7.00 },
    ],
    additionalCharges: [],
  },

  'custom': {
    id: 'custom',
    name: 'Custom / User-Defined Tariff',
    state: 'Custom State',
    discom: 'Custom DISCOM',
    consumerCategory: 'Domestic',
    billingPeriod: 'monthly',
    currency: 'INR',
    currencySymbol: '₹',
    verified: false,
    verificationBadge: 'User Configured',
    verificationNotice: 'Values entered manually by user from physical electricity bill.',
    sourceUrl: '',
    sourceLabel: 'User-Defined Schedule',
    effectiveFrom: 'Custom',
    lastVerified: 'Local Configuration',
    notes: 'User-customized tariff parameters. Edit rates, slabs, fixed charges, and duty to match your actual bill.',
    hasToD: false,
    fixedChargeType: 'per_kw_per_month',
    fixedChargeRate: 110,
    defaultContractedLoadKw: 5,
    electricityDutyPercent: 5.0,
    slabs: [
      { id: 'c-1', label: '0 to 150 kWh', fromUnits: 0, upToUnits: 150, ratePerKWh: 5.00 },
      { id: 'c-2', label: '151 to 300 kWh', fromUnits: 151, upToUnits: 300, ratePerKWh: 6.50 },
      { id: 'c-3', label: 'Above 300 kWh', fromUnits: 301, upToUnits: Infinity, ratePerKWh: 7.50 },
    ],
    additionalCharges: [],
  },
};

export const DEFAULT_TARIFF_ID = 'uppcl-urban';
