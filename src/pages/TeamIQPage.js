import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './TeamIQPage.css';

const TeamIQPage = () => {
  const navigate = useNavigate();
  const { coachProfile, coachingBias, teamState, setTeamState } = useApp();
  
  const [activeView, setActiveView] = useState('roster'); // roster or depth
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamMetrics, setTeamMetrics] = useState({
    teamKPI: 0,
    systemFit: 0,
    scholarshipUsage: 0,
    nilUtilized: 0,
    confidenceAvg: 0
  });

  useEffect(() => {
    // Calculate team metrics
    if (teamState.roster && teamState.roster.length > 0) {
      const avgKPI = teamState.roster.reduce((sum, p) => sum + (p.kpi || 0), 0) / teamState.roster.length;
      const avgFit = teamState.roster.reduce((sum, p) => sum + (p.fit || 0), 0) / teamState.roster.length;
      const avgConf = teamState.roster.reduce((sum, p) => sum + (p.confidence || 0), 0) / teamState.roster.length;
      const totalScholarship = teamState.roster.reduce((sum, p) => sum + parseFloat(p.scholarship || 0), 0);
      const totalNIL = teamState.roster.reduce((sum, p) => sum + parseFloat(p.nil || 0), 0);
      const maxNIL = coachingBias?.nilPool || 50000;

      setTeamMetrics({
        teamKPI: avgKPI.toFixed(1),
        systemFit: Math.round(avgFit),
        scholarshipUsage: totalScholarship,
        nilUtilized: Math.round((totalNIL / maxNIL) * 100),
        confidenceAvg: Math.round(avgConf)
      });
    }
  }, [teamState.roster, coachingBias]);

  const handleRemovePlayer = (playerId) => {
    if (window.confirm('Remove this player from roster?')) {
      setTeamState(prev => ({
        ...prev,
        roster: prev.roster.filter(p => p.id !== playerId)
      }));
      setSelectedPlayer(null);
    }
  };

  if (!coachProfile) {
    navigate('/login');
    return null;
  }

  return (
    <div className="team-iq-page">
      {/* Header */}
      <header className="team-iq-header">
        <div className="header-top">
          <div className="header-left">
            <h1>TEAM IQ™ DASHBOARD</h1>
            <p className="subtitle">Aggregate roster intelligence · system readiness · resource balance.</p>
            <div className="context-line">
              Team: {coachProfile.team} · Division: {coachProfile.division} · 
              System: {coachingBias?.offensiveSystem || 'Not Set'} / {coachingBias?.defensiveSystem || 'Not Set'} · 
              Roster: {teamState.roster?.length || 0} Players
            </div>
          </div>
          <div className="header-right">
            <button className="nav-btn" onClick={() => navigate('/recruiting-iq')}>
              📋 Add from Recruiting
            </button>
            <button className="nav-btn" onClick={() => navigate('/office')}>
              🏠 Office
            </button>
          </div>
        </div>

        {/* Summary Line */}
        <div className="summary-line">
          <div className="summary-item">
            <span className="label">Team KPI:</span>
            <span className="value">{teamMetrics.teamKPI}</span>
          </div>
          <div className="summary-item">
            <span className="label">System Fit:</span>
            <span className="value">{teamMetrics.systemFit}%</span>
          </div>
          <div className="summary-item">
            <span className="label">Scholarship Usage:</span>
            <span className="value">{teamMetrics.scholarshipUsage} / {coachingBias?.scholarshipCap || 12}</span>
          </div>
          <div className="summary-item">
            <span className="label">NIL Utilized:</span>
            <span className="value">{teamMetrics.nilUtilized}%</span>
          </div>
          <div className="summary-item">
            <span className="label">Confidence Avg:</span>
            <span className="value">{teamMetrics.confidenceAvg}%</span>
          </div>
        </div>
      </header>

      {/* View Tabs */}
      <div className="view-tabs">
        <button 
          className={`tab ${activeView === 'roster' ? 'active' : ''}`}
          onClick={() => setActiveView('roster')}
        >
          Roster View
        </button>
        <button 
          className={`tab ${activeView === 'depth' ? 'active' : ''}`}
          onClick={() => setActiveView('depth')}
        >
          Depth Chart
        </button>
      </div>

      {/* Content Area */}
      <div className="team-iq-content">
        {/* Roster View */}
        {activeView === 'roster' && (
          <div className="roster-view">
            {teamState.roster && teamState.roster.length > 0 ? (
              <div className="roster-table-container">
                <table className="roster-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>POS</th>
                      <th>OVR</th>
                      <th>FIT %</th>
                      <th>CONF %</th>
                      <th>SCH $</th>
                      <th>NIL $</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamState.roster.map((player) => (
                      <tr key={player.id} onClick={() => setSelectedPlayer(player)}>
                        <td className="player-name">{player.name}</td>
                        <td>{player.position}</td>
                        <td className="kpi-value">{player.kpi}</td>
                        <td>{player.fit}%</td>
                        <td>{player.confidence}%</td>
                        <td>${player.scholarship}</td>
                        <td>${player.nil}</td>
                        <td>
                          <button 
                            className="action-btn delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePlayer(player.id);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Expanded Player View */}
                {selectedPlayer && (
                  <div className="player-detail-panel">
                    <div className="panel-header">
                      <h3>{selectedPlayer.name}</h3>
                      <button onClick={() => setSelectedPlayer(null)}>×</button>
                    </div>
                    <div className="panel-content">
                      <div className="detail-row">
                        <span className="label">Position:</span>
                        <span className="value">{selectedPlayer.position}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Overall KPI:</span>
                        <span className="value gold">{selectedPlayer.kpi}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">System Fit:</span>
                        <span className="value">{selectedPlayer.fit}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Confidence:</span>
                        <span className="value">{selectedPlayer.confidence}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Scholarship:</span>
                        <span className="value">${selectedPlayer.scholarship}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">NIL Value:</span>
                        <span className="value">${selectedPlayer.nil}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏀</div>
                <h3>No Players on Roster</h3>
                <p>Add players from Player IQ™ or Recruiting IQ™ to build your roster.</p>
                <button className="primary-btn" onClick={() => navigate('/player-iq')}>
                  Evaluate Players
                </button>
              </div>
            )}
          </div>
        )}

        {/* Depth Chart View */}
        {activeView === 'depth' && (
          <div className="depth-chart-view">
            <div className="depth-chart-grid">
              {['PG', 'CG', 'Wing', 'Forward', 'Big'].map(position => (
                <div key={position} className="position-column">
                  <div className="position-header">{position}</div>
                  <div className="position-slots">
                    {teamState.roster
                      ?.filter(p => p.position === position || 
                        (position === 'CG' && p.position === 'SG') ||
                        (position === 'Wing' && (p.position === 'SF' || p.position === 'SG')) ||
                        (position === 'Forward' && (p.position === 'PF' || p.position === 'SF')) ||
                        (position === 'Big' && (p.position === 'C' || p.position === 'PF'))
                      )
                      .map(player => (
                        <div key={player.id} className="player-card">
                          <div className="card-name">{player.name}</div>
                          <div className="card-stats">
                            <span>OVR: {player.kpi}</span>
                            <span>FIT: {player.fit}%</span>
                          </div>
                        </div>
                      ))}
                    {!teamState.roster?.some(p => 
                      p.position === position ||
                      (position === 'CG' && p.position === 'SG') ||
                      (position === 'Wing' && (p.position === 'SF' || p.position === 'SG')) ||
                      (position === 'Forward' && (p.position === 'PF' || p.position === 'SF')) ||
                      (position === 'Big' && (p.position === 'C' || p.position === 'PF'))
                    ) && (
                      <div className="empty-slot">No players</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="team-evaluation">
              <h3>Team Analysis</h3>
              <p>
                {teamState.roster?.length > 0 
                  ? `Current roster shows ${teamMetrics.teamKPI} Team KPI with ${teamMetrics.systemFit}% system alignment. ` +
                    `Roster is ${teamState.roster.length < 10 ? 'below optimal depth' : 'at competitive depth'}.`
                  : 'Add players to see team analysis.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamIQPage;

