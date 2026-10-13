import { useState } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/home/Footer';
import { SizingModal } from '../components/home/SizingModal';
import { EnergyFlowBackground } from '../components/motion/EnergyFlowBackground';
import { HomePage } from '../pages/HomePage';
import { OverviewPage } from '../pages/OverviewPage';
import { LiveMonitoringPage } from '../pages/LiveMonitoringPage';
import { AppliancesPage } from '../pages/AppliancesPage';
import { SavingModePage } from '../pages/SavingModePage';
import { BillingTariffPage } from '../pages/BillingTariffPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { AlertsPage } from '../pages/AlertsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { MorePage } from '../pages/MorePage';
import { FoundationPreview } from '../pages/FoundationPreview';

// Customer Hardware, Topology & Support Pages
import { RoomsAppliancesPage } from '../pages/customer/RoomsAppliancesPage';
import { DeviceMarketplacePage } from '../pages/customer/DeviceMarketplacePage';
import { InstallationSupportPage } from '../pages/customer/InstallationSupportPage';

// Authentication & Onboarding Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupOnboardingPage } from '../pages/auth/SignupOnboardingPage';

// Developer / Technician Workspace Shell & Pages
import { TechnicianShell } from '../components/layout/TechnicianShell';
import { TechnicianOverviewPage } from '../pages/technician/TechnicianOverviewPage';
import { CustomerProfilesPage } from '../pages/technician/CustomerProfilesPage';
import { AppointmentsPage } from '../pages/technician/AppointmentsPage';
import { ServiceRequestsPage } from '../pages/technician/ServiceRequestsPage';
import { TechnicianCataloguePage } from '../pages/technician/TechnicianCataloguePage';
import { HomeConfiguratorPage } from '../pages/technician/HomeConfiguratorPage';

// Admin Dashboard Page
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';

// Auth State Context
import { useAuth } from '../context/AuthContext';

/**
 * PublicLayout — Clean commercial website shell for the public landing page (/).
 * Does NOT render AppSidebar, private household telemetry, or EvaluatorControls.
 */
function PublicLayout({ theme, onToggleTheme }) {
  const [isSizingOpen, setIsSizingOpen] = useState(false);

  return (
    <div
      id="top"
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <EnergyFlowBackground intensity="subtle" />
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className="relative z-10 flex-1 w-full min-w-0">
        <Outlet context={{ openSizing: () => setIsSizingOpen(true) }} />
      </main>
      <Footer onOpenSizing={() => setIsSizingOpen(true)} />
      <SizingModal isOpen={isSizingOpen} onClose={() => setIsSizingOpen(false)} />
    </div>
  );
}

/**
 * UserAuthGuard — Protects User Portal routes (/dashboard, /appliances, /billing, etc.).
 * Redirects unauthenticated visitors to /login.
 * Redirects Developer to /developer and Admin to /admin.
 */
function UserAuthGuard({ theme, onToggleTheme }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'developer' || currentUser.role === 'technician') {
    return <Navigate to="/developer" replace />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <AppShell theme={theme} onToggleTheme={onToggleTheme} />;
}

/**
 * DeveloperAuthGuard — Protects /developer (and /technician alias).
 * Redirects unauthenticated visitors to /login.
 * Redirects Admin to /admin and User to /dashboard.
 */
function DeveloperAuthGuard({ theme, onToggleTheme }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (currentUser.role !== 'developer' && currentUser.role !== 'technician') {
    return <Navigate to="/dashboard" replace />;
  }

  return <TechnicianShell theme={theme} onToggleTheme={onToggleTheme} />;
}

/**
 * AdminAuthGuard — Protects /admin.
 * Redirects unauthenticated visitors to /login.
 * Redirects Developer to /developer and User to /dashboard.
 */
function AdminAuthGuard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'developer' || currentUser.role === 'technician') {
    return <Navigate to="/developer" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminDashboardPage />;
}

/**
 * createAppRouter — Builds the React Router configuration with strict
 * public vs role-protected separation.
 */
export function createAppRouter(options = {}) {
  const { theme, onToggleTheme } = options;

  const userPortalRoutes = [
    {
      path: '/dashboard',
      element: <OverviewPage />,
    },
    {
      path: '/monitoring',
      element: <LiveMonitoringPage />,
    },
    {
      path: '/rooms-appliances',
      element: <RoomsAppliancesPage />,
    },
    {
      path: '/appliances',
      element: <AppliancesPage />,
    },
    {
      path: '/devices',
      element: <DeviceMarketplacePage />,
    },
    {
      path: '/billing',
      element: <BillingTariffPage />,
    },
    {
      path: '/saving-mode',
      element: <SavingModePage />,
    },
    {
      path: '/alerts',
      element: <AlertsPage />,
    },
    {
      path: '/installation',
      element: <InstallationSupportPage />,
    },
    {
      path: '/analytics',
      element: <AnalyticsPage />,
    },
    {
      path: '/recommendations',
      element: <RecommendationsPage />,
    },
    {
      path: '/settings',
      element: <SettingsPage />,
    },
    {
      path: '/more',
      element: <MorePage />,
    },
    {
      path: '/preview',
      element: <FoundationPreview />,
    },
  ];

  const developerRoutes = [
    {
      index: true,
      element: <TechnicianOverviewPage />,
    },
    {
      path: 'customers',
      element: <CustomerProfilesPage />,
    },
    {
      path: 'appointments',
      element: <AppointmentsPage />,
    },
    {
      path: 'service-requests',
      element: <ServiceRequestsPage />,
    },
    {
      path: 'catalogue',
      element: <TechnicianCataloguePage />,
    },
    {
      path: 'configure',
      element: <HomeConfiguratorPage />,
    },
    {
      path: 'configure/:homeId',
      element: <HomeConfiguratorPage />,
    },
  ];

  return createBrowserRouter([
    // 1. Public Commercial Website (Accessible without login)
    {
      path: '/',
      element: <PublicLayout theme={theme} onToggleTheme={onToggleTheme} />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
    },
    {
      path: '/index.html',
      element: <PublicLayout theme={theme} onToggleTheme={onToggleTheme} />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
    },

    // 2. Public Authentication Routes
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupOnboardingPage />,
    },

    // 3. Protected Admin Dashboard Route
    {
      path: '/admin',
      element: <AdminAuthGuard />,
    },

    // 4. Protected Developer Workspace Routes (/developer & /technician)
    {
      path: '/developer',
      element: <DeveloperAuthGuard theme={theme} onToggleTheme={onToggleTheme} />,
      children: developerRoutes,
    },
    {
      path: '/technician',
      element: <DeveloperAuthGuard theme={theme} onToggleTheme={onToggleTheme} />,
      children: developerRoutes,
    },

    // 5. Protected User Portal Routes (/dashboard, /monitoring, /appliances, /billing, etc.)
    {
      element: <UserAuthGuard theme={theme} onToggleTheme={onToggleTheme} />,
      children: userPortalRoutes,
    },

    // 6. Catch-all fallback to public homepage
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);
}

export const router = createAppRouter();
export default router;
