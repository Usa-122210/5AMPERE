import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Shield,
  User,
  Code2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  RotateCcw,
  KeyRound,
  Home,
} from 'lucide-react';
import { BrandWordmark } from '../../components/brand/BrandWordmark';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { EnergyFlowBackground } from '../../components/motion/EnergyFlowBackground';
import { EvaluatorControls } from '../../components/common/EvaluatorControls';
import { useAuth } from '../../context/AuthContext';

export function LoginPage({ defaultRole = 'user' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  const {
    currentUser,
    loginWithCredentials,
    resetDemoData,
  } = useAuth();

  // Redirect already logged-in user to their role-specific dashboard
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else if (currentUser.role === 'developer' || currentUser.role === 'technician') {
        navigate('/developer');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const initialRole =
    roleParam === 'admin' || roleParam === 'developer' || roleParam === 'user'
      ? roleParam
      : defaultRole === 'staff' || defaultRole === 'developer'
      ? 'developer'
      : defaultRole === 'admin'
      ? 'admin'
      : 'user';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [identifier, setIdentifier] = useState(
    initialRole === 'admin' ? 'Admin' : initialRole === 'developer' ? 'Developer' : ''
  );
  const [password, setPassword] = useState(
    initialRole === 'admin' ? 'Admin' : initialRole === 'developer' ? 'Developer' : ''
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [autofillNotice, setAutofillNotice] = useState('');

  // Role selection handler: automatically prefills Admin/Admin or Developer/Developer
  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    setError('');
    if (roleKey === 'admin') {
      setIdentifier('Admin');
      setPassword('Admin');
      setAutofillNotice('Predefined Admin credentials (Admin / Admin) prefilled. Click Login below.');
    } else if (roleKey === 'developer') {
      setIdentifier('Developer');
      setPassword('Developer');
      setAutofillNotice('Predefined Developer credentials (Developer / Developer) prefilled. Click Login below.');
    } else {
      if (identifier === 'Admin' || identifier === 'Developer') {
        setIdentifier('');
      }
      if (password === 'Admin' || password === 'Developer') {
        setPassword('');
      }
      setAutofillNotice('');
    }
  };

  // Autofill helper (fills the form fields without forcing login so user clicks Login)
  const handleAutofill = (roleKey, nameVal, passVal) => {
    setSelectedRole(roleKey);
    setIdentifier(nameVal);
    setPassword(passVal);
    setError('');
    setAutofillNotice(`Demo ${roleKey.toUpperCase()} credentials autofilled. Click Login below to continue.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setAutofillNotice('');

    const result = loginWithCredentials({
      identifier,
      password,
      role: selectedRole,
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(result.redirectTo);
  };

  // Active Demo Suggestion based on selected role
  const demoSuggestion =
    selectedRole === 'admin'
      ? {
          roleLabel: 'Admin',
          roleKey: 'admin',
          name: 'Admin',
          password: 'Admin',
          note: 'Predefined system administrator demo account (no signup required).',
        }
      : selectedRole === 'developer'
      ? {
          roleLabel: 'Developer',
          roleKey: 'developer',
          name: 'Developer',
          password: 'Developer',
          note: 'Predefined Developer demo account with sample projects, catalogue & saved configurations.',
        }
      : {
          roleLabel: 'Admin / Developer / User',
          roleKey: 'user',
          name: 'Aarav Sharma',
          password: 'user123',
          note: 'Sign up as a new User or autofill a demo account below.',
        };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <EnergyFlowBackground intensity="subtle" />

      {/* Top Application Header */}
      <header className="relative z-10 w-full px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-(--color-border) bg-(--color-surface)/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
        </Link>
        <div className="flex items-center gap-2.5">
          <Link to="/">
            <Button variant="secondary" size="sm" className="text-xs font-semibold">
              <Home size={13} />
              <span>Public Homepage</span>
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm" className="text-xs font-bold shadow-xs">
              <span>Sign Up</span>
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md space-y-4">
          <Surface variant="primary" padding="lg" className="border border-(--color-border) shadow-md space-y-4">
            {/* Title */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-(--color-surface-secondary) text-(--color-accent) border border-(--color-border)">
                  Role-Based Access
                </span>
                <span className="text-[10px] font-mono text-(--color-text-muted)">
                  Demo Authentication
                </span>
              </div>
              <h1 className="text-xl font-bold text-(--color-text) mt-2">
                Log In to 5AMPERE
              </h1>
              <p className="text-xs text-(--color-text-secondary) mt-1">
                Select your role (Admin, Developer, or User) and click Login to open your workspace.
              </p>
            </div>

            {/* Role Selection: Admin | Developer | User */}
            <div>
              <label className="block text-xs font-semibold text-(--color-text) mb-1.5">
                Select Role
              </label>
              <div className="p-1 rounded-xl bg-(--color-surface-secondary) border border-(--color-border) grid grid-cols-3 gap-1">
                {[
                  { id: 'admin', label: 'Admin', icon: Shield },
                  { id: 'developer', label: 'Developer', icon: Code2 },
                  { id: 'user', label: 'User', icon: User },
                ].map((r) => {
                  const Icon = r.icon;
                  const isActive = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      id={`role-btn-${r.id}`}
                      type="button"
                      onClick={() => handleSelectRole(r.id)}
                      className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-(--color-surface) text-(--color-accent) shadow-xs border border-(--color-accent)'
                          : 'text-(--color-text-secondary) hover:text-(--color-text)'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clearly Visible Demo Credentials Suggestion Box */}
            <div className="p-3 rounded-xl border border-(--color-accent)/40 bg-(--color-accent-subtle) space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-(--color-accent) flex items-center gap-1.5">
                  <KeyRound size={13} />
                  <span>Demo Credentials Suggestion</span>
                </span>
                <button
                  type="button"
                  onClick={resetDemoData}
                  className="text-[10px] text-(--color-text-muted) hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer"
                  title="Reset demo localStorage to baseline"
                >
                  <RotateCcw size={10} />
                  <span>Reset</span>
                </button>
              </div>

              {selectedRole === 'admin' && (
                <div className="flex items-center justify-between gap-2 bg-(--color-surface) p-2.5 rounded-lg border border-(--color-border)">
                  <div className="text-xs font-mono space-y-0.5">
                    <div>
                      <span className="text-(--color-text-muted)">Role: </span>
                      <strong className="text-(--color-text)">Admin</strong>
                    </div>
                    <div>
                      <span className="text-(--color-text-muted)">Name: </span>
                      <strong className="text-(--color-accent)">Admin</strong>
                      <span className="mx-2 text-(--color-text-muted)">|</span>
                      <span className="text-(--color-text-muted)">Password: </span>
                      <strong className="text-(--color-accent)">Admin</strong>
                    </div>
                  </div>
                  <button
                    id="autofill-admin-btn"
                    type="button"
                    onClick={() => handleAutofill('admin', 'Admin', 'Admin')}
                    className="px-2.5 py-1.5 rounded-lg bg-(--color-accent) text-white text-[11px] font-bold cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
                  >
                    Autofill Admin
                  </button>
                </div>
              )}

              {selectedRole === 'developer' && (
                <div className="flex items-center justify-between gap-2 bg-(--color-surface) p-2.5 rounded-lg border border-(--color-border)">
                  <div className="text-xs font-mono space-y-0.5">
                    <div>
                      <span className="text-(--color-text-muted)">Role: </span>
                      <strong className="text-(--color-text)">Developer</strong>
                    </div>
                    <div>
                      <span className="text-(--color-text-muted)">Name: </span>
                      <strong className="text-(--color-accent)">Developer</strong>
                      <span className="mx-2 text-(--color-text-muted)">|</span>
                      <span className="text-(--color-text-muted)">Password: </span>
                      <strong className="text-(--color-accent)">Developer</strong>
                    </div>
                  </div>
                  <button
                    id="autofill-developer-btn"
                    type="button"
                    onClick={() => handleAutofill('developer', 'Developer', 'Developer')}
                    className="px-2.5 py-1.5 rounded-lg bg-(--color-accent) text-white text-[11px] font-bold cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
                  >
                    Autofill Developer
                  </button>
                </div>
              )}

              {selectedRole === 'user' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-between gap-1">
                      <div>
                        <span className="text-[10px] text-(--color-text-muted) block">Admin Demo</span>
                        <strong className="text-(--color-text)">Admin / Admin</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAutofill('admin', 'Admin', 'Admin')}
                        className="px-2 py-1 rounded bg-(--color-accent-subtle) text-(--color-accent) border border-(--color-accent)/40 font-bold text-[10px] cursor-pointer"
                      >
                        Autofill
                      </button>
                    </div>

                    <div className="p-2 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-between gap-1">
                      <div>
                        <span className="text-[10px] text-(--color-text-muted) block">Developer Demo</span>
                        <strong className="text-(--color-text)">Developer / Developer</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAutofill('developer', 'Developer', 'Developer')}
                        className="px-2 py-1 rounded bg-(--color-accent-subtle) text-(--color-accent) border border-(--color-accent)/40 font-bold text-[10px] cursor-pointer"
                      >
                        Autofill
                      </button>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-(--color-surface) border border-(--color-border) flex items-center justify-between gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-[10px] text-(--color-text-muted) block">Sample User Account</span>
                      <strong className="text-(--color-text)">aarav@example.com</strong>
                      <span className="text-(--color-text-muted)"> (Pass: </span>
                      <strong className="text-(--color-accent)">user123</strong>
                      <span className="text-(--color-text-muted)">)</span>
                    </div>
                    <button
                      id="autofill-user-btn"
                      type="button"
                      onClick={() => handleAutofill('user', 'aarav@example.com', 'user123')}
                      className="px-2 py-1 rounded bg-(--color-accent) text-white font-bold text-[10px] cursor-pointer shrink-0"
                    >
                      Autofill User
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-(--color-text-secondary)">
                {demoSuggestion.note}
              </p>
            </div>

            {/* Autofill Confirmation Notice */}
            {autofillNotice && (
              <div className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Sparkles size={14} className="shrink-0" />
                <span>{autofillNotice}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl border bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-xs font-semibold text-(--color-text) mb-1"
                >
                  Name or Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                  />
                  <input
                    id="login-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'admin'
                        ? 'Enter Admin'
                        : selectedRole === 'developer'
                        ? 'Enter Developer or developer email'
                        : 'Enter your Name or Email'
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-(--color-text) mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      selectedRole === 'admin'
                        ? 'Enter Admin'
                        : selectedRole === 'developer'
                        ? 'Enter Developer or your password'
                        : 'Enter your password'
                    }
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-xs text-(--color-text) focus:outline-none focus:border-(--color-accent)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text) cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button
                id="login-submit-btn"
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-xs justify-center font-bold text-xs"
              >
                <span>
                  Log In as {selectedRole === 'admin' ? 'Admin' : selectedRole === 'developer' ? 'Developer' : 'User'}
                </span>
                <ArrowRight size={14} />
              </Button>
            </form>

            {/* Link to Sign Up */}
            <div className="pt-2 border-t border-(--color-border-subtle) text-center text-xs text-(--color-text-secondary)">
              Don&apos;t have an account yet?{' '}
              <Link
                to="/signup"
                className="font-bold text-(--color-accent) hover:underline inline-flex items-center gap-1"
              >
                <span>Sign Up as User or Developer →</span>
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

export default LoginPage;
