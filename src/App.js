import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OfficePage from './pages/OfficePage';
import PlayerIQPage from './pages/PlayerIQPage';
import TeamIQPage from './pages/TeamIQPage';
import RecruitingIQPage from './pages/RecruitingIQPage';
import PrediXtPage from './pages/PrediXtPage';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/office" element={<OfficePage />} />
          <Route path="/player-iq" element={<PlayerIQPage />} />
          <Route path="/team-iq" element={<TeamIQPage />} />
          <Route path="/recruiting-iq" element={<RecruitingIQPage />} />
          <Route path="/predixt" element={<PrediXtPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

