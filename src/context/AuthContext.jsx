import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// ============================================================================
// 1. HARDWARE CATALOGUE DATA (Standard 5AMPERE Smart Energy Component Registry)
// ============================================================================
export const HARDWARE_CATALOGUE = [
  {
    id: 'hw-gateway-din',
    name: '5AMPERE EdgeCore DIN Gateway',
    category: 'Energy Monitoring',
    model: '5AMP-GW-4CT-V2',
    icon: 'Cpu',
    description: 'Central edge computing gateway mounted in main DB. Features 4 split-core CT sensor inputs, dual-band Wi-Fi, RS-485 Modbus, and offline edge telemetry logging.',
    priceINR: 4899,
    compatibility: 'Single-Phase (230V) & 3-Phase (415V) Residential & Commercial Distribution Boards. Fits 4 standard DIN rail module slots.',
    installationRequirement: 'Requires on-site electrical installation by certified 5AMPERE technician. 15-minute panel shutdown required.',
    requiresTechnician: true,
    specs: {
      voltage: '180V–270V AC, 50Hz',
      samplingRate: '4,000 samples/sec (True RMS)',
      connectivity: 'Wi-Fi 802.11 b/g/n (2.4GHz) + Bluetooth LE 5.0',
      mounting: '35mm DIN-Rail (4TE width)',
      accuracy: 'Class 0.5S (±0.5% IEC 62053-22)',
    },
    inStock: true,
  },
  {
    id: 'hw-ct-100a',
    name: 'Split-Core 100A Current Transformer',
    category: 'Energy Monitoring',
    model: '5AMP-CT-100A-SC',
    icon: 'Activity',
    description: 'Non-invasive split-core current transformer sensor. Clips around incoming main phase line without cutting or stripping utility cables.',
    priceINR: 1199,
    compatibility: 'Compatible with 5AMPERE EdgeCore Gateway. Clamps over cables up to 16mm diameter (up to 100A continuous).',
    installationRequirement: 'Non-invasive clamp installation by certified technician. Minimal disruption.',
    requiresTechnician: true,
    specs: {
      ratedCurrent: '100A AC RMS',
      secondaryOutput: '33.3mA / 0.333V millivolt interface',
      cableLength: '1.5m shielded twisted pair',
      coreMaterial: 'High-permeability Silicon Steel Ferrite',
      accuracy: '±0.5% linearity over 2%–120% range',
    },
    inStock: true,
  },
  {
    id: 'hw-contactor-32a',
    name: 'Smart Contactor Relay (32A Single-Phase)',
    category: 'Heavy Appliance Contactor',
    model: '5AMP-RLY-32A-DIN',
    icon: 'Zap',
    description: 'Heavy-duty DIN-rail magnetic latching contactor for automated load shedding and remote control of high-draw appliances (1.5T/2T AC, 25L Geysers, EV chargers).',
    priceINR: 2499,
    compatibility: 'Rated for inductive/resistive loads up to 7.2 kW (32A AC1/AC3). Controlled via EdgeCore Gateway relay bus.',
    installationRequirement: 'Mandatory professional panel installation. Direct circuit breaker integration.',
    requiresTechnician: true,
    specs: {
      rating: '32A continuous, 250V AC',
      endurance: '100,000 electrical operations at full load',
      coilType: 'Zero-hum bi-stable latching (0W idle holding power)',
      statusFeedback: 'Integrated mechanical indicator + aux feedback contact',
      safety: 'IS/IEC 60947-4-1 certified',
    },
    inStock: true,
  },
  {
    id: 'hw-inline-relay-16a',
    name: 'Inline Smart Relay Module (16A)',
    category: 'Smart Switches & Relays',
    model: '5AMP-MOD-16A-WIFI',
    icon: 'Radio',
    description: 'Compact behind-the-switchboard module that converts existing 16A power sockets into smart monitored circuits with active wattage telemetry.',
    priceINR: 1599,
    compatibility: 'Fits inside standard Indian 2-module switch backboxes. Works with existing Roma/Anchor/Legrand physical switches.',
    installationRequirement: 'Electrician installation inside wall switchboard.',
    requiresTechnician: true,
    specs: {
      maxLoad: '16A (3,680W resistive)',
      metering: 'Active power (W), Voltage (V), Current (A), Energy (kWh)',
      overloadProtection: 'Auto-cutout at 17.5A or 75°C internal temperature',
      protocol: 'Wi-Fi 2.4GHz + Local BLE fallback',
    },
    inStock: true,
  },
  {
    id: 'hw-smart-plug-16a',
    name: 'Smart Power Plug with Metering (16A Heavy Duty)',
    category: 'Smart Switches & Relays',
    model: '5AMP-PLUG-16A-PRO',
    icon: 'Plug',
    description: 'Plug-and-play smart plug for heavy 16A Indian 3-pin round sockets. Real-time consumption telemetry for microwave ovens, washing machines, and water pumps.',
    priceINR: 1299,
    compatibility: 'Standard Indian 16A large 3-pin socket (Type M). No wiring changes needed.',
    installationRequirement: 'Customer self-setup or technician assistance during scheduled visit.',
    requiresTechnician: false,
    specs: {
      ratedLoad: '16A / 3,500W at 230V',
      telemetry: 'Real-time wattage & hourly accumulation',
      surgeProtection: 'Up to 380V MOVs with 2.5kV surge arrest',
      connectivity: 'Wi-Fi 2.4GHz Direct Connect',
    },
    inStock: true,
  },
  {
    id: 'hw-occupancy-sensor',
    name: 'PIR Occupancy & Ambient Lux Sensor',
    category: 'Automation & Sensors',
    model: '5AMP-SNS-PIR-LUX',
    icon: 'Eye',
    description: 'Ceiling or wall-mounted dual sensor detecting room occupancy and daylight lux levels. Used by 5AMPERE automation to turn off idle AC and lighting circuits.',
    priceINR: 1449,
    compatibility: 'Pairs wirelessly with 5AMPERE EdgeCore Gateway via Bluetooth Mesh.',
    installationRequirement: 'Adhesive or screw mount. Battery operated (2-year CR123A) or micro-USB powered.',
    requiresTechnician: false,
    specs: {
      detectionRange: '110° wide-angle, up to 7 meters radius',
      luxRange: '0–2,000 Lux daylight sensing',
      batteryLife: '24+ months on coin battery',
      latency: '< 200ms trigger response time',
    },
    inStock: true,
  },
  {
    id: 'hw-3phase-meter',
    name: '3-Phase 63A Bi-Directional DIN Submeter',
    category: 'Whole-Panel Submetering',
    model: '5AMP-MTR-3PH-63A',
    icon: 'Gauge',
    description: 'Revenue-grade bidirectional multi-function meter for large independent houses, schools, commercial offices, and industrial facilities. Measures import/export per phase.',
    priceINR: 6499,
    compatibility: '3-Phase 4-Wire (415V/240V). Direct connection up to 63A per phase.',
    installationRequirement: 'Requires qualified electrical technician. 30-minute main shutdown.',
    requiresTechnician: true,
    specs: {
      nominalVoltage: '3x230/400V AC',
      maxCurrent: '63A continuous per phase',
      measurements: 'Active/Reactive energy, Power Factor, THD harmonics',
      display: 'Backlit LCD with MID compliance',
      bus: 'RS-485 Modbus-RTU 9600 baud',
    },
    inStock: true,
  },
];

