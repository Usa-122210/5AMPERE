import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
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

// Technician / Company Staff Shell & Pages
import { TechnicianShell } from '../components/layout/TechnicianShell';
import { TechnicianOverviewPage } from '../pages/technician/TechnicianOverviewPage';
import { CustomerProfilesPage } from '../pages/technician/CustomerProfilesPage';
import { AppointmentsPage } from '../pages/technician/AppointmentsPage';
import { ServiceRequestsPage } from '../pages/technician/ServiceRequestsPage';
import { TechnicianCataloguePage } from '../pages/technician/TechnicianCataloguePage';
import { HomeConfiguratorPage } from '../pages/technician/HomeConfiguratorPage';

// Auth State Context
import { useAuth } from '../context/AuthContext';

/**
 * CustomerAuthGuard — Root entry guard.
 * If unauthenticated, displays LoginPage immediately with zero delay.
 * If authenticated as technician, directs to technician operations workspace.
 * If customer, renders the full customer AppShell.
 */
function CustomerAuthGuard({ theme, onToggleTheme }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage defaultTab="customer" />;
  }

  if (currentUser.role === 'technician') {
    return <Navigate to="/technician" replace />;
  }

  return <AppShell theme={theme} onToggleTheme={onToggleTheme} />;
}

/**
 * TechnicianAuthGuard — Staff portal guard.
 * If unauthenticated, displays LoginPage with Staff tab pre-selected.
 * If customer, redirects back to customer overview.
 * If technician, renders TechnicianShell.
 */
function TechnicianAuthGuard({ theme, onToggleTheme }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage defaultTab="staff" />;
  }

  if (currentUser.role !== 'technician') {
    return <Navigate to="/" replace />;
  }

  return <TechnicianShell theme={theme} onToggleTheme={onToggleTheme} />;
}

/**
 * createAppRouter — Builds the React Router configuration.
 */
export function createAppRouter(options = {}) {
  const { theme, onToggleTheme } = options;

  const customerRoutes = [
    {
      index: true,
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

  const technicianRoutes = [
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
    // Public / Entry Authentication Routes
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/signup',
      element: <SignupOnboardingPage />,
    },

    // Technician / Company Staff Workspace Routes
    {
      path: '/technician',
      element: <TechnicianAuthGuard theme={theme} onToggleTheme={onToggleTheme} />,
      children: technicianRoutes,
    },

    // Customer Portal Routes (Protected by CustomerAuthGuard)
    {
      path: '/',
      element: <CustomerAuthGuard theme={theme} onToggleTheme={onToggleTheme} />,
      children: [
        ...customerRoutes,
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
    {
      path: '/index.html',
      element: <CustomerAuthGuard theme={theme} onToggleTheme={onToggleTheme} />,
      children: customerRoutes,
    },
  ]);
}

export const router = createAppRouter();
export default router;
