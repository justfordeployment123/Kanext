import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isAuthenticated } from '../services/authService';
import CoachingIQDrawer from '../components/CoachingIQDrawer';
import './TeamIQPage.css';

const TeamIQPage = () => {
  const navigate = useNavigate();
  const { coachProfile, coachingBias, teamState, setTeamState } = useApp();
  
  const [activeView, setActiveView] = useState('roster'); // roster or depth
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [expandedPlayerTab, setExpandedPlayerTab] = useState('kpi'); // kpi, financial, flags, notes
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [depthChartState, setDepthChartState] = useState({}); // Sandbox state for depth chart
  const [showTeamEvaluation, setShowTeamEvaluation] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
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
      console.log('[LOGIC HOOK: handleRemovePlayer] Removing player:', playerId);
      setTeamState(prev => ({
        ...prev,
        roster: prev.roster.filter(p => p.id !== playerId)
      }));
      setSelectedPlayer(null);
    }
  };

  const handleSavePlayerChanges = () => {
    if (selectedPlayer) {
      console.log('[LOGIC HOOK: handleSavePlayerChanges] Saving changes for player:', selectedPlayer);
      setTeamState(prev => ({
        ...prev,
        roster: prev.roster.map(p => p.id === selectedPlayer.id ? selectedPlayer : p)
      }));
      alert('✅ Player changes saved');
    }
  };

  const handleDragStart = (e, player) => {
    setDraggedPlayer(player);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPosition) => {
    e.preventDefault();
    if (draggedPlayer) {
      console.log('[LOGIC HOOK: handleDrop] Moving player to position:', {
        playerId: draggedPlayer.id,
        playerName: draggedPlayer.name,
        targetPosition: targetPosition
      });
      setDepthChartState(prev => ({
        ...prev,
        [targetPosition]: [...(prev[targetPosition] || []), draggedPlayer]
      }));
      setDraggedPlayer(null);
    }
  };

  const handleEvaluateTeam = () => {
    console.log('[LOGIC HOOK: handleEvaluateTeam] Running team evaluation');
    setShowTeamEvaluation(true);
  };

  const handleRunPrediXt = () => {
    console.log('[LOGIC HOOK: handleRunPrediXt] Running PrediXt with current lineup:', depthChartState);
    navigate('/predixt');
  };

  const handleApplyToRoster = () => {
    console.log('[LOGIC HOOK: handleApplyToRoster] Applying sandbox lineup to roster:', depthChartState);
    alert('✅ Lineup applied to roster');
  };

  // Sample data for Phase 1 demonstration
  const sampleRoster = teamState.roster && teamState.roster.length > 0 
    ? teamState.roster 
    : [
        { id: '1', name: 'J. Murray', position: 'PG', age: 24, kpi: 85, fit: 81, confidence: 84, scholarship: 12000, nil: 7200, eligibility: 'Active', flags: [] },
        { id: '2', name: 'M. Johnson', position: 'SG', age: 22, kpi: 78, fit: 75, confidence: 82, scholarship: 10000, nil: 5400, eligibility: 'Active', flags: [] },
        { id: '3', name: 'T. Williams', position: 'SF', age: 21, kpi: 82, fit: 88, confidence: 79, scholarship: 11000, nil: 6800, eligibility: 'Active', flags: [] },
        { id: '4', name: 'C. Davis', position: 'PF', age: 23, kpi: 76, fit: 72, confidence: 77, scholarship: 9500, nil: 4800, eligibility: 'Active', flags: [] }
      ];

  const displayRoster = teamState.roster && teamState.roster.length > 0 ? teamState.roster : sampleRoster;

  // Simple direct handlers - no useCallback to avoid any closure issues
  const handleViewChange = (view) => {
    console.log('[LOGIC HOOK] Switching view to:', view, 'current:', activeView);
    if (activeView !== view) {
      setActiveView(view);
    }
  };

  useEffect(() => {
    if (!isAuthenticated() || !coachProfile) {
      navigate('/login');
      return;
    }

    // Listen for Coaching IQ drawer open event
    const handleOpenDrawer = () => {
      setShowDrawer(true);
    };

    window.addEventListener('openCoachingIQDrawer', handleOpenDrawer);

    return () => {
      window.removeEventListener('openCoachingIQDrawer', handleOpenDrawer);
    };
  }, [navigate, coachProfile]);

  if (!isAuthenticated() || !coachProfile) {
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
            <button 
              className="nav-btn" 
              onClick={() => {
                console.log('[LOGIC HOOK] Opening Coaching IQ Drawer from Team IQ header');
                const event = new CustomEvent('openCoachingIQDrawer');
                window.dispatchEvent(event);
              }}
            >
              Coaching IQ™
            </button>
            <button 
              className="nav-btn" 
              onClick={() => {
                console.log('[LOGIC HOOK: handleAddFromRecruiting] Opening Add from Recruiting Board modal');
                navigate('/recruiting-iq');
              }}
            >
              Add from Recruiting Board
            </button>
            <button className="nav-btn" onClick={() => navigate('/office')}>
              Return to Office
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

        {/* View Tabs - Moved inside header */}
        <div className="view-tabs">
          <button 
            type="button"
            className={`tab ${activeView === 'roster' ? 'active' : ''}`}
            onClick={() => handleViewChange('roster')}
          >
            Roster View
          </button>
          <button 
            type="button"
            className={`tab ${activeView === 'depth' ? 'active' : ''}`}
            onClick={() => handleViewChange('depth')}
          >
            Depth Chart
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="team-iq-content" key={activeView}>
        {/* Roster View */}
        {activeView === 'roster' && (
          <div className="roster-view">
            <div className="roster-table-container">
              <table className="roster-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>POS</th>
                    <th>AGE</th>
                    <th>OVR (KPI)</th>
                    <th>FIT %</th>
                    <th>CONF %</th>
                    <th>SCH ALLOT</th>
                    <th>NIL VALUE ($)</th>
                    <th>ELIG.</th>
                    <th>FLAGS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRoster.map((player) => (
                      <tr key={player.id} onClick={() => setSelectedPlayer(player)}>
                        <td className="player-name">{player.name}</td>
                        <td>{player.position}</td>
                        <td>{player.age || 'N/A'}</td>
                        <td className="kpi-value">{player.kpi}</td>
                        <td>{player.fit}%</td>
                        <td>{player.confidence}%</td>
                        <td>{player.scholarship ? `$${player.scholarship}` : '0.0'}</td>
                        <td>{player.nil ? `$${player.nil}` : '$0'}</td>
                        <td>{player.eligibility || 'Active'}</td>
                        <td>{player.flags && player.flags.length > 0 ? '⚠️' : '—'}</td>
                        <td>
                          <button 
                            type="button"
                            className={`action-btn ${teamState.roster && teamState.roster.length > 0 ? 'delete' : 'view'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (teamState.roster && teamState.roster.length > 0) {
                                // Remove player from actual roster
                                handleRemovePlayer(player.id);
                              } else {
                                // View player details (for sample data)
                                console.log('[LOGIC HOOK] Viewing player details:', player.id);
                                setSelectedPlayer(player);
                              }
                            }}
                          >
                            {teamState.roster && teamState.roster.length > 0 ? 'Remove' : 'View'}
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
                    <div className="panel-tabs">
                      <button 
                        className={expandedPlayerTab === 'kpi' ? 'active' : ''}
                        onClick={() => setExpandedPlayerTab('kpi')}
                      >
                        KPI Profile
                      </button>
                      <button 
                        className={expandedPlayerTab === 'financial' ? 'active' : ''}
                        onClick={() => setExpandedPlayerTab('financial')}
                      >
                        Financial Aid
                      </button>
                      <button 
                        className={expandedPlayerTab === 'flags' ? 'active' : ''}
                        onClick={() => setExpandedPlayerTab('flags')}
                      >
                        Flags
                      </button>
                      <button 
                        className={expandedPlayerTab === 'notes' ? 'active' : ''}
                        onClick={() => setExpandedPlayerTab('notes')}
                      >
                        Notes
                      </button>
                    </div>
                    <div className="panel-content">
                      {expandedPlayerTab === 'kpi' && (
                        <div>
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
                        </div>
                      )}
                      {expandedPlayerTab === 'financial' && (
                        <div>
                          <div className="detail-row">
                            <span className="label">Scholarship:</span>
                            <span className="value">${selectedPlayer.scholarship || 0}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">NIL Value:</span>
                            <span className="value">${selectedPlayer.nil || 0}</span>
                          </div>
                        </div>
                      )}
                      {expandedPlayerTab === 'flags' && (
                        <div>
                          <div className="detail-row">
                            <span className="label">Flags:</span>
                            <span className="value">{selectedPlayer.flags?.length > 0 ? selectedPlayer.flags.join(', ') : 'None'}</span>
                          </div>
                        </div>
                      )}
                      {expandedPlayerTab === 'notes' && (
                        <div>
                          <textarea 
                            className="notes-input"
                            placeholder="Add notes about this player..."
                            defaultValue={selectedPlayer.notes || ''}
                            onChange={(e) => {
                              setSelectedPlayer({ ...selectedPlayer, notes: e.target.value });
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="panel-actions">
                      <button className="secondary-btn" onClick={handleSavePlayerChanges}>
                        Save Changes
                      </button>
                      <button className="danger-btn" onClick={() => handleRemovePlayer(selectedPlayer.id)}>
                        Remove Player
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </div>
        )}

        {/* Depth Chart View */}
        {activeView === 'depth' && (
          <div className="depth-chart-view">
            <div className="depth-chart-controls">
              <button className="primary-btn" onClick={handleEvaluateTeam}>
                Evaluate Team
              </button>
              <button className="secondary-btn" onClick={handleRunPrediXt}>
                Run PrediXt
              </button>
              <button className="secondary-btn" onClick={handleApplyToRoster}>
                Apply to Roster
              </button>
            </div>
            <div className="depth-chart-grid">
              {['PG', 'CG', 'Wing', 'Forward', 'Big'].map(position => (
                <div 
                  key={position} 
                  className="position-column"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, position)}
                >
                  <div className="position-header">{position}</div>
                  <div className="position-slots">
                    {(depthChartState[position] || teamState.roster?.filter(p => 
                      p.position === position || 
                      (position === 'CG' && p.position === 'SG') ||
                      (position === 'Wing' && (p.position === 'SF' || p.position === 'SG')) ||
                      (position === 'Forward' && (p.position === 'PF' || p.position === 'SF')) ||
                      (position === 'Big' && (p.position === 'C' || p.position === 'PF'))
                    ) || []).map(player => (
                      <div 
                        key={player.id} 
                        className="player-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, player)}
                      >
                        <div className="card-name">{player.name}</div>
                        <div className="card-stats">
                          <span>OVR: {player.kpi}</span>
                          <span>FIT: {player.fit}%</span>
                        </div>
                      </div>
                    ))}
                    {(!depthChartState[position] || depthChartState[position].length === 0) && 
                     !teamState.roster?.some(p => 
                      p.position === position ||
                      (position === 'CG' && p.position === 'SG') ||
                      (position === 'Wing' && (p.position === 'SF' || p.position === 'SG')) ||
                      (position === 'Forward' && (p.position === 'PF' || p.position === 'SF')) ||
                      (position === 'Big' && (p.position === 'C' || p.position === 'PF'))
                    ) && (
                      <div className="empty-slot">Drop players here</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showTeamEvaluation && (
              <div className="team-evaluation-panel">
                <div className="panel-header">
                  <h3>Team Evaluation Report</h3>
                  <button onClick={() => setShowTeamEvaluation(false)}>×</button>
                </div>
                <div className="panel-content">
                  <h4>Team Analysis</h4>
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
        )}
      </div>

      <CoachingIQDrawer 
        isOpen={showDrawer} 
        onClose={() => setShowDrawer(false)} 
      />
    </div>
  );
};

export default TeamIQPage;

