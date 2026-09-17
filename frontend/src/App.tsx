import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/public/LandingPage';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { ExploreCommunitiesPage } from './components/public/ExploreCommunitiesPage';
import { GlobalImpactPage } from './components/public/GlobalImpactPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { RecordActionModal } from './components/actions/RecordActionModal';
import { AdminReviewModal } from './components/admin/AdminReviewModal';
import { ShareModal } from './components/social/ShareModal';
import { AiAssistantModal } from './components/assistant/AiAssistantModal';

const isDashboardTab = (tab: string) =>
  [
    'dashboard',
    'actions',
    'my_impact',
    'my_community',
    'challenges',
    'climate_map',
    'leaderboard',
    'local_events',
  ].includes(tab);

import { ThemeProvider } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated } = usePlatform();

  React.useEffect(() => {
    if (!isAuthenticated && isDashboardTab(activeTab)) {
      setActiveTab('login');
    }
  }, [isAuthenticated, activeTab, setActiveTab]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage />;
      case 'how_it_works':
        return <HowItWorksPage />;
      case 'explore_communities':
      case 'communities':
        return <ExploreCommunitiesPage />;
      case 'global_impact':
        return <GlobalImpactPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
      case 'actions':
      case 'my_impact':
      case 'my_community':
      case 'challenges':
      case 'climate_map':
      case 'leaderboard':
      case 'local_events':
        return isAuthenticated ? <UserDashboard /> : <LoginPage />;
      default:
        return <LandingPage />;
    }
  };

  const isAuthPage = activeTab === 'login' || activeTab === 'register';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {!isAuthPage && <Header />}
      <main className="flex-1">
        {renderActiveView()}
      </main>
      {!isAuthPage && <Footer />}

      {/* Global Modals */}
      <RecordActionModal />
      <AdminReviewModal />
      <ShareModal />
      <AiAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <PlatformProvider>
        <AppContent />
      </PlatformProvider>
    </ThemeProvider>
  );
}

