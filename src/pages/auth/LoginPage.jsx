import { useState } from 'react';
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
  Zap,
} from 'lucide-react';
import { BrandWordmark } from '../../components/brand/BrandWordmark';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { EnergyFlowBackground } from '../../components/motion/EnergyFlowBackground';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginCustomer, loginTechnician, switchRole } = useAuth();

  // Active tab: 'customer' | 'staff'
  const [activeTab, setActiveTab] = useState('customer');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot Password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Quick fill demo credentials
  const handleQuickDemoCustomer = () => {
    setActiveTab('customer');
    setEmail('arpita@example.com');
    setPassword('5Ampere@2026');
    setError('');
  };

  const handleQuickDemoStaff = () => {
    setActiveTab('staff');
    setEmail('rajesh.kumar@5ampere.com');
    setPassword('TechStaff#42');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (activeTab === 'customer') {
        loginCustomer(email, password);
        navigate('/');
      } else {
        loginTechnician(email, password);
        navigate('/technician');
      }
    }, 400);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <EnergyFlowBackground intensity="subtle" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-secondary)] hidden sm:inline">
            Evaluating the prototype?
          </span>
          <button
            type="button"
            onClick={() => {
              switchRole(activeTab === 'customer' ? 'technician' : 'customer');
              navigate(activeTab === 'customer' ? '/technician' : '/');
            }}
            className="text-xs px-2.5 py-1 rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-semibold cursor-pointer hover:opacity-90 flex items-center gap-1.5"
          >
            <Sparkles size={12} />
            <span>Instant Role Switch ({activeTab === 'customer' ? 'Staff' : 'Homeowner'})</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md space-y-4">
          {/* Role Tabs Header */}
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
              <span>Homeowner / Customer</span>
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
              <span>Company Staff &amp; Tech</span>
            </button>
          </div>

          {/* Login Card */}
          <Surface variant="primary" padding="lg" className="border border-[var(--color-border)] shadow-md">
            <div className="mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                  {activeTab === 'customer' ? 'Customer Portal' : 'Technician Workspace'}
                </span>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  Prototype Auth
                </span>
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text)] mt-2">
                {activeTab === 'customer'
                  ? 'Welcome back to 5AMPERE'
                  : 'Field Engineering & Support'}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {activeTab === 'customer'
                  ? 'Log in to track home energy, view your monthly bill, and manage appliances.'
                  : 'Managed staff access for system technicians, site installers, and dispatchers.'}
              </p>
            </div>

            {/* Managed Access Notice for Staff */}
            {activeTab === 'staff' && (
              <div className="mb-4 p-3 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <Shield size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Managed Company Access:</strong>
                  Public staff registration is restricted. Accounts are provisioned by 5AMPERE Systems Operations.
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  {activeTab === 'customer' ? 'Email Address' : 'Staff Email / Employee ID'}
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
                  <span>Remember this device</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-xs justify-center font-bold text-xs"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {activeTab === 'customer'
                        ? 'Sign In to Home Dashboard'
                        : 'Sign In to Staff Workspace'}
                    </span>
                    <ArrowRight size={14} />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Autofill Helpers */}
            <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)] space-y-2">
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider block">
                Quick Demo Autofill
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoCustomer}
                  className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--color-accent)] text-left cursor-pointer transition-colors"
                >
                  <span className="text-[11px] font-bold block text-[var(--color-text)]">
                    Homeowner
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] block truncate">
                    Arpita Sharma (3BHK)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickDemoStaff}
                  className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--color-accent)] text-left cursor-pointer transition-colors"
                >
                  <span className="text-[11px] font-bold block text-[var(--color-text)]">
                    Lead Technician
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] block truncate">
                    Rajesh Kumar (Staff)
                  </span>
                </button>
              </div>
            </div>

            {/* Sign up link for Homeowner */}
            {activeTab === 'customer' && (
              <div className="mt-5 text-center text-xs text-[var(--color-text-secondary)]">
                Don&apos;t have a 5AMPERE home setup yet?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
                >
                  <span>Sign up &amp; Book Installation</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </Surface>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
        <span>5AMPERE Smart Home Energy Platform · Prototype Frontend (Demo Mode)</span>
      </footer>

      {/* Forgot Password Modal (Mock) */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <Surface variant="primary" padding="lg" className="w-full max-w-sm border border-[var(--color-border)] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
                <HelpCircle size={16} className="text-[var(--color-accent)]" />
                <span>Password Recovery Assistance</span>
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
                  Enter your registered homeowner email address. We will verify your DISCOM connection and send reset instructions.
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
    </div>
  );
}

export default LoginPage;
