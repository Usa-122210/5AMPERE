import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { EnergyFlowBackground } from '../motion/EnergyFlowBackground';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { SizingModal } from '../home/SizingModal';
import { TariffConfigModal } from '../dashboard/TariffConfigModal';
import { EnergyDataProvider, useEnergyData } from '../../context/EnergyDataContext';
import { useTheme } from '../../hooks/useTheme';

function AppShellInner({ theme, onToggleTheme }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSizingOpen, setIsSizingOpen] = useState(false);
  const {
    isTariffModalOpen,
    closeTariffModal,
    confirmationModal,
    closeConfirmationModal,
  } = useEnergyData();

  return (
    <div id="top" className="relative min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Ambient animated energy background */}
      <EnergyFlowBackground intensity="subtle" />

      {/* Top Application Header */}
      <AppHeader
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenSizing={() => setIsSizingOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area (Offset by sidebar width on desktop) */}
        <main className="relative z-10 flex-1 lg:pl-64 w-full min-w-0 transition-all duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet context={{ openSizing: () => setIsSizingOpen(true) }} />
          </div>
        </main>
      </div>

      {/* Safety Confirmation Dialog for Contactor Relays & Shedding */}
      <ConfirmationModal
        modalState={confirmationModal}
        onClose={closeConfirmationModal}
      />

      {/* Hardware Sizing & Early Access Modal */}
      <SizingModal
        isOpen={isSizingOpen}
        onClose={() => setIsSizingOpen(false)}
      />

      {/* Indian Electricity Tariff & DISCOM Configuration Modal */}
      <TariffConfigModal
        isOpen={isTariffModalOpen}
        onClose={closeTariffModal}
      />
    </div>
  );
}

/**
 * AppShell — Application layout wrapper providing context, layout, and modals.
 */
export function AppShell({ theme: propTheme, onToggleTheme: propToggleTheme }) {
  const hookTheme = useTheme();
  const theme = propTheme || hookTheme.theme;
  const onToggleTheme = propToggleTheme || hookTheme.toggleTheme;

  return (
    <EnergyDataProvider>
      <AppShellInner theme={theme} onToggleTheme={onToggleTheme} />
    </EnergyDataProvider>
  );
}

export default AppShell;
