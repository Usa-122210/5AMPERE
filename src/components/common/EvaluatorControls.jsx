import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Wrench,
  RotateCcw,
  LogOut,
  X,
  Home,
  School,
  Building,
  Factory,
  CheckCircle2,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export function EvaluatorControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);
  const navigate = useNavigate();

  const {
    currentUser,
    activeCustomerProperty,
    loginAsDemoUser,
    logout,
    resetDemoData,
  } = useAuth();

  // Evaluator controls must only be visible to logged-in users / evaluators, never to unauthenticated public visitors
  if (!currentUser) {
    return null;
  }

  const handleSelectPersona = (personaKey) => {
    loginAsDemoUser(personaKey);
    setIsOpen(false);
    if (personaKey === 'admin') {
      navigate('/admin');
    } else if (personaKey === 'developer' || personaKey === 'technician') {
      navigate('/developer');
    } else {
      navigate('/dashboard');
    }
  };

  const handleReset = () => {
    resetDemoData();
    setResetFeedback(true);
    setTimeout(() => {
      setResetFeedback(false);
      setIsOpen(false);
      navigate('/');
    }, 1200);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const personas = [
    {
      key: 'admin',
      propertyType: null,
      name: 'Admin (Admin / Admin)',
      property: 'Platform Control Center',
      type: 'Predefined Admin Account',
      icon: ShieldCheck,
      tag: 'Role: Admin',
      tagColor: '#F59E0B',
      role: 'admin',
    },
    {
      key: 'developer',
      propertyType: null,
      name: 'Developer (Developer / Developer)',
      property: 'Developer & Commissioning Workspace',
      type: 'Predefined Developer Account',
      icon: Wrench,
      tag: 'Role: Developer',
      tagColor: '#3B82F6',
      role: 'developer',
    },
    {
      key: 'customer-home',
      propertyType: 'home',
      name: 'Aarav Sharma',
      property: '3BHK Apartment (Noida)',
      type: 'Residential Home User',
      icon: Home,
      tag: '5 kW · Active',
      tagColor: 'var(--color-success)',
      role: 'user',
    },
    {
      key: 'customer-school',
      propertyType: 'school',
      name: 'Greenwood High School',
      property: 'Educational Campus (Greater Noida)',
      type: 'School / Institution User',
      icon: School,
      tag: '120 kW · Scheduled',
      tagColor: 'var(--color-warning)',
      role: 'user',
    },
    {
      key: 'customer-office',
      propertyType: 'office',
      name: 'TechCorp Innovation Hub',
      property: 'Commercial Floor (Cyber City)',
      type: 'Commercial Office User',
      icon: Building,
      tag: '75 kW · Installing',
      tagColor: 'var(--color-accent)',
      role: 'user',
    },
    {
      key: 'customer-industry',
      propertyType: 'industry',
      name: 'Apex Precision Components',
      property: 'Heavy Machining Unit (IMT Manesar)',
      type: 'Industrial Facility User',
      icon: Factory,
      tag: '250 kW · Active',
      tagColor: 'var(--color-accent)',
      role: 'user',
    },
  ];

  return (
    <>
      {/* Floating Pill Trigger */}
      <aside
        aria-label="Evaluator Controls"
        className="fixed bottom-4 right-4 z-999"
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-accent)',
            color: 'var(--color-text)',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--color-accent) 25%, transparent)',
          }}
          title="Open Evaluator Demo Controller (Simulated Personas & Data Reset)"
        >
          <div className="w-2 h-2 rounded-full bg-(--color-accent) animate-pulse" />
          <span className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-(--color-accent)" />
            <span className="hidden sm:inline">Evaluator Demo Tools</span>
            <span className="sm:hidden">Demo</span>
          </span>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-(--color-accent-subtle) text-(--color-accent) font-bold">
            Simulated
          </span>
        </button>
      </aside>

      {/* Slide-in Modal Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center sm:justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-right duration-200"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-(--color-border) pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-(--color-accent-subtle) text-(--color-accent) flex items-center justify-center">
                  <Sliders size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-(--color-text)">
                    Evaluator Demo Controller
                  </h3>
                  <span className="text-[10px] text-(--color-text-secondary) font-mono">
                    Audit Multi-Persona Workspaces
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-(--color-text-muted) hover:text-(--color-text) cursor-pointer"
                aria-label="Close evaluator controls"
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Active User Status */}
            <div className="p-3 rounded-xl border bg-(--color-surface-secondary) border-(--color-border) space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-(--color-text-muted) font-bold">
                Active Session
              </span>
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-xs font-bold text-(--color-text) block truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[11px] text-(--color-accent) font-mono block truncate">
                      {currentUser.role === 'admin'
                        ? 'Admin Control Center'
                        : currentUser.role === 'developer' || currentUser.role === 'technician'
                        ? 'Developer Workspace'
                        : `${activeCustomerProperty?.propertyName || 'User Portal'} (${activeCustomerProperty?.propertyType?.toUpperCase() || 'HOME'})`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 px-2 py-1 rounded bg-red-500/10 cursor-pointer shrink-0"
                    title="Sign Out"
                  >
                    <LogOut size={12} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Public Visitor (Not Signed In)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                    Public Mode
                  </span>
                </div>
              )}
            </div>

            {/* Persona Switcher List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-(--color-text-muted) font-bold block">
                Instant 1-Click Persona Switch
              </span>

              <div className="space-y-1.5">
                {personas.map((p) => {
                  const Icon = p.icon;
                  const isCurrent =
                    currentUser &&
                    ((p.role === 'admin' && currentUser.role === 'admin') ||
                      (p.role === 'developer' &&
                        (currentUser.role === 'developer' || currentUser.role === 'technician')) ||
                      (p.role === 'user' &&
                        (currentUser.role === 'user' || currentUser.role === 'customer') &&
                        (activeCustomerProperty?.propertyType || currentUser.propertyType) === p.propertyType));

                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleSelectPersona(p.key)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-(--color-accent-subtle) border-(--color-accent) shadow-xs'
                          : 'bg-(--color-surface) border-(--color-border) hover:border-(--color-accent) hover:bg-(--color-surface-secondary)'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: 'var(--color-surface-secondary)',
                            borderColor: isCurrent ? 'var(--color-accent)' : 'var(--color-border)',
                            color: isCurrent ? 'var(--color-accent)' : 'var(--color-text)',
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-(--color-text) truncate">
                              {p.name}
                            </span>
                            {isCurrent && (
                              <CheckCircle2 size={12} className="text-(--color-accent) shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-(--color-text-secondary) block truncate">
                            {p.property}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0"
                        style={{
                          backgroundColor: 'var(--color-surface-secondary)',
                          color: p.tagColor,
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        {p.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reset Demo Data Utility */}
            <div className="pt-2 border-t border-(--color-border) space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-(--color-text-muted) font-bold block">
                Reset Simulated Data
              </span>
              <p className="text-[11px] text-(--color-text-secondary) leading-relaxed">
                Clears localStorage modifications, restore original 4 properties, reset technician appointment statuses, and return to pristine baseline.
              </p>

              {resetFeedback ? (
                <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 size={14} />
                  <span>Demo data successfully reset! Redirecting to login...</span>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                  className="w-full text-xs font-semibold text-(--color-text-secondary) hover:text-red-600 hover:border-red-500/30"
                >
                  <RotateCcw size={13} />
                  <span>Reset Demo Baseline &amp; Log Out</span>
                </Button>
              )}
            </div>

            {/* Notice */}
            <div className="text-[10px] text-(--color-text-muted) text-center font-mono">
              5AMPERE Frontend Prototype · Offline Demo Simulator
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EvaluatorControls;

