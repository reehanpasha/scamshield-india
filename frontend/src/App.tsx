import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { UrlScannerPage } from './pages/UrlScannerPage';
import { MessageScannerPage } from './pages/MessageScannerPage';
import { ThreatExplorerPage } from './pages/ThreatExplorerPage';
import { ScamReportsPage } from './pages/ScamReportsPage';
import { InvestigationPage } from './pages/InvestigationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { EducationPage } from './pages/EducationPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          {/* 1. Cinematic Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* 2. Security Operations Overview */}
          <Route path="/dashboard" element={<OverviewPage />} />

          {/* 3. URL Intelligence Engine */}
          <Route path="/url-scanner" element={<UrlScannerPage />} />

          {/* 4. Message & Phishing Lab */}
          <Route path="/message-scanner" element={<MessageScannerPage />} />

          {/* 5. Threat Explorer */}
          <Route path="/threat-explorer" element={<ThreatExplorerPage />} />

          {/* 6. Community Scam Reports */}
          <Route path="/community-reports" element={<ScamReportsPage />} />

          {/* 7. Incident Investigation Workspace */}
          <Route path="/investigations" element={<InvestigationPage />} />

          {/* 8. Macro Analytics */}
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* 9. Official Indian Cyber Safety Center */}
          <Route path="/cyber-safety" element={<EducationPage />} />

          {/* 10. Platform Settings */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
