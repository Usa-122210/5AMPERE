import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
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
 * DeveloperAuthGuard — Protects /developer (and /technician alias).
 * Allows 'developer', 'technician', or 'admin' roles.
 */
function DeveloperAuthGuard({ theme, onToggleTheme }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage defaultRole="developer" />;
  }

  if (
    currentUser.role !== 'developer' &&
    currentUser.role !== 'technician' &&
    currentUser.role !== 'admin'
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <TechnicianShell theme={theme} onToggleTheme={onToggleTheme} />;
}

/**
 * AdminAuthGuard — Protects /admin.
 * Allows 'admin' role.
 */
function AdminAuthGuard() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage defaultRole="admin" />;
  }

  if (currentUser.role !== 'admin') {
    return (
      <Navigate
        to={currentUser.role === 'developer' || currentUser.role === 'technician' ? '/developer' : '/dashboard'}
        replace
      />
    );
  }

  return <AdminDashboardPage />;
}

/**
 * createAppRouter — Builds the React Router configuration.
 * Opens on the normal public homepage (/) without requiring login.
 */
export function createAppRouter(options = {}) {
  const { theme, onToggleTheme } = options;

  const publicAndUserRoutes = [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: 'dashboard',
      element: <OverviewPage />,
    },
    {
      path: 'monitoring',
      element: <LiveMonitoringPage />,
    },
    {
      path: 'rooms-appliances',
      element: <RoomsAppliancesPage />,
    },
    {
      path: 'appliances',
      element: <AppliancesPage />,
    },
    {
      path: 'devices',
      element: <DeviceMarketplacePage />,
    },
    {
      path: 'billing',
      element: <BillingTariffPage />,
    },
    {
      path: 'saving-mode',
      element: <SavingModePage />,
    },
    {
      path: 'alerts',
      element: <AlertsPage />,
    },
    {
      path: 'installation',
      element: <InstallationSupportPage />,
    },
    {
      path: 'analytics',
      element: <AnalyticsPage />,
    },
    {
      path: 'recommendations',
      element: <RecommendationsPage />,
    },
    {
      path: 'settings',
      element: <SettingsPage />,
    },
    {
      path: 'more',
      element: <MorePage />,
    },
    {
      path: 'preview',
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
    // Authentication Routes
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupOnboardingPage />,
    },

    // Admin Dashboard Route
    {
      path: '/admin',
      element: <AdminAuthGuard />,
    },

    // Developer Workspace Routes (/developer & /technician alias)
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

    // Normal Public Website & User Portal Routes (No forced login wall on /)
    {
      path: '/',
      element: <AppShell theme={theme} onToggleTheme={onToggleTheme} />,
      children: [
        ...publicAndUserRoutes,
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
    {
      path: '/index.html',
      element: <AppShell theme={theme} onToggleTheme={onToggleTheme} />,
      children: publicAndUserRoutes,
    },
  ]);
}

export const router = createAppRouter();
export default router;

