import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  User,
  Wrench,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Building,
  School,
  Factory,
  Home,
  RotateCcw,
} from 'lucide-react';
import { BrandWordmark } from '../../components/brand/BrandWordmark';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { EnergyFlowBackground } from '../../components/motion/EnergyFlowBackground';
import { EvaluatorControls } from '../../components/common/EvaluatorControls';
import { useAuth } from '../../context/AuthContext';

export function LoginPage({ defaultTab = 'customer' }) {
  const navigate = useNavigate();
  const {
    currentUser,
    loginCustomer,
    loginTechnician,
    loginAsDemoUser,
    resetDemoData,
  } = useAuth();

  // If already authenticated, redirect to their workspace
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'technician') {
        navigate('/technician');
      } else {
        navigate('/');
      }
    }
  }, [currentUser, navigate]);

  // Active tab: 'customer' | 'staff'
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  // Forgot Password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Instant login handler (NO artificial timeouts or delays!)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (activeTab === 'customer') {
      loginCustomer(email, password);
      navigate('/');
    } else {
      loginTechnician(email, password);
      navigate('/technician');
    }
  };

  const handleDemoLogin = (demoKey) => {
    setError('');
    loginAsDemoUser(demoKey);
    if (demoKey === 'technician') {
      navigate('/technician');
    } else {
      navigate('/');
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <EnergyFlowBackground intensity="subtle" />

      {/* Top Application Header */}
      <header className="relative z-10 w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-secondary)] hidden sm:inline">
            New to 5AMPERE?
          </span>
          <Link to="/signup">
            <Button variant="primary" size="sm" className="text-xs font-bold shadow-xs">
              <span>Create Account &amp; Register Property</span>
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md space-y-4">
          {/* Sign In vs Staff Tab Switcher */}
          <div className="p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer');
                setError('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              <User size={15} />
              <span>Customer Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('staff');
                setError('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-[var(--color-surface)] text-[var(--color-accent)] shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              <Wrench size={15} />
              <span>Staff &amp; Tech Access</span>
            </button>
          </div>

          {/* Authentication Card */}
          <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                  {activeTab === 'customer' ? 'Customer Authentication' : 'Staff Portal'}
                </span>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  Simulated Demo
                </span>
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text)] mt-2">
                {activeTab === 'customer'
                  ? 'Sign In to Your Workspace'
                  : 'Company Technician Console'}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {activeTab === 'customer'
                  ? 'Monitor power draw, review electricity bills, and manage your property appliances.'
                  : 'Authorized access for field engineers, electrical wiremen, and installation staff.'}
              </p>
            </div>

            {/* Staff Restriction Notice */}
            {activeTab === 'staff' && (
              <div className="p-3 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <Shield size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Managed Company Access:</strong>
                  Public staff registration is restricted. Technician accounts are provisioned by 5AMPERE Systems Operations.
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  {activeTab === 'customer' ? 'Registered Email Address' : 'Staff Email / Employee ID'}
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      activeTab === 'customer'
                        ? 'e.g. arpita@example.com'
                        : 'e.g. rajesh.kumar@5ampere.com'
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[var(--color-text)]">
                    Password
                  </label>
                  {activeTab === 'customer' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotSent(false);
                        setIsForgotModalOpen(true);
                      }}
                      className="text-[11px] text-[var(--color-accent)] hover:underline font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[var(--color-text-secondary)]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[var(--color-border)] text-[var(--color-accent)]"
                  />
                  <span>Remember this session</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-xs justify-center font-bold text-xs"
              >
                <span>
                  {activeTab === 'customer' ? 'Sign In to Workspace' : 'Sign In as Technician'}
                </span>
                <ArrowRight size={14} />
              </Button>
            </form>

            {/* Create Account Link for Customers */}
            {activeTab === 'customer' && (
              <div className="pt-2 text-center text-xs text-[var(--color-text-secondary)]">
                Don&apos;t have an energy profile yet?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
                >
                  <span>Register a New Property →</span>
                </Link>
              </div>
            )}
          </Surface>

          {/* Evaluator Instant Demo Accounts Box */}
          <Surface variant="primary" padding="md" className="border border-[var(--color-border)] bg-[var(--color-surface-secondary)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Sparkles size={12} className="text-[var(--color-accent)]" />
                <span>Simulated Demo Accounts (1-Click Test)</span>
              </span>
              <button
                type="button"
                onClick={resetDemoData}
                className="text-[10px] text-[var(--color-text-muted)] hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
                title="Reset all demo accounts and localStorage to original baseline"
              >
                <RotateCcw size={11} />
                <span>Reset Demo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer-home')}
                className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)]">
                  <Home size={13} className="text-[var(--color-accent)]" />
                  <span>Home (3BHK)</span>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] block truncate">
                  Arpita Sharma · Active
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('customer-school')}
                className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)]">
                  <School size={13} className="text-blue-600 dark:text-blue-400" />
                  <span>School Campus</span>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] block truncate">
                  Greenwood · Scheduled
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('customer-office')}
                className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)]">
                  <Building size={13} className="text-purple-600 dark:text-purple-400" />
                  <span>Office Hub</span>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] block truncate">
                  TechCorp · Installing
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('technician')}
                className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] cursor-pointer transition-colors text-left"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)]">
                  <Wrench size={13} className="text-amber-600 dark:text-amber-400" />
                  <span>Lead Technician</span>
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)] block truncate">
                  Rajesh Kumar · Staff
                </span>
              </button>
            </div>
          </Surface>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3.5 text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
        <span>5AMPERE Smart Energy Management Platform · Simulated Frontend Prototype</span>
      </footer>

      {/* Forgot Password Modal (Mock) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface variant="primary" padding="lg" className="w-full max-w-sm border border-[var(--color-border)] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <HelpCircle size={16} className="text-[var(--color-accent)]" />
                <span>Simulated Password Recovery</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {forgotSent ? (
              <div className="space-y-3 py-2">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-800 dark:text-green-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Demo Recovery Link Dispatched:</strong>
                    A simulated password reset token was routed to <code>{forgotEmail || 'your email'}</code>.
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setIsForgotModalOpen(false)}
                >
                  Return to Login
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Enter your registered property email address. We will verify your DISCOM connection and simulate reset instructions.
                </p>
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--color-text)] mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. arpita@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setIsForgotModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs font-bold"
                    onClick={() => setForgotSent(true)}
                  >
                    Send Reset Link
                  </Button>
                </div>
              </div>
            )}
          </Surface>
        </div>
      )}

      {/* Isolated Evaluator Demo Drawer */}
      <EvaluatorControls />
    </div>
  );
}

export default LoginPage;
