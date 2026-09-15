import React from 'react';
import { SakhiProvider, useSakhi } from './context/SakhiContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { HomeHero } from './components/HomeHero';
import { DashboardView } from './components/DashboardView';
import { PeriodTrackerView } from './components/PeriodTrackerView';
import { PregnancyTrackerView } from './components/PregnancyTrackerView';
import { MoodTrackerView } from './components/MoodTrackerView';
import { HealthReportsView } from './components/HealthReportsView';
import { ProfileView } from './components/ProfileView';
import { DailyLogModal } from './components/DailyLogModal';
import { AuthModal } from './components/AuthModal';
import { PrivacyTermsModal } from './components/PrivacyTermsModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { user, activeTab, downloadModalOpen, setDownloadModalOpen } = useSakhi();

  // If user is not logged in, show the Login Page as the very first page
  if (!user) {
    return (
      <>
        <LoginPage />
        <PrivacyTermsModal />
        <DownloadAppModal
          isOpen={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
        />
        <OfflineIndicator />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F9] text-rose-950 font-sans selection:bg-rose-200 selection:text-rose-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && <HomeHero />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'period' && <PeriodTrackerView />}
        {activeTab === 'pregnancy' && <PregnancyTrackerView />}
        {activeTab === 'mood' && <MoodTrackerView />}
        {activeTab === 'reports' && <HealthReportsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Global Modals */}
      <DailyLogModal />
      <AuthModal />
      <PrivacyTermsModal />
      <DownloadAppModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
      <OfflineIndicator />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <SakhiProvider>
      <AppContent />
    </SakhiProvider>
  );
}
