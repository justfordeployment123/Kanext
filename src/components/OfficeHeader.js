import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { logout } from '../services/authService';
import Icon from './Icon';
import './OfficeHeader.css';

const OfficeHeader = ({ onOpenDrawer }) => {
  const navigate = useNavigate();
  const { coachProfile, coachingBias, teamState, toggleCoachK, setCoachProfile } = useApp();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      setCoachProfile(null);
      navigate('/login');
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
            <span>Player IQ</span>
          </button>
          <button className="quick-tab" onClick={() => navigate('/team-iq')}>
            <Icon name="team" size={16} />
            <span>Team IQ™</span>
          </button>
          <button className="quick-tab" onClick={() => navigate('/recruiting-iq')}>
            <Icon name="clipboard" size={16} />
            <span>Recruiting IQ™</span>
          </button>
          <button className="quick-tab" onClick={onOpenDrawer}>
            <Icon name="brain" size={16} />
            <span>Coaching IQ™</span>
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

