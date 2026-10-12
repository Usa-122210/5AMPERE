import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  Home,
  School,
  Building,
  Factory,
  User,
  Zap,
  Wrench,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Plus,
  Trash2,
  Cpu,
  Info,
  Radio,
  Sliders,
} from 'lucide-react';
import { BrandWordmark } from '../../components/brand/BrandWordmark';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { EnergyFlowBackground } from '../../components/motion/EnergyFlowBackground';
import { useAuth, HARDWARE_CATALOGUE } from '../../context/AuthContext';

const STEPS = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Property Type' },
  { id: 3, label: 'Profile' },
  { id: 4, label: 'Rooms & Loads' },
  { id: 5, label: 'Hardware' },
  { id: 6, label: 'Review' },
];

export function SignupOnboardingPage() {
  const navigate = useNavigate();
  const { signupAndRegisterProperty } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // --------------------------------------------------------------------------
  // MASTER ONBOARDING FORM STATE
  // --------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    // Step 1: Customer Account
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 2: Property Type
    propertyType: 'home', // 'home' | 'school' | 'office' | 'industry'

    // Step 3: Property Details
    propertyName: '',
    address: '',
    locality: '',
    dwellingType: 'apartment', // Home: 'apartment' | 'independent_house' | 'villa'
    buildingType: 'commercial', // Office: 'it_park' | 'corporate' | 'coworking'
    industrySector: 'machining', // Industry: 'machining' | 'textiles' | 'plastics' | 'food' | 'chemicals'
    floors: 1,
    roomsCount: 3,
    discom: 'UPPCL Urban Domestic (PVVNL Noida)',
    sanctionedLoadKw: 5.0,
    approxMonthlyBill: 4200,
    monitoringMode: 'both', // 'monitoring_only' | 'appliance_control' | 'both'
    energyGoals: ['reduce_bills', 'identify_high_loads'],

    // Step 4: Organization Mode & Topology
    organizationMode: 'room_wise', // 'room_wise' | 'circuit_wise' | 'whole_property'

    // Dynamic Rooms & Appliances for Room-Wise Setup
    rooms: [
      {
        id: 'room-1',
        name: 'Living Room',
        type: 'living_room',
        appliances: [
          { id: 'app-1', name: '1.5T Inverter AC', drawKw: 1.45, active: true, controlEnabled: true, priority: 'High', circuit: '32A Contactor' },
          { id: 'app-2', name: 'Ceiling Fans & Smart Lights', drawKw: 0.12, active: true, controlEnabled: false, priority: 'Standard', circuit: 'Switchboard' },
        ],
      },
      {
        id: 'room-2',
        name: 'Master Bedroom',
        type: 'bedroom',
        appliances: [
          { id: 'app-3', name: '1.0T Split AC', drawKw: 0.95, active: false, controlEnabled: true, priority: 'High', circuit: '32A Contactor' },
        ],
      },
      {
        id: 'room-3',
        name: 'Kitchen',
        type: 'kitchen',
        appliances: [
          { id: 'app-4', name: 'Double Door Refrigerator', drawKw: 0.18, active: true, controlEnabled: false, priority: 'Critical', circuit: '16A Dedicated Socket' },
          { id: 'app-5', name: 'Convection Microwave', drawKw: 1.20, active: false, controlEnabled: true, priority: 'Standard', circuit: '16A Plug' },
        ],
      },
    ],

    // Circuits for Circuit-wise Setup
    circuits: [
      { id: 'circ-1', name: 'Master HVAC & AC Busbar', drawKw: 3.5, controlEnabled: true, priority: 'High' },
      { id: 'circ-2', name: 'Water Heating & Geysers', drawKw: 2.0, controlEnabled: true, priority: 'Standard' },
      { id: 'circ-3', name: 'Continuous Refrigeration Socket', drawKw: 0.2, controlEnabled: false, priority: 'Critical' },
    ],

    // Step 5: Hardware & Installation Package
    requestedHardware: [
      HARDWARE_CATALOGUE[0], // EdgeCore DIN Gateway
      HARDWARE_CATALOGUE[1], // 100A CT sensor
    ],
    ownedDevices: [],
    preferredSlot: 'Saturday, 10:00 AM – 01:00 PM',
    installationNotes: 'Main distribution board is next to main entrance. Please call before arrival.',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  // Helper: toggle energy goal
  const toggleGoal = (goalKey) => {
    setFormData((prev) => {
      const exists = prev.energyGoals.includes(goalKey);
      return {
        ...prev,
        energyGoals: exists
          ? prev.energyGoals.filter((g) => g !== goalKey)
          : [...prev.energyGoals, goalKey],
      };
    });
  };

  // Helper: toggle requested hardware item
  const toggleHardware = (hw) => {
    setFormData((prev) => {
      const exists = prev.requestedHardware.some((h) => h.id === hw.id);
      return {
        ...prev,
        requestedHardware: exists
          ? prev.requestedHardware.filter((h) => h.id !== hw.id)
          : [...prev.requestedHardware, hw],
      };
    });
  };

  // Helper: add custom room
  const [customRoomName, setCustomRoomName] = useState('');
  const handleAddRoom = () => {
    if (!customRoomName.trim()) return;
    const newRoom = {
      id: `room-${Date.now().toString().slice(-4)}`,
      name: customRoomName.trim(),
      type: 'custom',
      appliances: [
        { id: `app-${Date.now()}`, name: 'General Lighting & Sockets', drawKw: 0.15, active: true, controlEnabled: false, priority: 'Standard', circuit: 'Branch MCB' },
      ],
    };
    setFormData((prev) => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    setCustomRoomName('');
  };

  const handleRemoveRoom = (roomId) => {
    setFormData((prev) => ({ ...prev, rooms: prev.rooms.filter((r) => r.id !== roomId) }));
  };

  // Step Validations
  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.fullName.trim()) return 'Please enter your full name.';
      if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address.';
      if (!formData.phone.trim() || formData.phone.length < 10) return 'Please enter a 10-digit mobile number.';
      if (!formData.password || formData.password.length < 6) return 'Password must be at least 6 characters.';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    }
    if (step === 3) {
      if (!formData.address.trim()) return 'Please enter the street address.';
      if (!formData.locality.trim()) return 'Please enter the city or locality.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep(currentStep);
    if (err) {
      setError(err);
      return;
    }
    setError('');

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Step 6 completed: submit and immediately enter dashboard!
      signupAndRegisterProperty(formData);
      navigate('/');
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <EnergyFlowBackground intensity="subtle" />

      {/* Header */}
      <header className="relative z-10 w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[var(--color-text-secondary)] hidden sm:inline">
            Already registered?
          </span>
          <Link to="/login" className="font-bold text-[var(--color-accent)] hover:underline">
            Sign In →
          </Link>
        </div>
      </header>

      {/* Main Wizard */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-2xl space-y-4">
          {/* Progress Indicator */}
          <div className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
            <div className="grid grid-cols-6 gap-1.5">
              {STEPS.map((s) => {
                const isActive = currentStep === s.id;
                const isDone = currentStep > s.id;

                return (
                  <div
                    key={s.id}
                    className={`flex flex-col items-center text-center p-1.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold'
                        : isDone
                        ? 'text-[var(--color-success)]'
                        : 'text-[var(--color-text-muted)] opacity-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono mb-1 ${
                        isActive
                          ? 'bg-[var(--color-accent)] text-white'
                          : isDone
                          ? 'bg-[var(--color-success)] text-white'
                          : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {isDone ? <Check size={12} /> : s.id}
                    </div>
                    <span className="text-[10px] font-semibold truncate hidden sm:block">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: ACCOUNT DETAILS */}
          {currentStep === 1 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 1 of 6 · Customer Account
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  Create Your 5AMPERE Account
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Enter your contact credentials to register your profile and access your property workspace.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="e.g. Vikram Malhotra / Dr. Alok Nath"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="e.g. vikram@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="e.g. +91 99201 12345"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-3 py-2 pr-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Confirm Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                      required
                    />
                  </div>
                </div>
              </div>
            </Surface>
          )}

          {/* STEP 2: PROPERTY TYPE SELECTION */}
          {currentStep === 2 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 2 of 6 · Property Selection
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  What Type of Property Do You Want to Monitor?
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Choose the property category. 5AMPERE will customize your circuit options, breaker limits, and topology accordingly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    id: 'home',
                    icon: Home,
                    title: 'Home / Residential',
                    desc: 'Apartments, independent houses, kothis, and villas with room-wise & appliance monitoring.',
                  },
                  {
                    id: 'school',
                    icon: School,
                    title: 'School / Institution',
                    desc: 'Educational campuses, classroom blocks, science & computer labs, auditorium, and water pumps.',
                  },
                  {
                    id: 'office',
                    icon: Building,
                    title: 'Office / Commercial',
                    desc: 'Corporate offices, IT parks, server rooms, workstation floors, cafeteria, and central HVAC.',
                  },
                  {
                    id: 'industry',
                    icon: Factory,
                    title: 'Industry / Manufacturing',
                    desc: 'Industrial plants, machine shops, CNC milling, screw compressors, furnaces, and 3-phase HT panels.',
                  },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.propertyType === type.id;

                  return (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => updateField('propertyType', type.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] shadow-xs'
                          : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)]">
                          <Icon size={18} />
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-xs">
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">{type.title}</h3>
                      <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">{type.desc}</p>
                    </button>
                  );
                })}
              </div>
            </Surface>
          )}

          {/* STEP 3: PROPERTY DETAILS (ADAPTS DYNAMICALLY BY TYPE) */}
          {currentStep === 3 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 3 of 6 · {formData.propertyType.toUpperCase()} Profile
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  {formData.propertyType === 'home' && 'Home Address & Electrical Connection'}
                  {formData.propertyType === 'school' && 'Campus Infrastructure & Sanctioned Load'}
                  {formData.propertyType === 'office' && 'Commercial Facility & Operating Parameters'}
                  {formData.propertyType === 'industry' && 'Industrial Plant & HT Substation Details'}
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Enter your address and electricity connection details to configure billing rates and transformer capacities.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                    {formData.propertyType === 'home' ? 'Home / Property Name' : 'Facility / Organization Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.propertyName}
                    onChange={(e) => updateField('propertyName', e.target.value)}
                    placeholder={
                      formData.propertyType === 'home'
                        ? 'e.g. Flat 402, Eco Village'
                        : formData.propertyType === 'school'
                        ? 'e.g. Greenwood International Campus'
                        : formData.propertyType === 'office'
                        ? 'e.g. TechCorp Cyber Hub Floor 5'
                        : 'e.g. Apex Precision Forgings Unit 1'
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Street Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="e.g. Plot 18, Block C / Institutional Area"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">City / Locality</label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => updateField('locality', e.target.value)}
                      placeholder="e.g. Noida / Gurugram / Delhi"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                      required
                    />
                  </div>
                </div>

                {/* Sub-type specifics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {formData.propertyType === 'home' && (
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Dwelling Type</label>
                      <select
                        value={formData.dwellingType}
                        onChange={(e) => updateField('dwellingType', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none"
                      >
                        <option value="apartment">Apartment / High-rise</option>
                        <option value="independent_house">Independent House / Kothi</option>
                        <option value="villa">Gated Villa</option>
                      </select>
                    </div>
                  )}

                  {formData.propertyType === 'office' && (
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Office Type</label>
                      <select
                        value={formData.buildingType}
                        onChange={(e) => updateField('buildingType', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none"
                      >
                        <option value="commercial">IT Park / Commercial Floor</option>
                        <option value="corporate">Corporate Headquarters</option>
                        <option value="coworking">Co-working Space</option>
                      </select>
                    </div>
                  )}

                  {formData.propertyType === 'industry' && (
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Industry Sector</label>
                      <select
                        value={formData.industrySector}
                        onChange={(e) => updateField('industrySector', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none"
                      >
                        <option value="machining">CNC &amp; Machine Tools</option>
                        <option value="plastics">Plastics &amp; Molding</option>
                        <option value="textiles">Textiles &amp; Spinning</option>
                        <option value="food">Food Processing &amp; Cold Chain</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Sanctioned Load (kW / kVA)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={formData.sanctionedLoadKw}
                      onChange={(e) => updateField('sanctionedLoadKw', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Approx Monthly Bill (₹)</label>
                    <input
                      type="number"
                      step="500"
                      min="500"
                      value={formData.approxMonthlyBill}
                      onChange={(e) => updateField('approxMonthlyBill', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">Electricity Provider / DISCOM</label>
                  <select
                    value={formData.discom}
                    onChange={(e) => updateField('discom', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none"
                  >
                    <option value="UPPCL Urban Domestic (PVVNL Noida)">UPPCL (PVVNL Noida)</option>
                    <option value="UPPCL Urban Domestic (PVVNL Ghaziabad)">UPPCL (Ghaziabad)</option>
                    <option value="BSES Rajdhani (BRPL Delhi)">BSES Rajdhani (BRPL Delhi)</option>
                    <option value="Tata Power Delhi (TPDDL)">Tata Power Delhi (TPDDL)</option>
                    <option value="DHBVN Gurugram Commercial/Domestic">DHBVN Gurugram</option>
                  </select>
                </div>

                {/* Energy Goals Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">Primary Energy Goals:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'reduce_bills', label: 'Reduce Electricity Bill', desc: 'Cut peak slab charges by 15–25%' },
                      { id: 'identify_high_loads', label: 'Identify Vampire/Phantom Loads', desc: 'Find appliances wasting power idle' },
                      { id: 'automate_appliances', label: 'Appliance Control & Automation', desc: 'Shed non-critical loads during peak' },
                      { id: 'solar_readiness', label: 'Solar Rooftop Readiness', desc: 'Assess baseline daytime self-consumption' },
                    ].map((g) => {
                      const isSelected = formData.energyGoals.includes(g.id);
                      return (
                        <button
                          type="button"
                          key={g.id}
                          onClick={() => toggleGoal(g.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)] font-semibold'
                              : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                          }`}
                        >
                          <span className="text-xs font-bold block">{g.label}</span>
                          <span className="text-[10px] text-[var(--color-text-muted)] block">{g.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Surface>
          )}

          {/* STEP 4: ROOM & APPLIANCE / CIRCUIT TOPOLOGY */}
          {currentStep === 4 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 4 of 6 · Rooms &amp; Electrical Circuits
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  How Do You Want to Organise Your Monitoring?
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Choose room-wise grouping, direct electrical circuits, or whole-property monitoring first.
                </p>
              </div>

              {/* Organisation Mode Selector (Option A, B, C) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {[
                  {
                    id: 'room_wise',
                    title: 'Option A: Room-Wise',
                    desc: 'Group by Living Room, Bedrooms, Kitchen, etc.',
                  },
                  {
                    id: 'circuit_wise',
                    title: 'Option B: Circuit-Wise',
                    desc: 'Direct AC, Geyser & heavy lines without rooms.',
                  },
                  {
                    id: 'whole_property',
                    title: 'Option C: Whole-Property',
                    desc: 'Main incomer baseline first; map rooms later.',
                  },
                ].map((mode) => (
                  <button
                    type="button"
                    key={mode.id}
                    onClick={() => updateField('organizationMode', mode.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.organizationMode === mode.id
                        ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                    }`}
                  >
                    <span className="text-xs font-bold block">{mode.title}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)] block mt-0.5">{mode.desc}</span>
                  </button>
                ))}
              </div>

              {/* Topology Editor based on selected mode */}
              {formData.organizationMode === 'room_wise' && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-text)]">
                      Configured Rooms &amp; Assigned Appliances:
                    </span>
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                      {formData.rooms.length} Rooms
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {formData.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--color-text)]">{room.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(room.id)}
                            className="text-[var(--color-text-muted)] hover:text-red-600 text-xs cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(room.appliances || []).map((app) => (
                            <span
                              key={app.id}
                              className="text-[10px] px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                            >
                              {app.name} ({(app.drawKw * 1000).toFixed(0)}W)
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Room bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customRoomName}
                      onChange={(e) => setCustomRoomName(e.target.value)}
                      placeholder="Add another room (e.g. Study, Kids Room, Balcony)..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <Button variant="secondary" size="sm" onClick={handleAddRoom} className="text-xs shrink-0">
                      <Plus size={12} />
                      <span>Add Room</span>
                    </Button>
                  </div>
                </div>
              )}

              {formData.organizationMode === 'circuit_wise' && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[var(--color-text)] block">
                    Direct Breaker / Circuit Assignments:
                  </span>
                  <div className="space-y-2">
                    {formData.circuits.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-[var(--color-text)] block">{c.name}</span>
                          <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                            Approx Load: {c.drawKw} kW · {c.controlEnabled ? 'Controllable' : 'Monitor Only'}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface)] border font-bold">
                          {c.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.organizationMode === 'whole_property' && (
                <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs space-y-1">
                  <strong className="block font-semibold">Whole-Property Baseline Selected:</strong>
                  <p>
                    A non-invasive 100A CT sensor will monitor your entire utility incomer busbar. You can add room-level smart plugs and contactor relays anytime later from the Devices page.
                  </p>
                </div>
              )}
            </Surface>
          )}

          {/* STEP 5: HARDWARE SELECTION & INSTALLATION SCHEDULING */}
          {currentStep === 5 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 5 of 6 · Hardware Setup
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  Select 5AMPERE Hardware &amp; Book Site Visit
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Certified hardware is installed in your main distribution board by an authorized field wireman.
                </p>
              </div>

              {/* Hardware Selection Checklist */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-[var(--color-text)] block">
                  Recommended Hardware Package:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                  {HARDWARE_CATALOGUE.map((hw) => {
                    const isSelected = formData.requestedHardware.some((h) => h.id === hw.id);

                    return (
                      <button
                        type="button"
                        key={hw.id}
                        onClick={() => toggleHardware(hw)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all space-y-1 ${
                          isSelected
                            ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)]'
                            : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate block">{hw.name}</span>
                          {isSelected && <Check size={13} className="shrink-0" />}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
                          <span>{hw.category}</span>
                          <span className="font-bold text-[var(--color-text)]">₹{hw.priceINR}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Appointment Slot */}
              <div className="pt-2 space-y-2">
                <label className="block text-xs font-semibold text-[var(--color-text)]">
                  Preferred Technician Visit Slot:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Tomorrow, 10:00 AM – 01:00 PM',
                    'Tomorrow, 02:00 PM – 05:00 PM',
                    'Saturday, 10:00 AM – 01:00 PM',
                    'Sunday, 11:00 AM – 02:00 PM',
                  ].map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => updateField('preferredSlot', slot)}
                      className={`p-2 rounded-xl border text-xs font-semibold text-left cursor-pointer transition-all flex items-center justify-between ${
                        formData.preferredSlot === slot
                          ? 'bg-[var(--color-surface-selected)] border-[var(--color-accent)] text-[var(--color-accent)]'
                          : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span>{slot}</span>
                      </div>
                      {formData.preferredSlot === slot && <Check size={12} />}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                    Panel Access Notes for Technician
                  </label>
                  <textarea
                    rows={2}
                    value={formData.installationNotes}
                    onChange={(e) => updateField('installationNotes', e.target.value)}
                    placeholder="e.g. Distribution board is near entrance. Security gate code required."
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none"
                  />
                </div>
              </div>
            </Surface>
          )}

          {/* STEP 6: SUMMARY REVIEW & DIRECT COMPLETION */}
          {currentStep === 6 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 6 of 6 · Review &amp; Launch
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  Ready to Launch Your 5AMPERE Workspace
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Please review your property summary before finalizing. You will be taken straight to your dashboard.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] space-y-2 text-xs">
                <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-1.5">
                  <span className="text-[var(--color-text-muted)]">Customer:</span>
                  <span className="font-semibold text-[var(--color-text)]">{formData.fullName} ({formData.phone})</span>
                </div>
                <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-1.5">
                  <span className="text-[var(--color-text-muted)]">Property Type:</span>
                  <span className="font-bold text-[var(--color-accent)] uppercase">{formData.propertyType}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-1.5">
                  <span className="text-[var(--color-text-muted)]">Address:</span>
                  <span className="font-semibold text-[var(--color-text)] truncate max-w-xs">{formData.address}, {formData.locality}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-1.5">
                  <span className="text-[var(--color-text-muted)]">Topology Mode:</span>
                  <span className="font-semibold text-[var(--color-text)] capitalize">{formData.organizationMode.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--color-border-subtle)] pb-1.5">
                  <span className="text-[var(--color-text-muted)]">Hardware Modules:</span>
                  <span className="font-semibold text-[var(--color-text)]">{formData.requestedHardware.length} Selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Technician Visit:</span>
                  <span className="font-semibold text-[var(--color-accent)]">{formData.preferredSlot}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                <Clock size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Next Step:</strong> Your property will be registered with an <em>Installation Pending</em> status. Lead technician Rajesh Kumar will conduct the physical wiring during your selected visit slot.
                </div>
              </div>
            </Surface>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            {currentStep > 1 ? (
              <Button variant="secondary" size="md" onClick={handleBack} className="text-xs">
                <ArrowLeft size={14} />
                <span>Back</span>
              </Button>
            ) : (
              <div />
            )}

            <Button variant="primary" size="md" onClick={handleNext} className="text-xs font-bold shadow-xs">
              <span>{currentStep === 6 ? 'Complete Registration & Enter Workspace' : 'Continue'}</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3.5 text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
        <span>5AMPERE Smart Energy Management Platform · Certified Onboarding</span>
      </footer>
    </div>
  );
}

export default SignupOnboardingPage;
