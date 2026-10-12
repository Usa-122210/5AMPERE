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

// Customer Hardware & Support Pages
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

/**
 * createAppRouter — Builds the React Router configuration.
 *
 * Configures role-separated routes:
 *   - Customer Portal (AppShell):
 *     - '/' : Home Electricity Dashboard
 *     - '/appliances' : Appliance Management & Relay Controls
 *     - '/billing' : Electricity Bill Breakdown & UPPCL Slabs
 *     - '/saving-mode' : Dedicated Saving Mode & Budget Pacing
 *     - '/devices' : Device Marketplace & Installed Hardware
 *     - '/installation' : Installation & Support Progress Tracker
 *     - '/more', '/analytics', '/alerts', '/recommendations', '/monitoring', '/settings'
 *   - Authentication:
 *     - '/login' : Dual-Path Login (Homeowner + Staff)
 *     - '/signup' : 4-Step Homeowner Onboarding Wizard
 *   - Technician Workspace (TechnicianShell):
 *     - '/technician' : Field Operations Overview
 *     - '/technician/customers' : Customer Homes & Profile Inspector
 *     - '/technician/appointments' : Field Visits Calendar
 *     - '/technician/service-requests' : Inbound Device Requests Queue
 *     - '/technician/catalogue' : Hardware Engineering Catalogue
 *     - '/technician/configure' & '/technician/configure/:homeId' : Hardware Configurator
 */
export function createAppRouter(options = {}) {
  const { theme, onToggleTheme } = options;

  const customerRoutes = [
    {
      index: true,
      element: <OverviewPage />,
    },
    {
      path: 'appliances',
      element: <AppliancesPage />,
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
      path: 'devices',
      element: <DeviceMarketplacePage />,
    },
    {
      path: 'installation',
      element: <InstallationSupportPage />,
    },
    {
      path: 'monitoring',
      element: <LiveMonitoringPage />,
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
      path: 'alerts',
      element: <AlertsPage />,
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
    // Authentication Routes
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
      element: <TechnicianShell theme={theme} onToggleTheme={onToggleTheme} />,
      children: technicianRoutes,
    },

    // Homeowner / Customer Portal Routes
    {
      path: '/',
      element: <AppShell theme={theme} onToggleTheme={onToggleTheme} />,
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
      element: <AppShell theme={theme} onToggleTheme={onToggleTheme} />,
      children: customerRoutes,
    },
  ]);
}

export const router = createAppRouter();
export default router;

