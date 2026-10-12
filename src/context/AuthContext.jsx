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
    compatibility: 'Single-Phase (230V) & 3-Phase (415V) Residential Distribution Boards. Fits 4 standard DIN rail module slots.',
    installationRequirement: 'Requires on-site electrical installation by certified 5AMPERE technician. 15-minute panel shutdown required.',
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
    installationRequirement: 'Customer DIY or technician setup during visit.',
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
    specs: {
      detectionRange: '110° wide-angle, up to 7 meters radius',
      luxRange: '0–2,000 Lux daylight sensing',
      batteryLife: '24+ months on coin battery',
      latency: '&lt; 200ms trigger response time',
    },
    inStock: true,
  },
  {
    id: 'hw-3phase-meter',
    name: '3-Phase 63A Bi-Directional DIN Submeter',
    category: 'Whole-Panel Submetering',
    model: '5AMP-MTR-3PH-63A',
    icon: 'Gauge',
    description: 'Revenue-grade bidirectional multi-function meter for large independent houses and solar net-metered installations. Measures import/export per phase.',
    priceINR: 6499,
    compatibility: '3-Phase 4-Wire (415V/240V). Direct connection up to 63A per phase.',
    installationRequirement: 'Requires qualified electrical technician. 30-minute main shutdown.',
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
// 2. MOCK DEMO ACCOUNTS & CUSTOMER HOMES
// ============================================================================
const DEMO_CUSTOMER_USER = {
  id: 'cust-arpita',
  name: 'Arpita Sharma',
  email: 'arpita@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  title: 'Homeowner',
  home: {
    id: 'home-arpita',
    address: 'Flat 402, Tower B, Supertech Eco Village',
    locality: 'Sector 1, Greater Noida West, UP',
    homeType: 'apartment',
    floors: 1,
    discom: 'UPPCL (PVVNL Noida)',
    sanctionedLoadKw: 5.0,
    meterNumber: 'UP-7849201',
    installationStatus: 'active', // 'active' (configured & operating)
    installedDevices: [
      { id: 'hw-gateway-din', installedDate: '2026-08-15', serial: '5AMP-GW-882194', status: 'Online' },
      { id: 'hw-ct-100a', installedDate: '2026-08-15', serial: '5AMP-CT-00124', status: 'Calibrated' },
      { id: 'hw-contactor-32a', installedDate: '2026-08-15', serial: '5AMP-RLY-99201', circuit: 'Living Room 1.5T AC', status: 'Online' },
      { id: 'hw-inline-relay-16a', installedDate: '2026-08-15', serial: '5AMP-MOD-44120', circuit: 'Master Geyser (2kW)', status: 'Online' },
    ],
    requestedDevices: [
      {
        requestId: 'req-cust-01',
        deviceId: 'hw-smart-plug-16a',
        requestedDate: '2026-10-10',
        preferredSlot: 'Saturday, 11:00 AM - 01:00 PM',
        status: 'visit_scheduled', // pending technician visit
        notes: 'Install on heavy microwave socket in kitchen.',
      },
    ],
    registeredAppliances: [
      '1.5T Inverter AC (Living Room)',
      '1.0T Split AC (Master Bedroom)',
      '25L Storage Geyser (Bathroom 1)',
      'Double Door Refrigerator (Kitchen)',
      'Front Load Washing Machine',
      'Water Purifier & RO Unit',
    ],
  },
};

const DEMO_TECHNICIAN_USER = {
  id: 'tech-rajesh',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@5ampere.com',
  phone: '+91 98112 34567',
  role: 'technician',
  title: 'Senior Field Systems Specialist',
  badgeNumber: '5AMP-TECH-042',
  assignedZone: 'Gautam Buddha Nagar (Noida & Greater Noida)',
  certifications: ['Certified Smart Grid Wireman (CEA)', 'BEE Energy Auditor (Associate)'],
};

// Initial list of customer homes managed in the company queue
const INITIAL_CUSTOMER_HOMES = [
  {
    id: 'home-arpita',
    customerName: 'Arpita Sharma',
    phone: '+91 98765 43210',
    email: 'arpita@example.com',
    address: 'Flat 402, Tower B, Supertech Eco Village',
    locality: 'Sector 1, Greater Noida West, UP',
    homeType: 'apartment',
    floors: 1,
    discom: 'UPPCL (PVVNL Noida)',
    sanctionedLoadKw: 5.0,
    meterNumber: 'UP-7849201',
    installationStatus: 'active',
    installedDevices: [
      { id: 'hw-gateway-din', installedDate: '2026-08-15', serial: '5AMP-GW-882194', status: 'Online' },
      { id: 'hw-ct-100a', installedDate: '2026-08-15', serial: '5AMP-CT-00124', status: 'Calibrated' },
      { id: 'hw-contactor-32a', installedDate: '2026-08-15', serial: '5AMP-RLY-99201', circuit: 'Living Room AC', status: 'Online' },
      { id: 'hw-inline-relay-16a', installedDate: '2026-08-15', serial: '5AMP-MOD-44120', circuit: 'Master Geyser', status: 'Online' },
    ],
    requestedDevices: [
      {
        requestId: 'req-cust-01',
        deviceId: 'hw-smart-plug-16a',
        requestedDate: '2026-10-10',
        preferredSlot: 'Saturday, 11:00 AM - 01:00 PM',
        status: 'visit_scheduled',
        notes: 'Install on heavy microwave socket in kitchen.',
      },
    ],
    registeredAppliances: ['1.5T Inverter AC', '1.0T Split AC', '25L Geyser', 'Double Door Fridge', 'Washing Machine'],
    serviceRequestsCount: 1,
    lastVisitDate: '2026-08-15',
  },
  {
    id: 'home-vikram',
    customerName: 'Vikram Malhotra',
    phone: '+91 99201 12345',
    email: 'vikram.malhotra@gmail.com',
    address: 'Plot 18, Block C, Grand Omaxe',
    locality: 'Sector 93B, Noida, UP',
    homeType: 'independent_house',
    floors: 2,
    discom: 'UPPCL (PVVNL Noida)',
    sanctionedLoadKw: 10.0,
    meterNumber: 'UP-9938104',
    installationStatus: 'pending_assessment',
    installedDevices: [],
    requestedDevices: [
      {
        requestId: 'req-vikram-01',
        deviceId: 'hw-gateway-din',
        requestedDate: '2026-10-12',
        preferredSlot: 'Tomorrow, 10:00 AM - 12:00 PM',
        status: 'visit_scheduled',
        notes: 'New 2-floor villa. Customer wants whole-house monitoring and AC load shedding.',
      },
      {
        requestId: 'req-vikram-02',
        deviceId: 'hw-3phase-meter',
        requestedDate: '2026-10-12',
        preferredSlot: 'Tomorrow, 10:00 AM - 12:00 PM',
        status: 'visit_scheduled',
        notes: '3-Phase meter integration required at main incomer.',
      },
    ],
    registeredAppliances: ['2.0T Central AC', '1.5T AC (3 Units)', 'Solar Inverter (5kW)', 'Water Pump 2HP', 'Deep Freezer'],
    serviceRequestsCount: 2,
    lastVisitDate: 'Pending First Visit',
  },
  {
    id: 'home-priya',
    customerName: 'Priya Sundaram',
    phone: '+91 98401 77654',
    email: 'priya.sundaram@outlook.com',
    address: 'Tower 4, Apt 804, Express Greens',
    locality: 'Vaishali Sector 4, Ghaziabad, UP',
    homeType: 'apartment',
    floors: 1,
    discom: 'UPPCL (PVVNL Ghaziabad)',
    sanctionedLoadKw: 4.0,
    meterNumber: 'UP-6649102',
    installationStatus: 'installation_in_progress',
    installedDevices: [
      { id: 'hw-gateway-din', installedDate: '2026-10-11', serial: '5AMP-GW-771920', status: 'Mounted' },
      { id: 'hw-ct-100a', installedDate: '2026-10-11', serial: '5AMP-CT-33910', status: 'Calibrating' },
    ],
    requestedDevices: [
      {
        requestId: 'req-priya-01',
        deviceId: 'hw-contactor-32a',
        requestedDate: '2026-10-09',
        preferredSlot: 'Today, 03:00 PM - 05:00 PM',
        status: 'installation_in_progress',
        notes: 'Relay contactor for 15L geyser shed control.',
      },
    ],
    registeredAppliances: ['1.5T Split AC', '15L Storage Geyser', 'Induction Cooktop', 'Direct Cool Refrigerator'],
    serviceRequestsCount: 1,
    lastVisitDate: '2026-10-11',
  },
  {
    id: 'home-amit',
    customerName: 'Amit Verma',
    phone: '+91 97110 55432',
    email: 'amit.verma@corptech.in',
    address: 'Villa 44, Palm Grove Estates',
    locality: 'DLF Phase 5, Gurugram, Haryana',
    homeType: 'independent_house',
    floors: 3,
    discom: 'DHBVN Gurugram',
    sanctionedLoadKw: 12.0,
    meterNumber: 'HR-8820194',
    installationStatus: 'configured',
    installedDevices: [
      { id: 'hw-gateway-din', installedDate: '2026-10-08', serial: '5AMP-GW-551029', status: 'Online' },
      { id: 'hw-3phase-meter', installedDate: '2026-10-08', serial: '5AMP-MTR-11928', status: 'Online' },
      { id: 'hw-contactor-32a', installedDate: '2026-10-08', serial: '5AMP-RLY-44810', circuit: 'HVAC Chiller', status: 'Online' },
      { id: 'hw-occupancy-sensor', installedDate: '2026-10-08', serial: '5AMP-SNS-99201', circuit: 'Home Office', status: 'Online' },
    ],
    requestedDevices: [],
    registeredAppliances: ['Ducted AC System', 'Heat Pump Water Heater', 'EV Wallbox 7.4kW', 'Wine Cooler'],
    serviceRequestsCount: 0,
    lastVisitDate: '2026-10-08',
  },
  {
    id: 'home-sunita',
    customerName: 'Sunita Rao',
    phone: '+91 98109 88321',
    email: 'sunita.rao@delhiedu.org',
    address: 'Pocket B, Flat 112, DDA SFS Flats',
    locality: 'Dwarka Sector 11, New Delhi',
    homeType: 'apartment',
    floors: 1,
    discom: 'BSES Rajdhani (BRPL)',
    sanctionedLoadKw: 5.0,
    meterNumber: 'DL-5529103',
    installationStatus: 'completed',
    installedDevices: [
      { id: 'hw-gateway-din', installedDate: '2026-09-20', serial: '5AMP-GW-330192', status: 'Online' },
      { id: 'hw-ct-100a', installedDate: '2026-09-20', serial: '5AMP-CT-44021', status: 'Calibrated' },
      { id: 'hw-inline-relay-16a', installedDate: '2026-09-20', serial: '5AMP-MOD-22910', circuit: 'Kitchen Geyser', status: 'Online' },
    ],
    requestedDevices: [],
    registeredAppliances: ['1.5T 5-Star AC', '25L Geyser', 'Side-by-Side Refrigerator', 'Microwave 1200W'],
    serviceRequestsCount: 0,
    lastVisitDate: '2026-09-20',
  },
];

// Initial appointments queue for technician
const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-01',
    homeId: 'home-vikram',
    customerName: 'Vikram Malhotra',
    phone: '+91 99201 12345',
    address: 'Plot 18, Block C, Grand Omaxe, Sector 93B, Noida',
    scheduledTime: 'Tomorrow, 10:00 AM – 12:00 PM',
    type: 'Site Assessment & DIN Gateway Installation',
    status: 'visit_scheduled',
    priority: 'High',
    scope: 'Assess 10kW 3-phase incoming panel. Check DIN rail space for EdgeCore + 3Phase meter.',
    technicianId: 'tech-rajesh',
  },
  {
    id: 'apt-02',
    homeId: 'home-priya',
    customerName: 'Priya Sundaram',
    phone: '+91 98401 77654',
    address: 'Tower 4, Apt 804, Express Greens, Vaishali Sector 4, Ghaziabad',
    scheduledTime: 'Today, 03:00 PM – 05:00 PM',
    type: 'Hardware Installation & Contactor Wiring',
    status: 'installation_in_progress',
    priority: 'Normal',
    scope: 'Complete 32A smart contactor relay wiring for 15L geyser load shed circuit.',
    technicianId: 'tech-rajesh',
  },
  {
    id: 'apt-03',
    homeId: 'home-arpita',
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
// 3. AUTH & OPERATIONS CONTEXT DEFINITION
// ============================================================================
const AuthContext = createContext(null);

const STORAGE_KEYS = {
  USER: '5ampere_auth_user',
  HOMES: '5ampere_customer_homes',
  APPOINTMENTS: '5ampere_appointments',
};

export function AuthProvider({ children }) {
  // Current logged in user (defaults to Customer Arpita Sharma for immediate preview)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEMO_CUSTOMER_USER;
  });

  // Customer homes state (managed by staff/technician and customer actions)
  const [customerHomes, setCustomerHomes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOMES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_CUSTOMER_HOMES;
  });

  // Appointments state
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
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

  // Persist homes changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HOMES, JSON.stringify(customerHomes));
    } catch (e) {}
  }, [customerHomes]);

  // Persist appointments changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {}
  }, [appointments]);

  // Current user's active home object (if customer)
  const activeCustomerHome = useMemo(() => {
    if (!currentUser || currentUser.role !== 'customer') return null;
    const match = customerHomes.find((h) => h.id === currentUser.home?.id);
    return match || currentUser.home;
  }, [currentUser, customerHomes]);

  // --------------------------------------------------------------------------
  // AUTH ACTIONS
  // --------------------------------------------------------------------------
  const loginCustomer = useCallback((email, password) => {
    // Demo mock auth: match or create demo session
    const matchedHome = customerHomes.find((h) => h.email?.toLowerCase() === email?.toLowerCase()) || customerHomes[0];
    const userObj = {
      id: matchedHome.id ? `cust-${matchedHome.id}` : 'cust-demo',
      name: matchedHome.customerName || 'Demo Customer',
      email: email || 'customer@example.com',
      phone: matchedHome.phone || '+91 98765 43210',
      role: 'customer',
      title: 'Homeowner',
      home: matchedHome,
    };
    setCurrentUser(userObj);
    return { success: true, user: userObj };
  }, [customerHomes]);

  const loginTechnician = useCallback((email, password) => {
    const userObj = DEMO_TECHNICIAN_USER;
    setCurrentUser(userObj);
    return { success: true, user: userObj };
  }, []);

  const signupCustomer = useCallback((onboardingData) => {
    const newHomeId = `home-cust-${Date.now().toString().slice(-4)}`;
    const newHome = {
      id: newHomeId,
      customerName: onboardingData.fullName || 'New Homeowner',
      phone: onboardingData.phone || '+91 98000 00000',
      email: onboardingData.email || 'customer@example.com',
      address: onboardingData.address || 'Address pending verification',
      locality: onboardingData.locality || 'Locality',
      homeType: onboardingData.homeType || 'apartment',
      floors: Number(onboardingData.floors) || 1,
      discom: onboardingData.discom || 'UPPCL Urban Domestic',
      sanctionedLoadKw: Number(onboardingData.sanctionedLoadKw) || 5.0,
      meterNumber: onboardingData.meterNumber || `GEN-${Math.floor(100000 + Math.random() * 900000)}`,
      installationStatus: 'pending_assessment', // new customer is pending technician visit
      installedDevices: [],
      requestedDevices: [
        {
          requestId: `req-${Date.now().toString().slice(-5)}`,
          deviceId: 'hw-gateway-din',
          requestedDate: new Date().toISOString().split('T')[0],
          preferredSlot: onboardingData.preferredSlot || 'Preferred Morning Slot (10 AM - 1 PM)',
          status: 'visit_scheduled',
          notes: onboardingData.installationNotes || 'Initial electrical setup assessment and EdgeCore Gateway installation.',
        },
      ],
      registeredAppliances: onboardingData.appliances || ['Air Conditioner', 'Geyser', 'Refrigerator'],
      serviceRequestsCount: 1,
      lastVisitDate: 'Pending Assessment',
      createdDate: new Date().toISOString(),
    };

    const newCustomerUser = {
      id: `cust-${Date.now().toString().slice(-4)}`,
      name: newHome.customerName,
      email: newHome.email,
      phone: newHome.phone,
      role: 'customer',
      title: 'Homeowner',
      home: newHome,
    };

    // Add to homes directory
    setCustomerHomes((prev) => [newHome, ...prev]);

    // Create corresponding appointment for staff
    const newAppointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      homeId: newHome.id,
      customerName: newHome.customerName,
      phone: newHome.phone,
      address: `${newHome.address}, ${newHome.locality}`,
      scheduledTime: onboardingData.preferredSlot || 'Scheduled within 48 Hours',
      type: 'Initial Electrical Assessment & Installation',
      status: 'visit_scheduled',
      priority: 'High',
      scope: 'Assess electrical distribution board, calculate phase balance, and install 5AMPERE EdgeCore gateway.',
      technicianId: 'tech-rajesh',
    };
    setAppointments((prev) => [newAppointment, ...prev]);

    setCurrentUser(newCustomerUser);
    return { success: true, user: newCustomerUser, home: newHome };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const switchRole = useCallback((targetRole) => {
    if (targetRole === 'technician') {
      setCurrentUser(DEMO_TECHNICIAN_USER);
    } else {
      setCurrentUser(DEMO_CUSTOMER_USER);
    }
  }, []);

  // --------------------------------------------------------------------------
  // CUSTOMER WORKFLOW: Request New Device / Add to Home
  // --------------------------------------------------------------------------
  const requestDeviceInstallation = useCallback((deviceId, preferredSlot, notes) => {
    if (!currentUser || currentUser.role !== 'customer') return { success: false };

    const hardware = HARDWARE_CATALOGUE.find((h) => h.id === deviceId);
    if (!hardware) return { success: false, message: 'Hardware not found' };

    const newRequestId = `req-${Date.now().toString().slice(-5)}`;
    const newRequest = {
      requestId: newRequestId,
      deviceId: hardware.id,
      deviceName: hardware.name,
      requestedDate: new Date().toISOString().split('T')[0],
      preferredSlot: preferredSlot || 'Weekend Slot (10 AM - 1 PM)',
      status: 'visit_scheduled',
      notes: notes || 'Installation request submitted by customer.',
    };

    // Update customer home in state
    setCustomerHomes((prev) =>
      prev.map((home) => {
        if (home.id === activeCustomerHome?.id) {
          const updatedRequests = [newRequest, ...(home.requestedDevices || [])];
          return {
            ...home,
            requestedDevices: updatedRequests,
            serviceRequestsCount: updatedRequests.length,
          };
        }
        return home;
      })
    );

    // Also update currentUser copy if needed
    setCurrentUser((prev) => {
      if (!prev || !prev.home) return prev;
      return {
        ...prev,
        home: {
          ...prev.home,
          requestedDevices: [newRequest, ...(prev.home.requestedDevices || [])],
        },
      };
    });

    // Create technician appointment
    const newAppointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      homeId: activeCustomerHome?.id || 'home-arpita',
      customerName: currentUser.name,
      phone: currentUser.phone,
      address: activeCustomerHome ? `${activeCustomerHome.address}, ${activeCustomerHome.locality}` : 'Noida',
      scheduledTime: preferredSlot || 'Next available slot',
      type: `Hardware Addition: ${hardware.name}`,
      status: 'visit_scheduled',
      priority: 'Normal',
      scope: `Deliver and configure ${hardware.name}. Verify circuit compatibility and calibrate edge telemetry.`,
      technicianId: 'tech-rajesh',
    };
    setAppointments((prev) => [newAppointment, ...prev]);

    return { success: true, requestId: newRequestId, hardware };
  }, [currentUser, activeCustomerHome]);

  // --------------------------------------------------------------------------
  // TECHNICIAN WORKFLOW: Manage Home Configuration & Workflow Stages
  // --------------------------------------------------------------------------
  const updateHomeWorkflowStage = useCallback((homeId, newStage, technicianNotes) => {
    setCustomerHomes((prev) =>
      prev.map((h) => {
        if (h.id === homeId) {
          return {
            ...h,
            installationStatus: newStage,
            lastVisitDate: new Date().toISOString().split('T')[0],
            technicianNotes: technicianNotes || h.technicianNotes,
          };
        }
        return h;
      })
    );

    // Update appointments status as well
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.homeId === homeId) {
          return { ...apt, status: newStage };
        }
        return apt;
      })
    );
  }, []);

  const attachDeviceToHome = useCallback((homeId, deviceId, circuitName) => {
    const hw = HARDWARE_CATALOGUE.find((h) => h.id === deviceId);
    if (!hw) return;

    setCustomerHomes((prev) =>
      prev.map((h) => {
        if (h.id === homeId) {
          const serial = `5AMP-${hw.model?.split('-')[1] || 'DEV'}-${Math.floor(100000 + Math.random() * 900000)}`;
          const newInstalledItem = {
            id: hw.id,
            installedDate: new Date().toISOString().split('T')[0],
            serial,
            circuit: circuitName || 'Main Distribution Circuit',
            status: 'Configured & Online',
          };

          // Remove from requested if it was pending
          const filteredRequested = (h.requestedDevices || []).filter((r) => r.deviceId !== deviceId);

          return {
            ...h,
            installedDevices: [...(h.installedDevices || []), newInstalledItem],
            requestedDevices: filteredRequested,
            serviceRequestsCount: filteredRequested.length,
          };
        }
        return h;
      })
    );
  }, []);

  const detachDeviceFromHome = useCallback((homeId, serialOrDeviceId) => {
    setCustomerHomes((prev) =>
      prev.map((h) => {
        if (h.id === homeId) {
          return {
            ...h,
            installedDevices: (h.installedDevices || []).filter(
              (d) => d.serial !== serialOrDeviceId && d.id !== serialOrDeviceId
            ),
          };
        }
        return h;
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      userRole: currentUser?.role || null,
      activeCustomerHome,
      customerHomes,
      appointments,
      marketplaceHardware: HARDWARE_CATALOGUE,
      loginCustomer,
      loginTechnician,
      signupCustomer,
      logout,
      switchRole,
      requestDeviceInstallation,
      updateHomeWorkflowStage,
      attachDeviceToHome,
      detachDeviceFromHome,
    }),
    [
      currentUser,
      activeCustomerHome,
      customerHomes,
      appointments,
      loginCustomer,
      loginTechnician,
      signupCustomer,
      logout,
      switchRole,
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
