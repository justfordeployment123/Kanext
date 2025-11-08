import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from './Icon';
import './OfficeHeader.css';

const OfficeHeader = ({ onOpenDrawer }) => {
  const navigate = useNavigate();
  const { coachProfile, coachingBias, teamState, toggleCoachK } = useApp();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <header className="office-header">
      {/* Layer 1 - Primary Navigation */}
      <div className="header-layer-1">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/office')}>
            <span className="logo-text">KaNeXT IQ</span>
          </div>
        </div>

        <div className="header-center">
          <button className="quick-tab" onClick={() => navigate('/player-iq')}>
            <Icon name="user" size={16} />
            <span>Players</span>
          </button>
          <button className="quick-tab" onClick={() => navigate('/team-iq')}>
            <Icon name="team" size={16} />
            <span>Team</span>
          </button>
          <button className="quick-tab" onClick={() => navigate('/recruiting-iq')}>
            <Icon name="clipboard" size={16} />
            <span>Recruiting</span>
          </button>
          <button className="quick-tab" onClick={() => navigate('/predixt')}>
            <Icon name="chart" size={16} />
            <span>Predict</span>
          </button>
        </div>

        <div className="header-right">
          <button 
            className="icon-btn" 
            title="AI Assistant"
            onClick={toggleCoachK}
          >
            <Icon name="bot" size={18} />
          </button>
          <button 
            className="icon-btn" 
            title="Settings"
            onClick={onOpenDrawer}
          >
            <Icon name="brain" size={18} />
          </button>
          <button 
            className="icon-btn logout-btn" 
            title="Logout"
            onClick={handleLogout}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </div>

      {/* Layer 2 - Context Strip */}
      <div className="header-layer-2">
        <span className="context-item">
          {coachProfile?.team || 'Team'}
        </span>
        <span className="context-divider">·</span>
        <span className="context-item">
          {coachingBias?.offensiveSystem || coachProfile?.offense || 'System'}
        </span>
        <span className="context-divider">·</span>
        <span className="context-item">
          {teamState?.roster?.length || 0} Players
        </span>
      </div>
    </header>
  );
};

export default OfficeHeader;