// ============================================================================
// 2. INITIAL BASELINE DEMO DATA (Multi-Property Ecosystem)
// ============================================================================

export const INITIAL_PROPERTIES = [
  // 1. Residential Home (Active & Fully Configured Baseline)
  {
    id: 'prop-home-arpita',
    customerName: 'Arpita Sharma',
    phone: '+91 98765 43210',
    email: 'arpita@example.com',
    propertyName: 'Flat 402, Eco Village',
    propertyType: 'home', // 'home' | 'school' | 'office' | 'industry'
    dwellingType: 'apartment', // 'apartment' | 'independent_house' | 'villa'
    address: 'Flat 402, Tower B, Supertech Eco Village',
    locality: 'Sector 1, Greater Noida West, UP',
    floors: 1,
    roomsCount: 3,
    discom: 'UPPCL (PVVNL Noida)',
    sanctionedLoadKw: 5.0,
    approxMonthlyBill: 4500,
    meterNumber: 'UP-7849201',
    installationStatus: 'active', // 'pending_assessment' | 'visit_scheduled' | 'assessment_completed' | 'installation_in_progress' | 'configured' | 'completed' | 'active'
    monitoringMode: 'both', // 'monitoring_only' | 'appliance_control' | 'both'
    organizationMode: 'room_wise', // 'room_wise' | 'circuit_wise' | 'whole_property'
    energyGoals: ['reduce_bills', 'identify_high_loads', 'automate_appliances'],
    rooms: [
      {
        id: 'room-living',
        name: 'Living Room',
        type: 'living_room',
        appliances: [
          { id: 'app-ac-1', name: '1.5T Inverter AC', type: 'ac', drawKw: 1.45, active: true, controlEnabled: true, priority: 'High', circuit: '32A Contactor' },
          { id: 'app-tv', name: 'Smart TV & Soundbar', type: 'entertainment', drawKw: 0.12, active: true, controlEnabled: false, priority: 'Low', circuit: '16A Plug' },
          { id: 'app-fans-l', name: 'BLDC Ceiling Fans (2)', type: 'fan', drawKw: 0.07, active: true, controlEnabled: false, priority: 'Standard', circuit: 'Switchboard' },
        ],
      },
      {
        id: 'room-master',
        name: 'Master Bedroom',
        type: 'bedroom',
        appliances: [
          { id: 'app-ac-2', name: '1.0T Split AC', type: 'ac', drawKw: 0.95, active: false, controlEnabled: true, priority: 'High', circuit: '32A Contactor' },
          { id: 'app-bed-lights', name: 'Ambient Lighting', type: 'lighting', drawKw: 0.04, active: true, controlEnabled: false, priority: 'Low', circuit: 'Switchboard' },
        ],
      },
      {
        id: 'room-kitchen',
        name: 'Kitchen',
        type: 'kitchen',
        appliances: [
          { id: 'app-fridge', name: 'Double Door Refrigerator', type: 'refrigerator', drawKw: 0.18, active: true, controlEnabled: false, priority: 'Critical', circuit: '16A Dedicated Socket' },
          { id: 'app-microwave', name: 'Convection Microwave', type: 'microwave', drawKw: 1.20, active: false, controlEnabled: true, priority: 'Standard', circuit: '16A Smart Plug' },
          { id: 'app-ro', name: 'RO Water Purifier', type: 'ro', drawKw: 0.04, active: true, controlEnabled: false, priority: 'Low', circuit: '6A Socket' },
        ],
      },
      {
        id: 'room-bath',
        name: 'Master Bathroom',
        type: 'bathroom',
        appliances: [
          { id: 'app-geyser', name: '25L Storage Geyser', type: 'geyser', drawKw: 2.00, active: false, controlEnabled: true, priority: 'Standard', circuit: '16A Inline Relay' },
        ],
      },
    ],
    circuits: [],
    installedDevices: [
      { id: 'hw-gateway-din', serial: '5AMP-GW-882194', installedDate: '2026-08-15', status: 'Online', category: 'Energy Monitoring', location: 'Main DB Board' },
      { id: 'hw-ct-100a', serial: '5AMP-CT-00124', installedDate: '2026-08-15', status: 'Calibrated', category: 'Energy Monitoring', location: 'Phase Incomer' },
      { id: 'hw-contactor-32a', serial: '5AMP-RLY-99201', installedDate: '2026-08-15', status: 'Online', category: 'Heavy Appliance Contactor', location: 'Living Room AC' },
      { id: 'hw-inline-relay-16a', serial: '5AMP-MOD-44120', installedDate: '2026-08-15', status: 'Online', category: 'Smart Switches & Relays', location: 'Master Geyser' },
    ],
    ownedPendingDevices: [],
    requestedDevices: [
      {
        requestId: 'req-cust-01',
        deviceId: 'hw-smart-plug-16a',
        deviceName: 'Smart Power Plug with Metering (16A Heavy Duty)',
        targetAssignment: 'Kitchen / Microwave Socket',
        requestedDate: '2026-10-10',
        preferredSlot: 'Saturday, 11:00 AM - 01:00 PM',
        status: 'visit_scheduled',
        notes: 'Install on heavy microwave socket in kitchen.',
      },
    ],
    technicianNotes: 'Distribution board verified. 35mm DIN rail space available. CT calibrated with 230V reference.',
    createdDate: '2026-08-15',
  },

  // 2. Educational Institution (School Property)
  {
    id: 'prop-school-greenwood',
    customerName: 'Dr. Alok Nath (Principal)',
    phone: '+91 98100 23456',
    email: 'admin@greenwoodhigh.edu.in',
    propertyName: 'Greenwood International School Campus',
    propertyType: 'school',
    address: 'Plot 4, Institutional Area, Knowledge Park III',
    locality: 'Greater Noida, UP',
    floors: 3,
    blocksCount: 4,
    discom: 'UPPCL Commercial/Institutional',
    sanctionedLoadKw: 120.0,
    approxMonthlyBill: 88000,
    meterNumber: 'UP-SCH-90219',
    installationStatus: 'visit_scheduled',
    monitoringMode: 'both',
    organizationMode: 'room_wise',
    energyGoals: ['reduce_bills', 'identify_high_loads', 'solar_readiness'],
    rooms: [
      {
        id: 'zone-admin',
        name: 'Administrative Wing & Staff Rooms',
        type: 'admin',
        appliances: [
          { id: 'app-sch-admin-ac', name: 'Central Split ACs (6 Units)', drawKw: 9.0, active: true, controlEnabled: true, priority: 'High', circuit: 'Sub-Panel A' },
          { id: 'app-sch-comp', name: 'Administrative Computers & Servers', drawKw: 2.2, active: true, controlEnabled: false, priority: 'Critical', circuit: 'UPS Circuit' },
        ],
      },
      {
        id: 'zone-classrooms',
        name: 'Academic Block A (32 Classrooms)',
        type: 'classrooms',
        appliances: [
          { id: 'app-sch-lights', name: 'LED Tube Lighting Array', drawKw: 3.2, active: true, controlEnabled: true, priority: 'Standard', circuit: 'Floor 1 & 2 Busway' },
          { id: 'app-sch-fans', name: 'Classroom BLDC Ceiling Fans (64 Units)', drawKw: 2.5, active: true, controlEnabled: false, priority: 'Standard', circuit: 'Floor 1 & 2 Busway' },
        ],
      },
      {
        id: 'zone-labs',
        name: 'Science & Robotics Laboratories',
        type: 'labs',
        appliances: [
          { id: 'app-sch-lab-ac', name: 'Precision Air Conditioning', drawKw: 4.5, active: false, controlEnabled: true, priority: 'High', circuit: 'Lab Sub-DB' },
          { id: 'app-sch-equip', name: 'Robotics & 3D Printing Equipment', drawKw: 1.8, active: false, controlEnabled: false, priority: 'Standard', circuit: 'Lab Bench Sockets' },
        ],
      },
      {
        id: 'zone-pumps',
        name: 'Water Management & Pump House',
        type: 'utilities',
        appliances: [
          { id: 'app-sch-pump', name: 'Submersible Water Pump (7.5 HP)', drawKw: 5.5, active: true, controlEnabled: true, priority: 'High', circuit: 'Starter Panel B' },
        ],
      },
    ],
    circuits: [],
    installedDevices: [],
    ownedPendingDevices: [
      { id: 'hw-3phase-meter', count: 2, status: 'Owned - Unwired' },
    ],
    requestedDevices: [
      {
        requestId: 'req-sch-01',
        deviceId: 'hw-3phase-meter',
        deviceName: '3-Phase 63A Bi-Directional DIN Submeter',
        targetAssignment: 'Main Campus Incomer Transformer Panel',
        requestedDate: '2026-10-12',
        preferredSlot: 'Tomorrow, 10:00 AM - 01:00 PM',
        status: 'visit_scheduled',
        notes: 'Install whole-school submetering at 120kW transformer feeder.',
      },
    ],
    technicianNotes: 'Campus site assessment scheduled. Requires 3-phase busbar clamp survey.',
    createdDate: '2026-10-11',
  },

  // 3. Commercial Office Building
  {
    id: 'prop-office-techcorp',
    customerName: 'Sanjay Mehra (Facility Manager)',
    phone: '+91 99112 45678',
    email: 'facilities@techcorp.in',
    propertyName: 'TechCorp Innovation Hub (Floor 5 & 6)',
    propertyType: 'office',
    address: 'Building 10B, DLF Cyber City',
    locality: 'DLF Phase 2, Gurugram, Haryana',
    floors: 2,
    blocksCount: 1,
    discom: 'DHBVN Commercial HT',
    sanctionedLoadKw: 75.0,
    approxMonthlyBill: 62000,
    meterNumber: 'HR-OFF-44109',
    installationStatus: 'installation_in_progress',
    monitoringMode: 'both',
    organizationMode: 'room_wise',
    energyGoals: ['reduce_bills', 'identify_high_loads', 'automate_appliances'],
    rooms: [
      {
        id: 'zone-workstation',
        name: 'Open Floor Workstations (140 Desks)',
        type: 'workstations',
        appliances: [
          { id: 'app-off-desks', name: 'Monitor & Laptop Power Tracks', drawKw: 8.5, active: true, controlEnabled: false, priority: 'High', circuit: 'Floor Underdesk Track' },
          { id: 'app-off-light', name: 'DALI Dimmable Architectural Lighting', drawKw: 1.8, active: true, controlEnabled: true, priority: 'Standard', circuit: 'Lighting Panel' },
        ],
      },
      {
        id: 'zone-server',
        name: 'Server Room & Communications Hub',
        type: 'server_room',
        appliances: [
          { id: 'app-off-ups', name: 'Dual 20kVA Online UPS Clusters', drawKw: 12.0, active: true, controlEnabled: false, priority: 'Critical', circuit: 'Isolated UPS Incomer' },
          { id: 'app-off-pac', name: 'Precision Cooling PAC Unit (24x7)', drawKw: 6.2, active: true, controlEnabled: false, priority: 'Critical', circuit: 'PAC Breaker' },
        ],
      },
      {
        id: 'zone-cafeteria',
        name: 'Cafeteria & Breakout Lounge',
        type: 'cafeteria',
        appliances: [
          { id: 'app-off-coffee', name: 'Commercial Espresso & Vending Machines', drawKw: 3.5, active: true, controlEnabled: true, priority: 'Low', circuit: 'Pantry 32A' },
          { id: 'app-off-ref', name: 'Double Commercial Coolers', drawKw: 1.1, active: true, controlEnabled: false, priority: 'Standard', circuit: 'Pantry 16A' },
        ],
      },
    ],
    circuits: [],
    installedDevices: [
      { id: 'hw-gateway-din', serial: '5AMP-GW-551029', installedDate: '2026-10-08', status: 'Online', category: 'Energy Monitoring', location: 'Floor 5 Main Panel' },
    ],
    ownedPendingDevices: [],
    requestedDevices: [
      {
        requestId: 'req-off-01',
        deviceId: 'hw-contactor-32a',
        deviceName: 'Smart Contactor Relay (32A Single-Phase)',
        targetAssignment: 'Cafeteria Pantry Circuit (After-hours shedding)',
        requestedDate: '2026-10-09',
        preferredSlot: 'Today, 03:00 PM - 05:00 PM',
        status: 'installation_in_progress',
        notes: 'Install 32A contactor for automatic after-hours pantry power cutoff.',
      },
    ],
    technicianNotes: 'Floor 5 gateway mounted and connected to enterprise Wi-Fi. 32A contactor installation underway.',
    createdDate: '2026-10-08',
  },

  // 4. Industrial Facility
  {
    id: 'prop-industry-apex',
    customerName: 'Rajinder Varma (Works Director)',
    phone: '+91 98200 99881',
    email: 'works@apexforgings.com',
    propertyName: 'Apex Precision Forgings & Machine Tools',
    propertyType: 'industry',
    address: 'Plot 88, Ecotech 1 Extension',
    locality: 'Greater Noida Industrial Area, UP',
    floors: 1,
    blocksCount: 3,
    discom: 'UPPCL Heavy Industrial (11kV HT)',
    sanctionedLoadKw: 250.0,
    approxMonthlyBill: 240000,
    meterNumber: 'UP-IND-88120',
    installationStatus: 'configured',
    monitoringMode: 'both',
    organizationMode: 'circuit_wise',
    energyGoals: ['reduce_bills', 'identify_high_loads', 'automate_appliances'],
    rooms: [
      {
        id: 'zone-cnc',
        name: 'CNC Milling & Turning Bay',
        type: 'machining',
        appliances: [
          { id: 'app-ind-cnc-1', name: '5-Axis CNC Milling Center', drawKw: 28.0, active: true, controlEnabled: false, priority: 'Critical', circuit: 'MCC Bay 1' },
          { id: 'app-ind-cnc-2', name: 'CNC Lathes Gang (4 Machines)', drawKw: 18.5, active: true, controlEnabled: false, priority: 'High', circuit: 'MCC Bay 1' },
        ],
      },
      {
        id: 'zone-compressor',
        name: 'Pneumatics & Screw Compressor Room',
        type: 'compressor',
        appliances: [
          { id: 'app-ind-comp-1', name: 'Rotary Screw Air Compressor (45 kW)', drawKw: 42.0, active: true, controlEnabled: true, priority: 'High', circuit: 'PCC Breaker 4' },
          { id: 'app-ind-comp-2', name: 'Refrigerated Air Dryer', drawKw: 3.5, active: true, controlEnabled: false, priority: 'Standard', circuit: 'Aux DB' },
        ],
      },
      {
        id: 'zone-furnace',
        name: 'Induction Heating & Billet Oven',
        type: 'furnace',
        appliances: [
          { id: 'app-ind-furnace', name: 'Billet Induction Heater (75 kW)', drawKw: 68.0, active: false, controlEnabled: true, priority: 'High', circuit: 'Dedicated HT Transformer Line' },
        ],
      },
    ],
    circuits: [],
    installedDevices: [
      { id: 'hw-gateway-din', serial: '5AMP-GW-IND-01', installedDate: '2026-09-28', status: 'Online', category: 'Energy Monitoring', location: 'PCC Panel' },
      { id: 'hw-3phase-meter', serial: '5AMP-MTR-IND-88', installedDate: '2026-09-28', status: 'Online', category: 'Whole-Panel Submetering', location: 'Transformer Incomer' },
      { id: 'hw-contactor-32a', serial: '5AMP-RLY-IND-12', installedDate: '2026-09-28', status: 'Online', category: 'Heavy Appliance Contactor', location: 'Compressor 2 Unloader' },
    ],
    ownedPendingDevices: [],
    requestedDevices: [],
    technicianNotes: 'Industrial HT submetering fully configured. Modbus-RTU 9600 baud linked to plant SCADA gateway.',
    createdDate: '2026-09-28',
  },
];

