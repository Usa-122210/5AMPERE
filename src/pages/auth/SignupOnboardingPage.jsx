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
  User,
  Zap,
  Wrench,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Building,
  Info,
} from 'lucide-react';
import { BrandWordmark } from '../../components/brand/BrandWordmark';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { EnergyFlowBackground } from '../../components/motion/EnergyFlowBackground';
import { useAuth } from '../../context/AuthContext';

const STEPS = [
  { id: 1, label: 'Account', icon: User },
  { id: 2, label: 'Home Profile', icon: Home },
  { id: 3, label: 'Energy Needs', icon: Zap },
  { id: 4, label: 'Installation', icon: Wrench },
];

export function SignupOnboardingPage() {
  const navigate = useNavigate();
  const { signupCustomer } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Form State across all 4 steps
  const [formData, setFormData] = useState({
    // Step 1: Customer Details
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Step 2: Home Details
    address: '',
    locality: '',
    homeType: 'apartment', // 'apartment' | 'independent_house' | 'villa' | 'other'
    floors: 1,
    sanctionedLoadKw: 5.0,
    discom: 'UPPCL Urban Domestic (PVVNL Noida)',
    consumerNumber: '',

    // Step 3: Energy Requirements & Appliances
    appliances: ['1.5T Inverter AC', '25L Storage Geyser', 'Double Door Refrigerator'],
    monitoringGoal: 'bill_reduction', // 'bill_reduction' | 'solar_readiness' | 'appliance_safety' | 'peak_shedding'
    interestedInRelays: true,
    interestedInSensors: true,

    // Step 4: Installation Appointment Booking
    preferredSlot: 'Saturday, 10:00 AM – 01:00 PM',
    installationNotes: 'Please call before arrival. Main electrical distribution box is in entrance hallway.',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const toggleAppliance = (applianceName) => {
    setFormData((prev) => {
      const exists = prev.appliances.includes(applianceName);
      return {
        ...prev,
        appliances: exists
          ? prev.appliances.filter((a) => a !== applianceName)
          : [...prev.appliances, applianceName],
      };
    });
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name.';
    if (!formData.email.trim() || !formData.email.includes('@'))
      return 'Please enter a valid email address.';
    if (!formData.phone.trim() || formData.phone.length < 10)
      return 'Please provide a valid 10-digit mobile number.';
    if (!formData.password || formData.password.length < 6)
      return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)
      return 'Passwords do not match.';
    return null;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.address.trim()) return 'Please enter your home address.';
    if (!formData.locality.trim()) return 'Please enter your locality or city.';
    return null;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    if (formData.appliances.length === 0)
      return 'Please select at least one primary appliance in your home.';
    return null;
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) return setError(err);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) return setError(err);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const err = validateStep3();
      if (err) return setError(err);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Submit registration
      signupCustomer(formData);
      setIsCompleted(true);
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

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[var(--color-text-secondary)] hidden sm:inline">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="font-bold text-[var(--color-accent)] hover:underline"
          >
            Sign In →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-2xl space-y-5">
          {!isCompleted && (
            <>
              {/* Progress Steps Header */}
              <div className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
                <div className="grid grid-cols-4 gap-2">
                  {STEPS.map((step) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep === step.id;
                    const isDone = currentStep > step.id;

                    return (
                      <div
                        key={step.id}
                        className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-bold'
                            : isDone
                            ? 'text-[var(--color-success)]'
                            : 'text-[var(--color-text-muted)] opacity-60'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono mb-1 transition-colors ${
                            isActive
                              ? 'bg-[var(--color-accent)] text-white'
                              : isDone
                              ? 'bg-[var(--color-success)] text-white'
                              : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]'
                          }`}
                        >
                          {isDone ? <Check size={14} /> : step.id}
                        </div>
                        <span className="text-[11px] font-semibold truncate hidden sm:block">
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error banner */}
              {error && (
                <div className="p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}

          {/* Step 1: Customer Details */}
          {!isCompleted && currentStep === 1 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 1 of 4
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  Create Your Homeowner Account
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Enter your contact credentials to register your household and schedule on-site hardware setup.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="e.g. vikram@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Phone Number (Mobile)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="e.g. +91 99201 12345"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-3 py-2 pr-9 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
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
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>
                </div>
              </div>
            </Surface>
          )}

          {/* Step 2: Home Profile & Electrical Setup */}
          {!isCompleted && currentStep === 2 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 2 of 4
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  Tell Us About Your Home &amp; Electrical Connection
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Our certified technicians need these details to specify the correct CT clamp sizes and DIN modules.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                    Street Address &amp; House/Flat Number
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="e.g. Plot 18, Block C, Grand Omaxe"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Locality &amp; City
                    </label>
                    <input
                      type="text"
                      value={formData.locality}
                      onChange={(e) => updateField('locality', e.target.value)}
                      placeholder="e.g. Sector 93B, Noida, UP"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Dwelling Type
                    </label>
                    <select
                      value={formData.homeType}
                      onChange={(e) => updateField('homeType', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      <option value="apartment">Apartment / High-Rise Flat</option>
                      <option value="independent_house">Independent House / Kothi</option>
                      <option value="villa">Gated Villa / Duplex</option>
                      <option value="other">Other Residential Property</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Floors / Levels
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.floors}
                      onChange={(e) => updateField('floors', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Sanctioned Load (kW)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="30"
                      value={formData.sanctionedLoadKw}
                      onChange={(e) => updateField('sanctionedLoadKw', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                      Electricity DISCOM
                    </label>
                    <select
                      value={formData.discom}
                      onChange={(e) => updateField('discom', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    >
                      <option value="UPPCL Urban Domestic (PVVNL Noida)">UPPCL (PVVNL Noida)</option>
                      <option value="UPPCL Urban Domestic (PVVNL Ghaziabad)">UPPCL (Ghaziabad)</option>
                      <option value="BSES Rajdhani Power Ltd (BRPL Delhi)">BSES Rajdhani (BRPL Delhi)</option>
                      <option value="Tata Power Delhi (TPDDL)">Tata Power Delhi (TPDDL)</option>
                      <option value="DHBVN Gurugram">DHBVN Gurugram</option>
                    </select>
                  </div>
                </div>
              </div>
            </Surface>
          )}

          {/* Step 3: Energy Requirements */}
          {!isCompleted && currentStep === 3 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 3 of 4
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  Existing Appliances &amp; Energy Goals
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Select which high-consumption appliances are in your home so we can recommend the appropriate smart contactors.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">
                    Select Your High-Power Appliances:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      '1.5T / 2.0T Air Conditioner',
                      '25L Storage Water Geyser',
                      'Double Door Refrigerator',
                      'Washing Machine (Front/Top Load)',
                      'Microwave & Convection Oven',
                      'Induction Cooktop',
                      'Submersible Water Pump (1-2 HP)',
                      'Electric Vehicle (EV) Charger',
                    ].map((appliance) => {
                      const isSelected = formData.appliances.includes(appliance);
                      return (
                        <button
                          type="button"
                          key={appliance}
                          onClick={() => toggleAppliance(appliance)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-medium cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                              : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]'
                          }`}
                        >
                          <span>{appliance}</span>
                          <span
                            className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                              isSelected
                                ? 'bg-[var(--color-accent)] text-white'
                                : 'border border-[var(--color-border)]'
                            }`}
                          >
                            {isSelected && <Check size={10} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-2">
                    What is your primary energy goal?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'bill_reduction', label: 'Reduce Monthly Electricity Bill', desc: 'Target 15%–25% savings on peak tariff slabs' },
                      { id: 'peak_shedding', label: 'Automated Peak Load Shedding', desc: 'Avoid sanction load breach penalties' },
                      { id: 'solar_readiness', label: 'Solar Rooftop Readiness', desc: 'Measure export potential and baseline self-consumption' },
                      { id: 'appliance_safety', label: 'Appliance Health & Safety', desc: 'Detect voltage fluctuations and overheating' },
                    ].map((goal) => (
                      <button
                        type="button"
                        key={goal.id}
                        onClick={() => updateField('monitoringGoal', goal.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          formData.monitoringGoal === goal.id
                            ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)]'
                            : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                        }`}
                      >
                        <span className="text-xs font-bold block text-[var(--color-text)]">
                          {goal.label}
                        </span>
                        <span className="text-[11px] text-[var(--color-text-secondary)] block mt-0.5">
                          {goal.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Surface>
          )}

          {/* Step 4: Installation Appointment Request */}
          {!isCompleted && currentStep === 4 && (
            <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Step 4 of 4
                </span>
                <h2 className="text-lg font-bold text-[var(--color-text)] mt-1">
                  Schedule On-Site Technician Assessment &amp; Installation
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  5AMPERE hardware is installed professionally inside your main distribution board. A certified field technician will visit your home.
                </p>
              </div>

              {/* Informative Banner */}
              <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2.5">
                <Info size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">How 5AMPERE Installation Works:</strong>
                  A certified technician will inspect your meter &amp; breaker panel, install non-invasive CT sensors and the DIN gateway, test Wi-Fi signal, and hand over your calibrated mobile dashboard.
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1.5">
                    Select Preferred Appointment Slot:
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
                        className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold cursor-pointer transition-all ${
                          formData.preferredSlot === slot
                            ? 'bg-[var(--color-accent-subtle)] border-[var(--color-accent)] text-[var(--color-accent)]'
                            : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{slot}</span>
                        </div>
                        {formData.preferredSlot === slot && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                    Special Instructions / Panel Access Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.installationNotes}
                    onChange={(e) => updateField('installationNotes', e.target.value)}
                    placeholder="e.g. Panel is behind front door. Security gate code required."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                {/* Summary Box */}
                <div className="p-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Homeowner:</span>
                    <span className="font-semibold text-[var(--color-text)]">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Address:</span>
                    <span className="font-semibold text-[var(--color-text)] truncate max-w-xs">{formData.address}, {formData.locality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Selected Slot:</span>
                    <span className="font-semibold text-[var(--color-accent)]">{formData.preferredSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Assigned Package:</span>
                    <span className="font-semibold text-[var(--color-text)]">EdgeCore DIN Gateway + 4 CT Clamps</span>
                  </div>
                </div>
              </div>
            </Surface>
          )}

          {/* Step Actions */}
          {!isCompleted && (
            <div className="flex items-center justify-between pt-2">
              {currentStep > 1 ? (
                <Button variant="secondary" size="md" onClick={handleBack} className="text-xs">
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </Button>
              ) : (
                <div />
              )}

              <Button variant="primary" size="md" onClick={handleNext} className="text-xs font-bold">
                <span>{currentStep === 4 ? 'Confirm & Book Installation Visit' : 'Next Step'}</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          )}

          {/* Step 5 / Completion Screen (Welcome + Installation-Pending State) */}
          {isCompleted && (
            <Surface variant="primary" padding="xl" className="border border-[var(--color-border)] shadow-xl text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Clock size={32} />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Status: Installation Pending Assessment
                </span>
                <h1 className="text-2xl font-bold text-[var(--color-text)] mt-3">
                  Welcome to 5AMPERE, {formData.fullName.split(' ')[0]}!
                </h1>
                <p className="text-xs text-[var(--color-text-secondary)] mt-2 max-w-md mx-auto">
                  Your household registration has been submitted successfully. A certified 5AMPERE technician has been assigned to visit your home.
                </p>
              </div>

              {/* Appointment Card */}
              <div className="p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="font-bold text-[var(--color-text)] flex items-center gap-2 border-b border-[var(--color-border)] pb-2">
                  <Calendar size={15} className="text-[var(--color-accent)]" />
                  <span>Scheduled Site Visit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Time Slot:</span>
                  <span className="font-semibold text-[var(--color-text)]">{formData.preferredSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Assigned Lead Tech:</span>
                  <span className="font-semibold text-[var(--color-accent)]">Rajesh Kumar (5AMP-TECH-042)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Pre-requisite:</span>
                  <span className="font-semibold text-[var(--color-text)]">Clear access to Main Breaker Box</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto font-bold text-xs"
                >
                  <span>Go to My Home Dashboard</span>
                  <ArrowRight size={14} />
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/installation')}
                  className="w-full sm:w-auto text-xs"
                >
                  <span>Track Installation Progress</span>
                </Button>
              </div>
            </Surface>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
        <span>5AMPERE Smart Home Energy Platform · Certified Electrical Installation Workflow</span>
      </footer>
    </div>
  );
}

export default SignupOnboardingPage;
