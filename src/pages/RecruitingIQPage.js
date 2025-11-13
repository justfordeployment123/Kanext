import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { isAuthenticated } from '../services/authService';
import CoachingIQDrawer from '../components/CoachingIQDrawer';
import './RecruitingIQPage.css';

// Mock player database
const mockPlayers = [
  { id: '1', name: 'Marcus Johnson', position: 'PG', division: 'JUCO', school: 'South Plains CC', class: 'SO', kpi: 78, nilReadiness: 6.5, confidence: 82, status: 'Unevaluated' },
  { id: '2', name: 'Kevin Williams', position: 'SG', division: 'NAIA', school: 'Southwestern CC', class: 'FR', kpi: 75, nilReadiness: 5.8, confidence: 79, status: 'Unevaluated' },
  { id: '3', name: 'Tyler Brown', position: 'SF', division: 'JUCO', school: 'Ranger College', class: 'SO', kpi: 80, nilReadiness: 7.2, confidence: 85, status: 'Unevaluated' },
  { id: '4', name: 'James Davis', position: 'PF', division: 'NAIA', school: 'Bacone College', class: 'JR', kpi: 76, nilReadiness: 6.0, confidence: 80, status: 'Unevaluated' },
  { id: '5', name: 'Chris Miller', position: 'C', division: 'JUCO', school: 'Odessa College', class: 'FR', kpi: 73, nilReadiness: 5.5, confidence: 77, status: 'Unevaluated' },
];