export const DEMO_TECHNICIAN_USER = {
  id: 'tech-rajesh',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@5ampere.com',
  phone: '+91 98112 34567',
  role: 'technician',
  title: 'Lead Field Energy Specialist',
  badgeNumber: '5AMP-TECH-042',
  assignedZone: 'Gautam Buddha Nagar (Noida & Greater Noida)',
  certifications: ['Certified Smart Grid Wireman (CEA)', 'BEE Energy Auditor (Associate)'],
};

export const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-01',
    homeId: 'prop-school-greenwood',
    customerName: 'Dr. Alok Nath (Principal)',
    phone: '+91 98100 23456',
    address: 'Plot 4, Institutional Area, Knowledge Park III, Greater Noida',
    scheduledTime: 'Tomorrow, 10:00 AM – 01:00 PM',
    type: 'Site Assessment & 3-Phase Metering Planning',
    status: 'visit_scheduled',
    priority: 'High',
    scope: 'Assess 120kW transformer feeder panel. Verify DIN rail space for EdgeCore and dual 3-phase meters.',
    technicianId: 'tech-rajesh',
  },
  {
    id: 'apt-02',
    homeId: 'prop-office-techcorp',
    customerName: 'Sanjay Mehra (Facility Manager)',
    phone: '+91 99112 45678',
    address: 'Building 10B, DLF Cyber City, Gurugram',
    scheduledTime: 'Today, 03:00 PM – 05:00 PM',
    type: 'Hardware Installation & Contactor Wiring',
    status: 'installation_in_progress',
    priority: 'Normal',
    scope: 'Mount 32A smart contactor relay for cafeteria after-hours load shedding.',
    technicianId: 'tech-rajesh',
  },
  {
    id: 'apt-03',
    homeId: 'prop-home-arpita',
    customerName: 'Arpita Sharma',
    phone: '+91 98765 43210',
    address: 'Flat 402, Tower B, Supertech Eco Village, Greater Noida West',
    scheduledTime: 'Saturday, 11:00 AM – 01:00 PM',
    type: 'Device Addition (Smart Plug 16A)',
    status: 'visit_scheduled',
    priority: 'Normal',
    scope: 'Configure and link 16A smart plug on kitchen microwave socket. Run gateway RF test.',
    technicianId: 'tech-rajesh',
  },
];

