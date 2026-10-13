import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Building,
  Cpu,
  Calendar,
  LogOut,
  CheckCircle2,
  Plus,
  Code2,
  LayoutDashboard,
  Home,
} from 'lucide-react';
import { BrandWordmark } from '../../components/brand/BrandWordmark';
import { ThemeToggle } from '../../components/layout/ThemeToggle';
import { EnergyFlowBackground } from '../../components/motion/EnergyFlowBackground';
import { EvaluatorControls } from '../../components/common/EvaluatorControls';
import { PageHeader } from '../../components/common/PageHeader';
import { Surface } from '../../components/ui/Surface';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

export function AdminDashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const {
    currentUser,
    logout,
    registeredAccounts,
    customerHomes,
    appointments,
    marketplaceHardware,
    savedConfigurations,
    updateInstallationStatus,
    toggleHardwareStock,
    addHardwareCatalogueItem,
  } = useAuth();

  const [newHwForm, setNewHwForm] = useState({
    name: '',
    sku: '',
    category: 'Smart Sensor',
    priceInr: 4500,
    installationFeeInr: 500,
  });
  const [adminNotice, setAdminNotice] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddHardware = (e) => {
    e.preventDefault();
    if (!newHwForm.name.trim()) return;
    addHardwareCatalogueItem({
      name: newHwForm.name.trim(),
      sku: newHwForm.sku.trim() || `5AMP-MOD-${(marketplaceHardware || []).length + 1}`,
      category: newHwForm.category,
      priceInr: Number(newHwForm.priceInr) || 4500,
      installationFeeInr: Number(newHwForm.installationFeeInr) || 500,
    });
    setNewHwForm({
      name: '',
      sku: '',
      category: 'Smart Sensor',
      priceInr: 4500,
      installationFeeInr: 500,
    });
    setAdminNotice('New hardware SKU added to platform catalogue and saved to localStorage.');
  };

  return (
    <div id="top" className="relative min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <EnergyFlowBackground intensity="subtle" />

      {/* Admin Header */}
      <header
        className="sticky top-0 z-50 w-full border-b transition-colors duration-200 h-16"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 95%, transparent)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2.5">
              <BrandWordmark size="sm" showBadge={true} badgeText="Admin Control Center" />
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text) hover:border-(--color-accent) transition-all"
            >
              <Home size={13} />
              <span>Public Website</span>
            </Link>
            <Link
              to="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text) hover:border-(--color-accent) transition-all"
            >
              <LayoutDashboard size={13} />
              <span>User View</span>
            </Link>
            <Link
              to="/developer"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs font-medium text-(--color-text-secondary) hover:text-(--color-text) hover:border-(--color-accent) transition-all"
            >
              <Code2 size={13} />
              <span>Developer View</span>
            </Link>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-(--color-accent)/30 bg-(--color-accent-subtle) text-xs font-semibold text-(--color-text)">
              <ShieldCheck size={14} className="text-(--color-accent)" />
              <span>{currentUser?.name || 'Admin'}</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-(--color-surface) text-(--color-accent)">
                Admin
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-(--color-border) bg-(--color-surface) text-xs font-medium text-(--color-text-secondary) hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>

            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <PageHeader
            category="System Governance & Platform Administration"
            title="5AMPERE Executive Admin Dashboard"
            badge={`Admin Session · ${currentUser?.staffId || '5AMP-ADM-001'}`}
            badgeColor="var(--color-accent)"
            description="Centralized administration over registered User & Developer accounts, monitored properties, hardware SKUs, and field commissioning status."
          />

          {adminNotice && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{adminNotice}</span>
              </div>
              <button type="button" onClick={() => setAdminNotice('')} className="underline text-[11px] cursor-pointer">
                Dismiss
              </button>
            </div>
          )}

          {/* 1. Executive KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
                <span>Registered Accounts</span>
                <Users size={16} className="text-(--color-accent)" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-(--color-text)">
                  {(registeredAccounts || []).length}
                </span>
                <span className="text-xs text-(--color-accent) font-medium">
                  User · Developer · Admin
                </span>
              </div>
              <span className="text-[11px] text-(--color-text-muted) block">
                Stored in localStorage directory
              </span>
            </Surface>

            <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
                <span>Monitored Properties</span>
                <Building size={16} className="text-(--color-success)" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-(--color-text)">
                  {(customerHomes || []).length}
                </span>
                <span className="text-xs text-(--color-success) font-medium">
                  Home / School / Office / Industry
                </span>
              </div>
              <span className="text-[11px] text-(--color-text-muted) block">
                Active electrical sub-panels
              </span>
            </Surface>

            <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
                <span>Hardware SKUs</span>
                <Cpu size={16} className="text-(--color-accent)" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-(--color-text)">
                  {(marketplaceHardware || []).length}
                </span>
                <span className="text-xs text-(--color-text-secondary) font-medium">
                  Gateways, CTs &amp; Relays
                </span>
              </div>
              <span className="text-[11px] text-(--color-text-muted) block">
                {(savedConfigurations || []).length} developer blueprints saved
              </span>
            </Surface>

            <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-(--color-text-secondary)">
                <span>Field Dispatches</span>
                <Calendar size={16} className="text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-(--color-text)">
                  {(appointments || []).length}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  Scheduled Visits
                </span>
              </div>
              <span className="text-[11px] text-(--color-text-muted) block">
                Assigned across service zones
              </span>
            </Surface>
          </div>

          {/* 2. Registered Accounts Directory */}
          <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-3">
            <div className="flex items-center justify-between border-b border-(--color-border-subtle) pb-2.5">
              <div>
                <h2 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                  <Users size={16} className="text-(--color-accent)" />
                  <span>Registered Accounts Directory ({(registeredAccounts || []).length})</span>
                </h2>
                <p className="text-xs text-(--color-text-secondary) mt-0.5">
                  All predefined demo accounts (Admin, Developer) and signed-up User / Developer accounts persisted in localStorage.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-(--color-border) text-[10px] font-mono uppercase text-(--color-text-muted)">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Role</th>
                    <th className="py-2 px-3">Linked Property / Staff ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-border-subtle)">
                  {(registeredAccounts || []).map((acc) => {
                    const roleNorm = acc.role === 'customer' ? 'user' : acc.role === 'technician' ? 'developer' : acc.role;
                    return (
                      <tr key={acc.id} className="hover:bg-(--color-surface-secondary)">
                        <td className="py-2.5 px-3 font-semibold text-(--color-text)">{acc.name}</td>
                        <td className="py-2.5 px-3 font-mono text-(--color-text-secondary)">{acc.email}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                              roleNorm === 'admin'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                                : roleNorm === 'developer'
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-300'
                                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                            }`}
                          >
                            {roleNorm}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-(--color-text-muted)">
                          {acc.homeId || acc.staffId || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Surface>

          {/* 3. All Monitored Properties & Commissioning Governance */}
          <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-3">
            <div className="flex items-center justify-between border-b border-(--color-border-subtle) pb-2.5">
              <div>
                <h2 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                  <Building size={16} className="text-(--color-accent)" />
                  <span>Property Commissioning &amp; Telemetry Status ({(customerHomes || []).length})</span>
                </h2>
                <p className="text-xs text-(--color-text-secondary) mt-0.5">
                  Inspect and update installation lifecycle states across all customer properties.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(customerHomes || []).map((prop) => (
                <div
                  key={prop.id}
                  className="p-3.5 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-(--color-surface) border border-(--color-border) text-(--color-accent)">
                          {prop.propertyType || 'home'}
                        </span>
                        <span className="text-xs font-bold text-(--color-text)">{prop.propertyName}</span>
                      </div>
                      <p className="text-[11px] text-(--color-text-secondary) mt-0.5">
                        Owner: {prop.customerName} · {prop.locality} · {prop.sanctionedLoadKw} kW ({prop.discom})
                      </p>
                    </div>

                    <select
                      value={prop.installationStatus || 'active'}
                      onChange={(e) => {
                        updateInstallationStatus(prop.id, e.target.value);
                        setAdminNotice(`Updated ${prop.propertyName} status to ${e.target.value}.`);
                      }}
                      className="px-2 py-1 rounded-lg text-[11px] font-mono border bg-(--color-surface) border-(--color-border) text-(--color-text)"
                    >
                      <option value="pending_assessment">pending_assessment</option>
                      <option value="visit_scheduled">visit_scheduled</option>
                      <option value="installation_in_progress">installation_in_progress</option>
                      <option value="active">active</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-(--color-border-subtle) flex items-center justify-between text-[11px] font-mono text-(--color-text-muted)">
                    <span>Setup Mode: {prop.setupMode || 'room-wise'}</span>
                    <span>{(prop.installedDevices || []).length} installed / {(prop.requestedDevices || []).length} requested</span>
                  </div>
                </div>
              ))}
            </div>
          </Surface>

          {/* 4. Hardware Catalogue & Inventory Administration */}
          <Surface variant="primary" padding="md" className="border border-(--color-border) space-y-4">
            <div className="flex items-center justify-between border-b border-(--color-border-subtle) pb-2.5">
              <div>
                <h2 className="text-sm font-bold text-(--color-text) flex items-center gap-2">
                  <Cpu size={16} className="text-(--color-accent)" />
                  <span>Hardware Catalogue &amp; SKU Stock Management</span>
                </h2>
                <p className="text-xs text-(--color-text-secondary) mt-0.5">
                  Toggle warehouse stock availability or add new 5AMPERE hardware modules.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(marketplaceHardware || []).map((hw) => (
                <div
                  key={hw.id}
                  className="p-3 rounded-xl border border-(--color-border) bg-(--color-surface-secondary) flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-(--color-accent) font-bold">{hw.model || hw.sku || hw.id}</div>
                    <div className="text-xs font-bold text-(--color-text) truncate">{hw.name}</div>
                    <div className="text-[11px] font-mono text-(--color-text-muted)">
                      ₹{(hw.priceINR || hw.priceInr || 0).toLocaleString('en-IN')} · {hw.category}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleHardwareStock(hw.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 cursor-pointer border ${
                      hw.inStock !== false
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : 'bg-red-500/10 text-red-600 border-red-500/30'
                    }`}
                  >
                    {hw.inStock !== false ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddHardware} className="pt-3 border-t border-(--color-border-subtle) grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
              <div>
                <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">Module Name</label>
                <input
                  type="text"
                  value={newHwForm.name}
                  onChange={(e) => setNewHwForm({ ...newHwForm, name: e.target.value })}
                  placeholder="e.g., 5AMPERE RS485 Bridge"
                  className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">SKU Code</label>
                <input
                  type="text"
                  value={newHwForm.sku}
                  onChange={(e) => setNewHwForm({ ...newHwForm, sku: e.target.value })}
                  placeholder="e.g., 5AMP-RS485"
                  className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-(--color-text-muted) block mb-1">Price (₹)</label>
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={newHwForm.priceInr}
                  onChange={(e) => setNewHwForm({ ...newHwForm, priceInr: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl text-xs border bg-(--color-surface-secondary) border-(--color-border) text-(--color-text)"
                />
              </div>
              <div>
                <Button type="submit" variant="primary" size="sm" className="w-full">
                  <Plus size={14} />
                  <span>Add Hardware SKU</span>
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      </main>

      <EvaluatorControls />
    </div>
  );
}

export default AdminDashboardPage;

