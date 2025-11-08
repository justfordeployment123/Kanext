import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Icon from './Icon';
import './ModulePanels.css';

const modules = [
  {
    id: 'player-iq',
    name: 'Player Evaluation',
    description: 'Scout and evaluate individual players',
    route: '/player-iq',
    icon: 'user'
  },
  {
    id: 'team-iq',
    name: 'Team Management',
    description: 'Build and optimize your roster',
    route: '/team-iq',
    icon: 'team'
  },
  {
    id: 'recruiting-iq',
    name: 'Recruiting',
    description: 'Track prospects and manage offers',
    route: '/recruiting-iq',
    icon: 'clipboard'
  },
  {
    id: 'predixt',
    name: 'Game Prediction',
    description: 'Simulate games and forecast results',
    route: '/predixt',
    icon: 'chart'
  }
];

const ModulePanels = () => {
  const navigate = useNavigate();
  const { coachingBias, addCoachKMessage } = useApp();
  const [hoveredModule, setHoveredModule] = useState(null);

  const handleModuleClick = (module) => {
    if (!coachingBias && module.id !== 'player-iq') {
      addCoachKMessage({
        speaker: 'Coach K',
        message: 'Please set up your Coaching IQ™ profile before accessing this module.',
        type: 'warning'
      });
      return;
    }

    addCoachKMessage({
      speaker: 'Coach K',
      message: `Opening ${module.name} workspace...`,
      type: 'info'
    });

    navigate(module.route);
  };

  return (
    <div className="module-panels">
      <div className="panels-grid">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`module-panel ${hoveredModule === module.id ? 'hovered' : ''}`}
            onClick={() => handleModuleClick(module)}
            onMouseEnter={() => setHoveredModule(module.id)}
            onMouseLeave={() => setHoveredModule(null)}
          >
            <div className="module-icon">
              <Icon name={module.icon} size={32} color="var(--color-gold)" />
            </div>
            <h3 className="module-name">{module.name}</h3>
            <p className="module-description">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulePanels;

