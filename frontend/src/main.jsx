import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider, useApp } from './context/AppContext';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import PathSelectionPage from './pages/PathSelectionPage';
import PathDetailsPage from './pages/PathDetailsPage';
import LessonPage from './pages/LessonPage';
import LearnPage from './pages/LearnPage';
import GenericPage from './pages/GenericPage';
import CodeLabPage from './pages/CodeLabPage';
import DungeonPage from './pages/DungeonPage';
import Stage2Page from './pages/Stage2Page';
import HackathonPage from './pages/HackathonPage';
import ClubsPage from './pages/ClubsPage';
import { CheckCircle2 } from 'lucide-react';
import './styles/tokens.css';
import './styles/redesign.css';
import './styles/journey-redesign.css';
import './style.css';

function AppContent() {
  const { currentRoute, toastMessage } = useApp();
  const routePath = currentRoute.path;

  // Unauthenticated standalone login view
  if (routePath === 'signin') {
    return <AuthPage />;
  }

  // Full-width distraction-free studio for Lesson, Path Details, Stage 2, and DSA Dungeon
  const isStudioMode = routePath === 'lesson' || routePath.startsWith('path/') || routePath === 'dungeon' || routePath === 'tunnel/dsa';

  const renderActiveScreen = () => {
    if (routePath === 'home') return <HomePage />;
    if (routePath === 'discover') return <PathSelectionPage />;
    if (routePath.startsWith('path/')) return <PathDetailsPage />;
    if (routePath === 'stage2') return <Stage2Page />;
    if (routePath === 'lesson') return <LessonPage />;
    if (routePath.startsWith('level/')) return <GenericPage type="level" />;
    if (routePath === 'dungeon' || routePath === 'tunnel/dsa') return <DungeonPage />;
    if (routePath === 'learn') return <LearnPage />;
    if (routePath === 'build') return <CodeLabPage />;
    if (routePath === 'hackathon' || routePath === 'events') return <HackathonPage />;
    if (routePath === 'clubs') return <ClubsPage />;
    if (routePath === 'challenges') return <GenericPage type="challenges" />;
    if (routePath === 'profile') return <GenericPage type="profile" />;

    // Default route fallback
    return <HomePage />;
  };

  return (
    <div className={`teklozy-app-shell ${isStudioMode ? 'studio-mode' : ''}`}>
      <Topbar />

      <div className="teklozy-layout-body">
        {!isStudioMode && <Sidebar />}

        <main className={`teklozy-main-viewport ${routePath === 'dungeon' || routePath === 'tunnel/dsa' ? 'viewport-dungeon' : isStudioMode ? 'viewport-fullwidth' : ''} ${routePath === 'build' ? 'viewport-codelab' : ''} ${routePath === 'home' ? 'viewport-home' : ''}`}>
          {renderActiveScreen()}
        </main>
      </div>

      {/* Global Interactive Toast Notification */}
      {toastMessage && (
        <div className="global-toast-notification" role="status" aria-live="polite">
          <CheckCircle2 size={17} className="toast-check-icon" />
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

function Root() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<Root />);
}
