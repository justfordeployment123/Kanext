import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isAuthenticated } from '../services/authService';
import './PrediXtPage.css';

const PrediXtPage = () => {
  const navigate = useNavigate();
  const { coachProfile, coachingBias, teamState } = useApp();
  
  const [simulationMode, setSimulationMode] = useState('single'); // single or season
  const [opponent, setOpponent] = useState('');
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const teamKPI = teamState.roster?.length > 0
    ? (teamState.roster.reduce((sum, p) => sum + (p.kpi || 0), 0) / teamState.roster.length).toFixed(1)
    : 0;

  const handleRunSimulation = () => {
    if (simulationMode === 'single' && !opponent) {
      alert('Please select an opponent');
      return;
    }

    console.log('[LOGIC HOOK: handleRunSimulation] Running PrediXt:', {
      mode: simulationMode,
      opponent: opponent || 'N/A (Full Season)'
    });

    setLoading(true);

    setTimeout(() => {
      if (simulationMode === 'single') {
        const opponentKPI = (Math.random() * 15 + 70).toFixed(1);
        const winProb = Math.min(95, Math.max(5, 50 + (teamKPI - opponentKPI) * 3));
        const ourScore = Math.round(75 + Math.random() * 15);
        const theirScore = Math.round(ourScore - (winProb - 50) / 5);

        setSimulationResult({
          mode: 'single',
          opponent: opponent,
          opponentKPI: opponentKPI,
          predictedScore: `${ourScore} - ${theirScore}`,
          winProbability: Math.round(winProb),
          teamKPI: teamKPI,
          analysis: `Your ${coachingBias?.offensiveSystem || 'offense'} creates favorable matchups. Expected tempo-neutral game with slight edge on spacing.`
        });
      } else {
        const wins = Math.round(15 + Math.random() * 10);
        const losses = 30 - wins;

        setSimulationResult({
          mode: 'season',
          projectedRecord: `${wins} - ${losses}`,
          conferenceRank: Math.ceil(Math.random() * 12),
          teamKPI: teamKPI,
          analysis: `Based on current roster composition (${teamState.roster?.length || 0} players), projected as mid-tier conference competitor. System fit at ${teamState.systemFit || 0}% supports consistent performance.`
        });
      }

      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (!isAuthenticated() || !coachProfile) {
      navigate('/login');
    }
  }, [navigate, coachProfile]);

  if (!isAuthenticated() || !coachProfile) {
    return null;
  }

  return (
    <div className="predixt-page">
      {/* Header */}
      <header className="predixt-header">
        <div className="header-top">
          <div className="header-left">
            <h1>PREDIXT™ ENGINE</h1>
            <p className="subtitle">Game + Season Forecast Engine · linked to Team IQ™ state.</p>
            <div className="context-line">
              Team: {coachProfile.team} · Division: {coachProfile.division} · 
              System: {coachingBias?.offensiveSystem || 'Not Set'} / {coachingBias?.defensiveSystem || 'Not Set'} · 
              Team KPI: {teamKPI}
            </div>
          </div>
          <div className="header-right">
            <div className="conference-snapshot">
              <span className="snapshot-label">📊 Conference View</span>
            </div>
            <button className="nav-btn" onClick={() => navigate('/team-iq')}>
              Team IQ™
            </button>
            <button className="nav-btn" onClick={() => navigate('/office')}>
              Return to Office
            </button>
          </div>
        </div>
      </header>

      {/* Header Summary Line */}
      <div className="header-summary">
        <div className="summary-item">
          <span className="label">Record:</span>
          <span className="value">0-0</span>
        </div>
        <div className="summary-item">
          <span className="label">Conference Rank:</span>
          <span className="value">—</span>
        </div>
          <div className="summary-item">
            <span className="label">KPI vs Conference Avg:</span>
            <span className="value">+0.0</span>
          </div>
          <div className="summary-item collapsible" onClick={() => alert('Division + Conference Snapshot')}>
            <span className="label">📊 Conference View</span>
          </div>
        </div>

      {/* Simulation Controls - In Header Center */}
      <div className="simulation-controls-header">
        <div className="opponent-selector">
          <label>Select Opponent</label>
          <select
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
          >
            <option value="">Select Opponent</option>
            <option value="Howard College">Howard College</option>
            <option value="Odessa JC">Odessa JC</option>
            <option value="Clarendon JC">Clarendon JC</option>
            <option value="Dallas CC">Dallas CC</option>
          </select>
        </div>
        <div className="mode-toggle">
          <button 
            className={simulationMode === 'single' ? 'active' : ''}
            onClick={() => {
              setSimulationMode('single');
              console.log('[LOGIC HOOK: handleSimulationModeChange] Mode changed to: Single Game');
            }}
          >
            Single Game
          </button>
          <button 
            className={simulationMode === 'season' ? 'active' : ''}
            onClick={() => {
              setSimulationMode('season');
              console.log('[LOGIC HOOK: handleSimulationModeChange] Mode changed to: Full Season');
            }}
          >
            Full Season
          </button>
        </div>
        <button 
          className="run-btn"
          onClick={handleRunSimulation}
          disabled={loading}
        >
          {loading ? '▶ Running...' : '▶ Run PrediXt'}
        </button>
      </div>

      {/* Body Content - Placeholder Structure */}
      <div className="predixt-content">
        {!simulationResult ? (
          <div className="placeholder-structure">
            <div className="placeholder-section">
              <h3>Team Context & Scoreline</h3>
              <p className="placeholder-text">Simulation results will appear here</p>
            </div>
            <div className="placeholder-section">
              <h3>Player Impact Highlights</h3>
              <p className="placeholder-text">Key player contributions will be displayed here</p>
            </div>
          </div>
        ) : (
          <div className="simulation-results">
          {simulationResult.mode === 'single' ? (
            <div className="single-game-result">
              <h2>Single Game Prediction</h2>
              <div className="matchup">
                <div className="team">
                  <h3>{coachProfile.team}</h3>
                  <div className="kpi">KPI: {simulationResult.teamKPI}</div>
                </div>
                <div className="vs">vs</div>
                <div className="team">
                  <h3>{simulationResult.opponent}</h3>
                  <div className="kpi">KPI: {simulationResult.opponentKPI}</div>
                </div>
              </div>

              <div className="prediction-card">
                <div className="score">{simulationResult.predictedScore}</div>
                <div className="win-prob">
                  Win Probability: <span className="gold">{simulationResult.winProbability}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${simulationResult.winProbability}%` }}
                  ></div>
                </div>
              </div>

              <div className="analysis-section">
                <h3>Coach K™ Analysis</h3>
                <p>{simulationResult.analysis}</p>
              </div>
            </div>
          ) : (
            <div className="season-result">
              <h2>Season Projection</h2>
              <div className="season-card">
                <div className="record-display">
                  <div className="record">{simulationResult.projectedRecord}</div>
                  <div className="label">Projected Record</div>
                </div>
                <div className="stats-grid">
                  <div className="stat">
                    <span className="label">Conference Rank:</span>
                    <span className="value">#{simulationResult.conferenceRank}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Team KPI:</span>
                    <span className="value">{simulationResult.teamKPI}</span>
                  </div>
                </div>
              </div>

              <div className="analysis-section">
                <h3>Coach K™ Season Analysis</h3>
                <p>{simulationResult.analysis}</p>
              </div>
            </div>
          )}
          </div>
        )}
      </div>

    </div>
  );
};

export default PrediXtPage;