const RecruitingIQPage = () => {
  const navigate = useNavigate();
  const { coachProfile, recruitingState, setRecruitingState } = useApp();
  
  const [filters, setFilters] = useState({
    search: '',
    division: '',
    position: '',
    class: ''
  });

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [detailTab, setDetailTab] = useState('profile'); // profile, evaluation, notes
  const [viewMode, setViewMode] = useState('list'); // list or board
  const [showAddProspectModal, setShowAddProspectModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [newProspect, setNewProspect] = useState({
    name: '',
    position: '',
    division: '',
    school: '',
    class: ''
  });

  const filteredPlayers = mockPlayers.filter(player => {
    if (filters.search && !player.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.division && player.division !== filters.division) return false;
    if (filters.position && player.position !== filters.position) return false;
    if (filters.class && player.class !== filters.class) return false;
    return true;
  });

  const handleAddToBoard = (player) => {
    console.log('[LOGIC HOOK: handleAddToBoard] Adding player to recruiting board:', player.id);
    const newRecruit = {
      ...player,
      status: 'Active',
      isPriority: false,
      scholarshipOffer: 0,
      nilOffer: 0,
      dateAdded: new Date().toISOString()
    };

    setRecruitingState(prev => ({
      ...prev,
      activeRecruits: [...prev.activeRecruits, newRecruit]
    }));

    alert(`✅ ${player.name} added to Recruiting Board`);
  };

  const handleEvaluate = (player) => {
    console.log('[LOGIC HOOK: handleEvaluate] Evaluating player:', player.id);
    navigate('/player-iq', { state: { playerData: player } });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    console.log('[LOGIC HOOK: handleFilterChange] Filter updated:', { [key]: value });
  };

  const handleAddProspect = () => {
    console.log('[LOGIC HOOK: handleAddProspect] Adding new prospect:', newProspect);
    const prospect = {
      id: Date.now().toString(),
      ...newProspect,
      kpi: Math.floor(Math.random() * 20) + 70,
      nilReadiness: Math.floor(Math.random() * 4) + 6,
      confidence: Math.floor(Math.random() * 10) + 75,
      status: 'Unevaluated'
    };
    handleAddToBoard(prospect);
    setShowAddProspectModal(false);
    setNewProspect({ name: '', position: '', division: '', school: '', class: '' });
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
    <div className="recruiting-iq-page">
      {/* Header */}
      <header className="recruiting-iq-header">
        <div className="header-top">
          <div className="header-left">
            <h1>RECRUITING IQ™ DATABASE</h1>
            <p className="subtitle">National prospect feed · dynamic by level and region.</p>
            <div className="context-line">
              Team: {coachProfile.team} · System: {coachProfile.offense} / {coachProfile.defense} · 
              Active Recruits: {recruitingState.activeRecruits?.length || 0}
            </div>
          </div>
          <div className="header-right">
            <button 
              className="nav-btn" 
              onClick={() => {
                console.log('[LOGIC HOOK] Opening Coaching IQ Drawer from Recruiting IQ header');
                const event = new CustomEvent('openCoachingIQDrawer');
                window.dispatchEvent(event);
              }}
            >
              Coaching IQ™
            </button>
            <button className="nav-btn" onClick={() => navigate('/team-iq')}>
              Team IQ™
            </button>
            <button className="nav-btn" onClick={() => setShowAddProspectModal(true)}>
              + Add Prospect
            </button>
            <button className="nav-btn" onClick={() => navigate('/office')}>
              Return to Office
            </button>
          </div>
        </div>

        {/* Summary Line */}
        <div className="summary-line">
          <div className="summary-item">
            <span className="label">Active Recruits:</span>
            <span className="value">{recruitingState.activeRecruits?.length || 0}</span>
          </div>
          <div className="summary-item">
            <span className="label">Priority:</span>
            <span className="value">{recruitingState.priorityRecruits?.length || 0}</span>
          </div>
          <div className="summary-item">
            <span className="label">Committed:</span>
            <span className="value">{recruitingState.committedCount || 0}</span>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name, school, city..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
        />
        <select value={filters.division} onChange={(e) => handleFilterChange('division', e.target.value)}>
          <option value="">All Divisions</option>
          <option value="NCAA D1">NCAA D1</option>
          <option value="NCAA D2">NCAA D2</option>
          <option value="NCAA D3">NCAA D3</option>
          <option value="NAIA">NAIA</option>
          <option value="NCCAA">NCCAA</option>
          <option value="JUCO">JUCO</option>
          <option value="USCAA">USCAA</option>
        </select>
        <select value={filters.position} onChange={(e) => handleFilterChange('position', e.target.value)}>
          <option value="">All Positions</option>
          <option value="PG">PG</option>
          <option value="SG">SG</option>
          <option value="SF">SF</option>
          <option value="PF">PF</option>
          <option value="C">C</option>
        </select>
        <select value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)}>
          <option value="">All Classes</option>
          <option value="FR">Freshman</option>
          <option value="SO">Sophomore</option>
          <option value="JR">Junior</option>
          <option value="SR">Senior</option>
        </select>
        <div className="view-toggle">
          <button 
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
          <button 
            className={viewMode === 'board' ? 'active' : ''}
            onClick={() => setViewMode('board')}
          >
            Board
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="recruiting-content">
        {viewMode === 'list' ? (
          <div className="list-view">
            <table className="player-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>POS</th>
                  <th>DIVISION</th>
                  <th>SCHOOL</th>
                  <th>CLASS</th>
                  <th>KPI (raw)</th>
                  <th>NIL READINESS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => (
                  <tr key={player.id} onClick={() => setSelectedPlayer(player)}>
                    <td className="player-name">{player.name}</td>
                    <td>{player.position}</td>
                    <td><span className="division-badge">{player.division}</span></td>
                    <td>{player.school}</td>
                    <td>{player.class}</td>
                    <td className="kpi-value">{player.kpi}</td>
                    <td>{player.nilReadiness}/10</td>
                    <td>{player.status}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEvaluate(player);
                          }}
                        >
                          Evaluate
                        </button>
                        <button 
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToBoard(player);
                          }}
                        >
                          Add to Board
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="board-view">
            {filteredPlayers.map(player => (
              <div key={player.id} className="player-card" onClick={() => setSelectedPlayer(player)}>
                <div className="card-avatar">{player.name.charAt(0)}</div>
                <h3>{player.name}</h3>
                <p className="card-position">{player.position} · {player.division}</p>
                <p className="card-school">{player.school}</p>
                <div className="card-stats">
                  <div className="stat">
                    <span className="label">KPI:</span>
                    <span className="value">{player.kpi}</span>
                  </div>
                  <div className="stat">
                    <span className="label">NIL:</span>
                    <span className="value">{player.nilReadiness}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button 
                    className="card-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEvaluate(player);
                    }}
                  >
                    Evaluate
                  </button>
                  <button 
                    className="card-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToBoard(player);
                    }}
                  >
                    Add to Board
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player Detail Panel */}
      {selectedPlayer && (
        <div className="detail-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <h2>{selectedPlayer.name}</h2>
              <button onClick={() => setSelectedPlayer(null)}>×</button>
            </div>
            <div className="detail-tabs">
              <button 
                className={detailTab === 'profile' ? 'active' : ''}
                onClick={() => setDetailTab('profile')}
              >
                Profile
              </button>
              <button 
                className={detailTab === 'evaluation' ? 'active' : ''}
                onClick={() => setDetailTab('evaluation')}
              >
                Evaluation
              </button>
              <button 
                className={detailTab === 'notes' ? 'active' : ''}
                onClick={() => setDetailTab('notes')}
              >
                Notes
              </button>
            </div>
            <div className="detail-content">
              {detailTab === 'profile' && (
                <div className="detail-section">
                  <h3>Profile</h3>
                  <p><strong>Position:</strong> {selectedPlayer.position}</p>
                  <p><strong>Division:</strong> {selectedPlayer.division}</p>
                  <p><strong>School:</strong> {selectedPlayer.school}</p>
                  <p><strong>Class:</strong> {selectedPlayer.class}</p>
                </div>
              )}
              {detailTab === 'evaluation' && (
                <div className="detail-section">
                  <h3>Metrics</h3>
                  <p><strong>KPI:</strong> {selectedPlayer.kpi}</p>
                  <p><strong>NIL Readiness:</strong> {selectedPlayer.nilReadiness}/10</p>
                  <p><strong>Confidence:</strong> {selectedPlayer.confidence}%</p>
                  <p><strong>Status:</strong> {selectedPlayer.status}</p>
                </div>
              )}
              {detailTab === 'notes' && (
                <div className="detail-section">
                  <textarea 
                    className="notes-textarea"
                    placeholder="Add notes about this prospect..."
                    defaultValue={selectedPlayer.notes || ''}
                  />
                </div>
              )}
            </div>
            <div className="detail-actions">
              <button className="secondary-btn" onClick={() => handleEvaluate(selectedPlayer)}>
                Run Evaluation
              </button>
              <button className="primary-btn" onClick={() => handleAddToBoard(selectedPlayer)}>
                Add to Recruiting Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Prospect Modal */}
      {showAddProspectModal && (
        <div className="modal-overlay" onClick={() => setShowAddProspectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Prospect</h2>
              <button onClick={() => setShowAddProspectModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={newProspect.name}
                  onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
                  placeholder="Player Name"
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  value={newProspect.position}
                  onChange={(e) => setNewProspect({ ...newProspect, position: e.target.value })}
                >
                  <option value="">Select Position</option>
                  <option value="PG">PG</option>
                  <option value="SG">SG</option>
                  <option value="SF">SF</option>
                  <option value="PF">PF</option>
                  <option value="C">C</option>
                </select>
              </div>
              <div className="form-group">
                <label>Division</label>
                <select
                  value={newProspect.division}
                  onChange={(e) => setNewProspect({ ...newProspect, division: e.target.value })}
                >
                  <option value="">Select Division</option>
                  <option value="NCAA D1">NCAA D1</option>
                  <option value="NCAA D2">NCAA D2</option>
                  <option value="NCAA D3">NCAA D3</option>
                  <option value="NAIA">NAIA</option>
                  <option value="NCCAA">NCCAA</option>
                  <option value="JUCO">JUCO</option>
                  <option value="USCAA">USCAA</option>
                </select>
              </div>
              <div className="form-group">
                <label>School</label>
                <input
                  type="text"
                  value={newProspect.school}
                  onChange={(e) => setNewProspect({ ...newProspect, school: e.target.value })}
                  placeholder="School Name"
                />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select
                  value={newProspect.class}
                  onChange={(e) => setNewProspect({ ...newProspect, class: e.target.value })}
                >
                  <option value="">Select Class</option>
                  <option value="FR">Freshman</option>
                  <option value="SO">Sophomore</option>
                  <option value="JR">Junior</option>
                  <option value="SR">Senior</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setShowAddProspectModal(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleAddProspect} disabled={!newProspect.name}>
                Add Prospect
              </button>
            </div>
          </div>
        </div>
      )}

      <CoachingIQDrawer 
        isOpen={showDrawer} 
        onClose={() => setShowDrawer(false)} 
      />
    </div>
  );
};

export default RecruitingIQPage;

