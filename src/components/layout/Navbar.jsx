import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  User,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { BrandWordmark } from '../brand/BrandWordmark';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

/**
 * Navbar — Commercial public website navigation bar for 5AMPERE.
 *
 * Displays:
 *   - 5AMPERE brand mark
 *   - Public navigation links: Home, Features, How It Works, About, Contact
 *   - Theme toggle (Dark / Light)
 *   - Logged out: Login & Sign Up buttons
 *   - Logged in: Role Dashboard button, User badge, and Logout button
 */
export function Navbar({ theme: propTheme, onToggleTheme: propToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const hookTheme = useTheme();

  const theme = propTheme || hookTheme.theme;
  const onToggleTheme = propToggleTheme || hookTheme.toggleTheme;

  const isHome = location.pathname === '/' || location.pathname === '/index.html';

  const navLinks = [
    { label: 'Home', href: isHome ? '#hero' : '/#hero' },
    { label: 'Features', href: isHome ? '#features' : '/#features' },
    { label: 'How It Works', href: isHome ? '#how-it-works' : '/#how-it-works' },
    { label: 'About', href: isHome ? '#about' : '/#about' },
    { label: 'Contact', href: isHome ? '#contact' : '/#contact' },
  ];

  const dashboardPath =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'developer' || currentUser?.role === 'technician'
      ? '/developer'
      : '/dashboard';

  const handleNavClick = (e, href) => {
    if (href.startsWith('#') && isHome) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b transition-colors duration-200"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg) 92%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Left */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none rounded-lg shrink-0"
        >
          <BrandWordmark size="sm" showBadge={true} badgeText="Smart Energy" />
        </Link>

        {/* Desktop Commercial Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary)"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right Auth & Theme Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold bg-(--color-accent-subtle) text-(--color-accent) border-(--color-accent)/40 hover:border-(--color-accent) transition-all"
              >
                {currentUser.role === 'admin' ? (
                  <ShieldCheck size={14} />
                ) : currentUser.role === 'developer' || currentUser.role === 'technician' ? (
                  <Code2 size={14} />
                ) : (
                  <LayoutDashboard size={14} />
                )}
                <span>
                  {currentUser.role === 'admin'
                    ? 'Admin Dashboard'
                    : currentUser.role === 'developer' || currentUser.role === 'technician'
                    ? 'Developer Workspace'
                    : 'User Dashboard'}
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs">
                <User size={13} className="text-(--color-accent)" />
                <span className="font-semibold text-(--color-text) truncate max-w-28">
                  {currentUser.name}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-(--color-surface-secondary) text-(--color-accent) font-bold border border-(--color-border)">
                  {currentUser.role}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs font-semibold text-(--color-text-secondary) hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-accent) transition-colors"
              >
                <LogIn size={13} className="text-(--color-accent)" />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-(--color-accent) text-white hover:opacity-90 transition-opacity shadow-xs"
              >
                <UserPlus size={13} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-surface-secondary) transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden border-b px-4 py-4 space-y-3"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-(--color-text) hover:bg-(--color-surface-secondary)"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-(--color-border) flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-(--color-surface-secondary) border border-(--color-border)">
                  <div className="flex items-center gap-2 text-xs">
                    <User size={14} className="text-(--color-accent)" />
                    <span className="font-bold text-(--color-text)">{currentUser.name}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-(--color-accent-subtle) text-(--color-accent) font-bold">
                    {currentUser.role}
                  </span>
                </div>
                <Link
                  to={dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-(--color-accent) text-white text-center flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={14} />
                  <span>Open Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 px-4 rounded-xl text-xs font-bold border border-(--color-border) text-red-600 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold border border-(--color-border) bg-(--color-surface-secondary) text-(--color-text) flex items-center justify-center gap-1.5"
                >
                  <LogIn size={14} className="text-(--color-accent)" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold bg-(--color-accent) text-white flex items-center justify-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
