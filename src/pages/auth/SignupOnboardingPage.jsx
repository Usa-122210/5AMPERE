import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Code2,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  Home,
  Mail,
  Lock,
} from 'lucide-react';
import { BrandWordmark } from '../../components/brand/BrandWordmark';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { EnergyFlowBackground } from '../../components/motion/EnergyFlowBackground';
import { EvaluatorControls } from '../../components/common/EvaluatorControls';
import { useAuth } from '../../context/AuthContext';

export function SignupOnboardingPage() {
  const navigate = useNavigate();
  const { registerAccount } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' | 'developer'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid Email address.');
      return;
    }
    if (!password || password.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please confirm your password.');
      return;
    }

    const res = registerAccount({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      role,
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    navigate(res.redirectTo);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <EnergyFlowBackground intensity="subtle" />

      {/* Header */}
      <header className="relative z-10 w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-(--color-border) bg-(--color-surface)/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
        </Link>
        <div className="flex items-center gap-2.5 text-xs">
          <Link to="/">
            <Button variant="secondary" size="sm" className="text-xs font-semibold">
              <Home size={13} />
              <span>Public Homepage</span>
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="primary" size="sm" className="text-xs font-bold shadow-xs">
              <span>Log In</span>
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Sign Up Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md space-y-4">
          <Surface variant="primary" padding="lg" className="border border-(--color-border) shadow-md space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-(--color-surface-secondary) text-(--color-accent) border border-(--color-border)">
                  Account Registration
                </span>
                <span className="text-[10px] font-mono text-(--color-text-muted)">
                  Local Persistence
                </span>
              </div>
              <h1 className="text-xl font-bold text-(--color-text) mt-2">
                Create Your 5AMPERE Account
              </h1>
              <p className="text-xs text-(--color-text-secondary) mt-1">
                Sign up as a User to manage your property energy setup, or as a Developer to manage projects and hardware configurations.
              </p>
            </div>

            {/* Role Selection: User | Developer */}
            <div>
              <label className="block text-xs font-semibold text-(--color-text) mb-1.5">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="signup-role-user"
                  type="button"
                  onClick={() => {
                    setRole('user');
                    setError('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'user'
                      ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent) shadow-xs'
                      : 'bg-(--color-surface) border-(--color-border) text-(--color-text-secondary) hover:border-(--color-text-muted)'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-(--color-text)">
                    <User size={15} className="text-(--color-accent)" />
                    <span>User</span>
                  </div>
                  <p className="text-[10px] text-(--color-text-muted) mt-1">
                    Home, School, Office &amp; Industry energy management
                  </p>
                </button>

                <button
                  id="signup-role-developer"
                  type="button"
                  onClick={() => {
                    setRole('developer');
                    setError('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'developer'
                      ? 'bg-(--color-accent-subtle) border-(--color-accent) text-(--color-accent) shadow-xs'
                      : 'bg-(--color-surface) border-(--color-border) text-(--color-text-secondary) hover:border-(--color-text-muted)'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-(--color-text)">
                    <Code2 size={15} className="text-(--color-accent)" />
                    <span>Developer</span>
                  </div>
                  <p className="text-[10px] text-(--color-text-muted) mt-1">
                    Projects, hardware catalogue &amp; panel configurations
                  </p>
                </button>
              </div>

              <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-(--color-surface-secondary) border border-(--color-border) flex items-center gap-2 text-[11px] text-(--color-text-muted)">
                <Shield size={12} className="text-(--color-accent) shrink-0" />
                <span>
                  <strong>Note:</strong> Admin is a predefined system account (<code className="font-mono text-(--color-text)">Admin / Admin</code>) available on the Login page.
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="signup-fullname"
                  className="block text-xs font-semibold text-(--color-text) mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                  />
                  <input
                    id="signup-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rohan Verma"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-semibold text-(--color-text) mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                  />
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rohan@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="signup-password"
                    className="block text-xs font-semibold text-(--color-text) mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                    />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-9 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--color-text-muted) cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-confirm-password"
                    className="block text-xs font-semibold text-(--color-text) mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                    />
                    <input
                      id="signup-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                id="signup-submit-btn"
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-xs justify-center font-bold text-xs mt-1"
              >
                <span>Create Account ({role === 'developer' ? 'Developer' : 'User'})</span>
                <ArrowRight size={14} />
              </Button>
            </form>

            {/* Link to Login */}
            <div className="pt-2 border-t border-(--color-border-subtle) text-center text-xs text-(--color-text-secondary)">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-(--color-accent) hover:underline inline-flex items-center gap-1"
              >
                <span>Log In →</span>
              </Link>
            </div>
          </Surface>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3.5 text-center text-xs text-(--color-text-muted) border-t border-(--color-border)">
        <span>5AMPERE Smart Energy Management Platform · Frontend Demo Authentication</span>
      </footer>

      <EvaluatorControls />
    </div>
  );
}

export default SignupOnboardingPage;
