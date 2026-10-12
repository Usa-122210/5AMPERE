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

/**
 * createAppRouter — Builds the React Router configuration.
 *
 * Configures dedicated, modular pages:
 *   - '/' : Overview Dashboard
 *   - '/monitoring' : Live Monitoring & Electrical Telemetry
 *   - '/appliances' : Appliance Management & Relay Controls
 *   - '/saving-mode' : Dedicated Saving Mode & Budget Pacing
 *   - '/billing' : Electricity Bill Breakdown & UPPCL Slabs
 *   - '/analytics' : Analytics, 24-Hour Trends & Diurnal Curve
 *   - '/recommendations' : AI Insights & BEE Optimization Simulator
 *   - '/alerts' : Alerts & Threshold Notifications
 *   - '/settings' : Settings & Connection Preferences
 *   - '/preview' : Design System Foundation Preview
 */
export function createAppRouter(options = {}) {
  const { theme, onToggleTheme } = options;

  const routes = [
    {
      index: true,
      element: <OverviewPage />,
    },
    {
      path: 'monitoring',
      element: <LiveMonitoringPage />,
    },
    {
      path: 'appliances',
      element: <AppliancesPage />,
    },
    {
      path: 'saving-mode',
      element: <SavingModePage />,
    },
    {
      path: 'billing',
      element: <BillingTariffPage />,
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
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ];

  return createBrowserRouter([
    {
      path: '/',
      element: <AppShell theme={theme} onToggleTheme={onToggleTheme} />,
      children: routes,
    },
    {
      path: '/index.html',
      element: <AppShell theme={theme} onToggleTheme={onToggleTheme} />,
      children: routes,
    },
  ]);
}

export const router = createAppRouter();
export default router;
