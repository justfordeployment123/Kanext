import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isAuthenticated } from '../services/authService';
import './PlayerIQPage.css';

const PlayerIQPage = () => {
  const navigate = useNavigate();
  const { coachProfile, coachingBias, addPlayerProfile, addToRoster } = useApp();
  
  const [searchMode, setSearchMode] = useState(true);
  const [searchData, setSearchData] = useState({
    playerName: '',
    school: '',
    classYear: '',
    position: ''
  });

  const [scopeResult, setScopeResult] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRunScope = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('[LOGIC HOOK: handleRunScope] Running Lifeline Scope with parameters:', searchData);

    // Simulate AI scraping
    setTimeout(() => {
      const mockResult = {
        name: searchData.playerName,
        school: searchData.school || 'Sample University',
        position: searchData.position || 'Guard',
        classYear: searchData.classYear || 'Junior',
        confidence: Math.floor(Math.random() * 20) + 80,
        image: null,
        nilReadiness: Math.floor(Math.random() * 4) + 6,
        redFlags: [],
        eligibility: 'Active'
      };

      console.log('[LOGIC HOOK: handleRunScope] Scope results:', mockResult);
      setScopeResult(mockResult);
      setSearchMode(false);
      setLoading(false);
    }, 1500);
  };

  const handleRunEvaluation = () => {
    setLoading(true);
    console.log('[LOGIC HOOK: handleRunEvaluation] Running Full Evaluation for player:', scopeResult?.name);

    setTimeout(() => {
      const confidence = scopeResult.confidence;
      const finalKPI = (Math.random() * 20 + 70).toFixed(1);
      const fit = (Math.random() * 20 + 70).toFixed(0);
      
      const evaluation = {
        ...scopeResult,
        finalKPI: parseFloat(finalKPI),
        fit: parseInt(fit),
        roleProjection: finalKPI > 80 ? 'Starter' : 'Rotation',
        archetype: 'Offensive Connector',
        scholarshipSuggestion: ((finalKPI / 100) * (coachingBias?.scholarshipCap || 12) * 0.75).toFixed(0),
        nilValue: (scopeResult.nilReadiness * confidence * 100).toFixed(0),
        badges: ['🏅 Sniper', '⚡ High IQ'],
        kpgLine: `${(finalKPI * 0.2).toFixed(1)} pts · ${(finalKPI * 0.06).toFixed(1)} ast · ${(finalKPI * 0.03).toFixed(1)} reb`
      };

      console.log('[LOGIC HOOK: handleRunEvaluation] Evaluation complete:', evaluation);
      setEvaluationResult(evaluation);
      setLoading(false);
    }, 2000);
  };

  const handleSyncToTeamIQ = () => {
    if (evaluationResult) {
      const playerProfile = {
        id: Date.now().toString(),
        name: evaluationResult.name,
        position: evaluationResult.position,
        kpi: evaluationResult.finalKPI,
        fit: evaluationResult.fit,
        confidence: evaluationResult.confidence,
        scholarship: evaluationResult.scholarshipSuggestion,
        nil: evaluationResult.nilValue
      };

      console.log('[LOGIC HOOK: Sync] Syncing player to Team IQ:', playerProfile);
      addPlayerProfile(playerProfile);
      addToRoster(playerProfile);
      
      alert('✅ Player synced to Team IQ™');
      handleReset();
    }
  };

  const handleSyncToRecruitingIQ = () => {
    if (evaluationResult) {
      console.log('[LOGIC HOOK: Sync] Syncing player to Recruiting IQ:', {
        playerId: evaluationResult.name,
        playerData: evaluationResult
      });
      alert('✅ Player synced to Recruiting IQ™');
    }
  };

  const handleReset = () => {
    setSearchMode(true);
    setScopeResult(null);
    setEvaluationResult(null);
    setSearchData({ playerName: '', school: '', classYear: '', position: '' });
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
    <div className="player-iq-page">
      {/* Header */}
      <header className="player-iq-header">
        <div className="header-left">
          <h1>PLAYER IQ™ EVALUATOR</h1>
          <p className="subtitle">Run Lifeline Scope and Full Evaluation on any player.</p>
          <div className="context-line">
            {coachProfile.team} · {coachingBias?.offensiveSystem || coachProfile.offense} · 
            {coachingBias?.defensiveSystem || coachProfile.defense} · {coachProfile.division}
          </div>
          <div 
            className={`coaching-iq-chip ${coachingBias ? 'active' : 'incomplete'}`}
            onClick={() => {
              console.log('[LOGIC HOOK] Opening Coaching IQ Drawer from Player IQ header');
              const event = new CustomEvent('openCoachingIQDrawer');
              window.dispatchEvent(event);
            }}
            style={{ cursor: 'pointer' }}
          >
            {coachingBias ? 'Coaching IQ Active' : 'Set Up Required'}
          </div>
        </div>
        <div className="header-right">
          <button className="nav-btn" onClick={() => navigate('/team-iq')}>
            Team IQ™
          </button>
          <button className="nav-btn" onClick={() => navigate('/recruiting-iq')}>
            Recruiting IQ™
          </button>
          <button className="nav-btn" onClick={() => navigate('/office')}>
            Return to Office
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="player-iq-content">
        {/* Search Card */}
        {searchMode && !scopeResult && (
          <div className="search-card">
            <h2>Player Search</h2>
            <form onSubmit={handleRunScope}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Player Name *"
                  value={searchData.playerName}
                  onChange={(e) => setSearchData({ ...searchData, playerName: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Program / School (optional)"
                  value={searchData.school}
                  onChange={(e) => setSearchData({ ...searchData, school: e.target.value })}
                />
              </div>
              <div className="form-row">
                <select
                  value={searchData.classYear}
                  onChange={(e) => setSearchData({ ...searchData, classYear: e.target.value })}
                >
                  <option value="">Class / Year (optional)</option>
                  <option value="FR">Freshman</option>
                  <option value="SO">Sophomore</option>
                  <option value="JR">Junior</option>
                  <option value="SR">Senior</option>
                </select>
                <select
                  value={searchData.position}
                  onChange={(e) => setSearchData({ ...searchData, position: e.target.value })}
                >
                  <option value="">Position (optional)</option>
                  <option value="PG">Point Guard</option>
                  <option value="SG">Shooting Guard</option>
                  <option value="SF">Small Forward</option>
                  <option value="PF">Power Forward</option>
                  <option value="C">Center</option>
                </select>
              </div>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? 'Running Scope...' : 'Run Lifeline Scope'}
              </button>
            </form>
          </div>
        )}

        {/* Scope Results */}
        {scopeResult && !evaluationResult && (
          <div className="scope-results">
            <h2>Lifeline Scope Results</h2>
            <div className="result-card">
              <div className="player-identity">
                <div className="player-avatar">
                  {scopeResult.name.charAt(0)}
                </div>
                <div className="player-info">
                  <h3>{scopeResult.name}</h3>
                  <p>{scopeResult.school} · {scopeResult.position} · {scopeResult.classYear}</p>
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric">
                  <label>Confidence</label>
                  <div className="metric-value">{scopeResult.confidence}%</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${scopeResult.confidence}%` }}></div>
                  </div>
                </div>
                <div className="metric">
                  <label>NIL Readiness</label>
                  <div className="metric-value">{scopeResult.nilReadiness}/10</div>
                </div>
                <div className="metric">
                  <label>Eligibility</label>
                  <div className="metric-value">{scopeResult.eligibility}</div>
                </div>
              </div>

              <div className="actions">
                <button className="secondary-btn" onClick={handleReset}>
                  Edit Search
                </button>
                <button className="primary-btn" onClick={handleRunEvaluation} disabled={loading}>
                  {loading ? 'Evaluating...' : 'Run Full Evaluation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Evaluation Results */}
        {evaluationResult && (
          <div className="evaluation-results">
            <h2>Final KPI Report</h2>
            <div className="result-card">
              <div className="player-identity">
                <div className="player-avatar large">
                  {evaluationResult.name.charAt(0)}
                </div>
                <div className="player-info">
                  <h3>{evaluationResult.name}</h3>
                  <p>{evaluationResult.school} · {evaluationResult.position} · {evaluationResult.classYear}</p>
                  <div className="badges">
                    {evaluationResult.badges.map((badge, i) => (
                      <span key={i} className="badge">{badge}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="kpi-summary">
                <div className="kpi-main">
                  <div className="kpi-score">{evaluationResult.finalKPI}</div>
                  <div className="kpi-label">Final KPI</div>
                </div>
                <div className="kpi-secondary">
                  <div className="kpi-item">
                    <span className="label">Fit:</span>
                    <span className="value">{evaluationResult.fit}%</span>
                  </div>
                  <div className="kpi-item">
                    <span className="label">Confidence:</span>
                    <span className="value">{evaluationResult.confidence}%</span>
                  </div>
                  <div className="kpi-item">
                    <span className="label">Role:</span>
                    <span className="value">{evaluationResult.roleProjection}</span>
                  </div>
                  <div className="kpi-item">
                    <span className="label">Archetype:</span>
                    <span className="value">{evaluationResult.archetype}</span>
                  </div>
                </div>
              </div>

              <div className="financial-section">
                <h3>Financial Recommendations</h3>
                <div className="financial-grid">
                  <div className="financial-item">
                    <span className="icon">💰</span>
                    <div>
                      <div className="label">Scholarship Suggestion</div>
                      <div className="amount">${evaluationResult.scholarshipSuggestion}</div>
                    </div>
                  </div>
                  <div className="financial-item">
                    <span className="icon">💵</span>
                    <div>
                      <div className="label">NIL Value</div>
                      <div className="amount">${evaluationResult.nilValue}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="kpg-section">
                <h3>KPG™ Projection</h3>
                <p>{evaluationResult.kpgLine}</p>
              </div>

              <div className="decision-panel">
                <h3>Next Step: Decision & Sync</h3>
                <p>Select where to send this evaluation.</p>
                <div className="actions">
                  <button className="secondary-btn" onClick={handleReset}>
                    New Evaluation
                  </button>
                  <button className="secondary-btn" onClick={handleSyncToRecruitingIQ}>
                    Add to Recruiting IQ™
                  </button>
                  <button className="primary-btn" onClick={handleSyncToTeamIQ}>
                    Add to Team IQ™
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerIQPage;