// ============================================================================
// 3. AUTH & SHARED STATE CONTEXT
// ============================================================================
const AuthContext = createContext(null);

const STORAGE_KEYS = {
  USER: '5ampere_auth_user_v2',
  PROPERTIES: '5ampere_properties_v2',
  APPOINTMENTS: '5ampere_appointments_v2',
};

export function AuthProvider({ children }) {
  // Current user starts as NULL if no saved session! (Fixes root entry requirement 2)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null; // Unauthenticated by default!
  });

  // Customer properties list (Home, School, Office, Industry)
  const [customerProperties, setCustomerProperties] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PROPERTIES;
  });

  // Appointments roster
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_APPOINTMENTS;
  });

  // Persist user changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {}
  }, [currentUser]);

  // Persist properties changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(customerProperties));
    } catch (e) {}
  }, [customerProperties]);

  // Persist appointments changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {}
  }, [appointments]);

  // Active Customer Property (synced with current user)
  const activeCustomerProperty = useMemo(() => {
    if (!currentUser || currentUser.role !== 'customer') return null;
    const match = customerProperties.find((p) => p.id === currentUser.propertyId || p.email === currentUser.email);
    return match || customerProperties[0];
  }, [currentUser, customerProperties]);

  // Backward compatibility alias: activeCustomerHome
  const activeCustomerHome = activeCustomerProperty;
  const customerHomes = customerProperties;

  // --------------------------------------------------------------------------
  // AUTHENTICATION METHODS
  // --------------------------------------------------------------------------
  const loginCustomer = useCallback((email, password) => {
    const matched = customerProperties.find(
      (p) => p.email?.toLowerCase() === email?.toLowerCase()
    ) || customerProperties[0];

    const userObj = {
      id: `usr-${matched.id}`,
      name: matched.customerName,
      email: email || matched.email,
      phone: matched.phone,
      role: 'customer',
      title: 'Customer & Property Owner',
      propertyId: matched.id,
      propertyName: matched.propertyName,
      propertyType: matched.propertyType,
    };
    setCurrentUser(userObj);
    return { success: true, user: userObj };
  }, [customerProperties]);

  const loginTechnician = useCallback((email, password) => {
    const userObj = DEMO_TECHNICIAN_USER;
    setCurrentUser(userObj);
    return { success: true, user: userObj };
  }, []);

  const loginAsDemoUser = useCallback((demoKey) => {
    if (demoKey === 'technician') {
      setCurrentUser(DEMO_TECHNICIAN_USER);
      return DEMO_TECHNICIAN_USER;
    }

    let targetProp = customerProperties[0]; // default Arpita (Home)
    if (demoKey === 'customer-school') {
      targetProp = customerProperties.find((p) => p.propertyType === 'school') || customerProperties[1];
    } else if (demoKey === 'customer-office') {
      targetProp = customerProperties.find((p) => p.propertyType === 'office') || customerProperties[2];
    } else if (demoKey === 'customer-industry') {
      targetProp = customerProperties.find((p) => p.propertyType === 'industry') || customerProperties[3];
    } else if (demoKey === 'customer-home') {
      targetProp = customerProperties.find((p) => p.propertyType === 'home') || customerProperties[0];
    }

    const userObj = {
      id: `usr-${targetProp.id}`,
      name: targetProp.customerName,
      email: targetProp.email,
      phone: targetProp.phone,
      role: 'customer',
      title: 'Customer & Property Owner',
      propertyId: targetProp.id,
      propertyName: targetProp.propertyName,
      propertyType: targetProp.propertyType,
    };
    setCurrentUser(userObj);
    return userObj;
  }, [customerProperties]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // --------------------------------------------------------------------------
  // ONBOARDING & REGISTRATION
  // --------------------------------------------------------------------------
  const signupAndRegisterProperty = useCallback((onboardingData) => {
    const propId = `prop-${onboardingData.propertyType || 'home'}-${Date.now().toString().slice(-4)}`;

    const newProperty = {
      id: propId,
      customerName: onboardingData.fullName || 'New Customer',
      phone: onboardingData.phone || '+91 98000 00000',
      email: onboardingData.email || 'customer@example.com',
      propertyName: onboardingData.propertyName || `${onboardingData.fullName}'s ${onboardingData.propertyType || 'Property'}`,
      propertyType: onboardingData.propertyType || 'home',
      dwellingType: onboardingData.dwellingType || 'apartment',
      address: onboardingData.address || 'Address pending verification',
      locality: onboardingData.locality || 'Locality',
      floors: Number(onboardingData.floors) || 1,
      roomsCount: Number(onboardingData.roomsCount) || (onboardingData.rooms?.length || 3),
      discom: onboardingData.discom || 'UPPCL Urban Domestic',
      sanctionedLoadKw: Number(onboardingData.sanctionedLoadKw) || 5.0,
      approxMonthlyBill: Number(onboardingData.approxMonthlyBill) || 3500,
      meterNumber: onboardingData.meterNumber || `GEN-${Math.floor(100000 + Math.random() * 900000)}`,
      installationStatus: 'visit_scheduled', // New customer requires initial field appointment
      monitoringMode: onboardingData.monitoringMode || 'both',
      organizationMode: onboardingData.organizationMode || 'room_wise',
      energyGoals: onboardingData.energyGoals || ['reduce_bills'],
      rooms: onboardingData.rooms || [],
      circuits: onboardingData.circuits || [],
      installedDevices: [],
      ownedPendingDevices: onboardingData.ownedDevices || [],
      requestedDevices: (onboardingData.requestedHardware || []).map((h, idx) => ({
        requestId: `req-new-${Date.now().toString().slice(-4)}-${idx}`,
        deviceId: h.id,
        deviceName: h.name,
        targetAssignment: h.targetAssignment || 'Main Incomer Panel',
        requestedDate: new Date().toISOString().split('T')[0],
        preferredSlot: onboardingData.preferredSlot || 'Preferred Morning Slot (10 AM - 1 PM)',
        status: 'visit_scheduled',
        notes: onboardingData.installationNotes || 'Initial system commissioning and edge hardware installation.',
      })),
      technicianNotes: 'New property registered. Awaiting initial on-site electrical assessment.',
      createdDate: new Date().toISOString().split('T')[0],
    };

    const newCustomerUser = {
      id: `usr-${propId}`,
      name: newProperty.customerName,
      email: newProperty.email,
      phone: newProperty.phone,
      role: 'customer',
      title: 'Customer & Property Owner',
      propertyId: propId,
      propertyName: newProperty.propertyName,
      propertyType: newProperty.propertyType,
    };

    // Save property and create appointment
    setCustomerProperties((prev) => [newProperty, ...prev]);

    const newAppointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      homeId: propId,
      customerName: newProperty.customerName,
      phone: newProperty.phone,
      address: `${newProperty.address}, ${newProperty.locality}`,
      scheduledTime: onboardingData.preferredSlot || 'Scheduled within 48 Hours',
      type: `Initial Assessment & Setup (${newProperty.propertyType.toUpperCase()})`,
      status: 'visit_scheduled',
      priority: 'High',
      scope: `Assess distribution boards at ${newProperty.propertyName}, verify load ${newProperty.sanctionedLoadKw} kW, and mount EdgeCore gateway.`,
      technicianId: 'tech-rajesh',
    };
    setAppointments((prev) => [newAppointment, ...prev]);

    setCurrentUser(newCustomerUser);
    return { success: true, user: newCustomerUser, property: newProperty };
  }, []);

  // --------------------------------------------------------------------------
  // ROOM & APPLIANCE / CIRCUIT MANAGEMENT
  // --------------------------------------------------------------------------
  const updatePropertyRooms = useCallback((propertyId, updatedRooms) => {
    setCustomerProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, rooms: updatedRooms } : p))
    );
  }, []);

  const toggleApplianceState = useCallback((propertyId, roomId, applianceId) => {
    setCustomerProperties((prev) =>
      prev.map((p) => {
        if (p.id !== propertyId) return p;
        const newRooms = (p.rooms || []).map((r) => {
          if (r.id !== roomId) return r;
          const newApps = (r.appliances || []).map((a) =>
            a.id === applianceId ? { ...a, active: !a.active } : a
          );
          return { ...r, appliances: newApps };
        });
        return { ...p, rooms: newRooms };
      })
    );
  }, []);

  const addApplianceToRoom = useCallback((propertyId, roomId, newAppliance) => {
    setCustomerProperties((prev) =>
      prev.map((p) => {
        if (p.id !== propertyId) return p;
        const newRooms = (p.rooms || []).map((r) => {
          if (r.id !== roomId) return r;
          return { ...r, appliances: [...(r.appliances || []), newAppliance] };
        });
        return { ...p, rooms: newRooms };
      })
    );
  }, []);

  // --------------------------------------------------------------------------
  // HARDWARE WORKFLOW & TECHNICIAN STAGES
  // --------------------------------------------------------------------------
  const requestDeviceInstallation = useCallback((propertyId, deviceId, targetAssignment, preferredSlot, notes, deviceOwnership = 'new_request') => {
    const hw = HARDWARE_CATALOGUE.find((h) => h.id === deviceId);
    if (!hw) return { success: false, message: 'Hardware not found' };

    const newRequestId = `req-${Date.now().toString().slice(-5)}`;
    const newRequest = {
      requestId: newRequestId,
      deviceId: hw.id,
      deviceName: hw.name,
      targetAssignment: targetAssignment || 'Main Incomer Panel',
      requestedDate: new Date().toISOString().split('T')[0],
      preferredSlot: preferredSlot || 'Weekend Slot (10 AM - 1 PM)',
      status: 'visit_scheduled',
      deviceOwnership, // 'new_request' | 'owned_unconfigured'
      notes: notes || 'Installation request submitted by customer.',
    };

    setCustomerProperties((prev) =>
      prev.map((prop) => {
        if (prop.id === propertyId) {
          return {
            ...prop,
            requestedDevices: [newRequest, ...(prop.requestedDevices || [])],
          };
        }
        return prop;
      })
    );

    // Create technician appointment
    const targetProp = customerProperties.find((p) => p.id === propertyId) || activeCustomerProperty;
    const newAppointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      homeId: propertyId,
      customerName: targetProp?.customerName || 'Customer',
      phone: targetProp?.phone || '+91 98000 00000',
      address: targetProp ? `${targetProp.address}, ${targetProp.locality}` : 'Noida',
      scheduledTime: preferredSlot || 'Next available slot',
      type: `Hardware Installation: ${hw.name}`,
      status: 'visit_scheduled',
      priority: 'Normal',
      scope: `Deliver & install ${hw.name} at ${targetAssignment}. Calibrate True RMS and test telemetry.`,
      technicianId: 'tech-rajesh',
    };
    setAppointments((prev) => [newAppointment, ...prev]);

    return { success: true, requestId: newRequestId, hardware: hw };
  }, [customerProperties, activeCustomerProperty]);

  const updateHomeWorkflowStage = useCallback((propertyId, newStage, technicianNotes) => {
    setCustomerProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          return {
            ...p,
            installationStatus: newStage,
            lastVisitDate: new Date().toISOString().split('T')[0],
            technicianNotes: technicianNotes || p.technicianNotes,
          };
        }
        return p;
      })
    );

    setAppointments((prev) =>
      prev.map((apt) => (apt.homeId === propertyId ? { ...apt, status: newStage } : apt))
    );
  }, []);

  const attachDeviceToHome = useCallback((propertyId, deviceId, assignment) => {
    const hw = HARDWARE_CATALOGUE.find((h) => h.id === deviceId);
    if (!hw) return;

    setCustomerProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          const serial = `5AMP-${hw.model?.split('-')[1] || 'MOD'}-${Math.floor(100000 + Math.random() * 900000)}`;
          const newInstalled = {
            id: hw.id,
            name: hw.name,
            serial,
            installedDate: new Date().toISOString().split('T')[0],
            location: assignment || 'Main Panel',
            circuit: assignment || 'Main Panel',
            category: hw.category,
            status: 'Online & Commissioned',
          };

          // Remove from requested if matching
          const filteredRequested = (p.requestedDevices || []).filter((r) => r.deviceId !== deviceId);

          return {
            ...p,
            installedDevices: [...(p.installedDevices || []), newInstalled],
            requestedDevices: filteredRequested,
            installationStatus: p.installationStatus === 'visit_scheduled' ? 'configured' : p.installationStatus,
          };
        }
        return p;
      })
    );
  }, []);

  const detachDeviceFromHome = useCallback((propertyId, serialOrId) => {
    setCustomerProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          return {
            ...p,
            installedDevices: (p.installedDevices || []).filter(
              (d) => d.serial !== serialOrId && d.id !== serialOrId
            ),
          };
        }
        return p;
      })
    );
  }, []);

  // Reset demo data to pristine baseline (Evaluator utility)
  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    setCurrentUser(null);
    setCustomerProperties(INITIAL_PROPERTIES);
    setAppointments(INITIAL_APPOINTMENTS);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      userRole: currentUser?.role || null,
      activeCustomerProperty,
      activeCustomerHome, // alias
      customerProperties,
      customerHomes, // alias
      appointments,
      marketplaceHardware: HARDWARE_CATALOGUE,
      loginCustomer,
      loginTechnician,
      loginAsDemoUser,
      signupAndRegisterProperty,
      logout,
      resetDemoData,
      updatePropertyRooms,
      toggleApplianceState,
      addApplianceToRoom,
      requestDeviceInstallation,
      updateHomeWorkflowStage,
      attachDeviceToHome,
      detachDeviceFromHome,
    }),
    [
      currentUser,
      activeCustomerProperty,
      activeCustomerHome,
      customerProperties,
      customerHomes,
      appointments,
      loginCustomer,
      loginTechnician,
      loginAsDemoUser,
      signupAndRegisterProperty,
      logout,
      resetDemoData,
      updatePropertyRooms,
      toggleApplianceState,
      addApplianceToRoom,
      requestDeviceInstallation,
      updateHomeWorkflowStage,
      attachDeviceToHome,
      detachDeviceFromHome,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
