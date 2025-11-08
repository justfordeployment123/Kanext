import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './CoachingIQDrawer.css';

const CoachingIQDrawer = ({ isOpen, onClose }) => {
  const { coachProfile, coachingBias, updateCoachingBias, addCoachKMessage } = useApp();
  
  const [formData, setFormData] = useState({
    programName: '',
    programLevel: '',
    division: '',
    seasonYear: '2024-25',
    offensiveSystem: '',
    defensiveSystem: '',
    positionWeights: {
      PG: 20,
      CG: 20,
      Wing: 20,
      Forward: 20,
      Big: 20
    },
    scholarshipCap: 12,
    nilPool: 50000
  });

  useEffect(() => {
    if (coachProfile) {
      setFormData(prev => ({
        ...prev,
        programName: coachProfile.team || '',
        programLevel: coachProfile.division || '',
        offensiveSystem: coachProfile.offense || '',
        defensiveSystem: coachProfile.defense || ''
      }));
    }

    if (coachingBias) {
      setFormData(prev => ({ ...prev, ...coachingBias }));
    }
  }, [coachProfile, coachingBias]);

  const handleApply = () => {
    updateCoachingBias(formData);
    addCoachKMessage({
      speaker: 'Coach K',
      message: 'Program and financial context updated. Your Coaching IQ™ profile is now active.',
      type: 'success'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className={`coaching-iq-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>System Configuration</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="drawer-content">
          {/* Layer 1 - Program Context */}
          <section className="drawer-section">
            <h3>1. Program Context</h3>
            <div className="form-group">
              <label>Program Name *</label>
              <input
                type="text"
                value={formData.programName}
                onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                placeholder="Your Team/School"
              />
            </div>
            <div className="form-group">
              <label>Program Level *</label>
              <select
                value={formData.programLevel}
                onChange={(e) => setFormData({ ...formData, programLevel: e.target.value })}
              >
                <option value="">Select Level</option>
                <option value="NCAA D1">NCAA D1</option>
                <option value="NCAA D2">NCAA D2</option>
                <option value="NCAA D3">NCAA D3</option>
                <option value="NAIA">NAIA</option>
                <option value="JUCO">JUCO</option>
                <option value="USCAA">USCAA</option>
                <option value="Pro">Pro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Season Year</label>
              <input
                type="text"
                value={formData.seasonYear}
                onChange={(e) => setFormData({ ...formData, seasonYear: e.target.value })}
              />
            </div>
          </section>

          {/* Layer 2 - System Selection */}
          <section className="drawer-section">
            <h3>2. System Selection</h3>
            <div className="form-group">
              <label>Offensive System</label>
              <select
                value={formData.offensiveSystem}
                onChange={(e) => setFormData({ ...formData, offensiveSystem: e.target.value })}
              >
                <option value="">Select System</option>
                <option value="Five-Out">Five-Out</option>
                <option value="Motion">Motion</option>
                <option value="Pace & Space">Pace & Space</option>
                <option value="Post-Centric">Post-Centric</option>
                <option value="Moreyball">Moreyball</option>
              </select>
            </div>
            <div className="form-group">
              <label>Defensive System</label>
              <select
                value={formData.defensiveSystem}
                onChange={(e) => setFormData({ ...formData, defensiveSystem: e.target.value })}
              >
                <option value="">Select System</option>
                <option value="Pack Line">Pack Line</option>
                <option value="Havoc">Havoc</option>
                <option value="Switch">Switch</option>
                <option value="Zone">Zone</option>
                <option value="No-Middle">No-Middle</option>
              </select>
            </div>
          </section>

          {/* Layer 3 - Positional Weighting */}
          <section className="drawer-section">
            <h3>3. Position Priority</h3>
            <p className="section-note">Set importance for each position</p>
            {Object.keys(formData.positionWeights).map(position => (
              <div key={position} className="slider-group">
                <label>{position}: {formData.positionWeights[position]}%</label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={formData.positionWeights[position]}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value);
                    setFormData({
                      ...formData,
                      positionWeights: {
                        ...formData.positionWeights,
                        [position]: newValue
                      }
                    });
                  }}
                />
              </div>
            ))}
            <div className="weight-total">
              Total: {Object.values(formData.positionWeights).reduce((a, b) => a + b, 0)}%
            </div>
          </section>

          {/* Layer 4 - Financial Setup */}
          <section className="drawer-section">
            <h3>4. Budget Settings</h3>
            <div className="form-group">
              <label>Scholarship Cap</label>
              <input
                type="number"
                value={formData.scholarshipCap}
                onChange={(e) => setFormData({ ...formData, scholarshipCap: parseFloat(e.target.value) })}
                min="0"
                step="0.1"
              />
            </div>
            <div className="form-group">
              <label>NIL Pool ($)</label>
              <input
                type="number"
                value={formData.nilPool}
                onChange={(e) => setFormData({ ...formData, nilPool: parseFloat(e.target.value) })}
                min="0"
                step="1000"
              />
            </div>
          </section>
        </div>

        <div className="drawer-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="apply-btn" onClick={handleApply}>Apply</button>
        </div>
      </div>
    </>
  );
};

export default CoachingIQDrawer;

