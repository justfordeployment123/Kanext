import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setCoachProfile } = useApp();
  const [activeTab, setActiveTab] = useState('signin');

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Create Account Form State
  const [createAccountData, setCreateAccountData] = useState({
    fullName: '',
    email: '',
    password: '',
    teamName: '',
    division: '',
    offensiveSystem: '',
    defensiveSystem: '',
    avatar: null
  });

  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    
    // Simple validation (in real app, this would call an API)
    if (!signInData.email || !signInData.password) {
      setError('Please enter both email and password');
      return;
    }

    // Mock authentication - in real app, validate with backend
    const mockProfile = {
      name: 'Coach User',
      email: signInData.email,
      team: 'Sample Team',
      division: 'USCAA'
    };

    setCoachProfile(mockProfile);
    navigate('/office');
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!createAccountData.fullName || !createAccountData.email || 
        !createAccountData.password || !createAccountData.teamName) {
      setError('Please fill in all required fields');
      return;
    }

    // Create coach profile
    const newProfile = {
      name: createAccountData.fullName,
      email: createAccountData.email,
      team: createAccountData.teamName,
      division: createAccountData.division || 'NCAA D1',
      offense: createAccountData.offensiveSystem || 'Five-Out',
      defense: createAccountData.defensiveSystem || 'Pack Line',
      avatar: createAccountData.avatar
    };

    setCoachProfile(newProfile);
    navigate('/office');
  };

  return (
    <div className="login-page fade-in">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo" onClick={() => navigate('/')}>
          <h1>KaNeXT IQ™</h1>
        </div>

        {/* Card */}
        <div className="login-card">
          {/* Tab Toggle */}
          <div className="tab-header">
            <button
              className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => { setActiveTab('signin'); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`tab ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => { setActiveTab('create'); setError(''); }}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="error-banner">{error}</div>}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form className="auth-form" onSubmit={handleSignIn}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  placeholder="coach@example.com"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="submit-btn">Sign In</button>
              <div className="form-footer">
                <a href="#forgot" className="footer-link">Forgot Password</a>
                <span>·</span>
                <a href="#privacy" className="footer-link">Privacy Policy</a>
              </div>
            </form>
          )}

          {/* Create Account Form */}
          {activeTab === 'create' && (
            <form className="auth-form" onSubmit={handleCreateAccount}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={createAccountData.fullName}
                  onChange={(e) => setCreateAccountData({ ...createAccountData, fullName: e.target.value })}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={createAccountData.email}
                  onChange={(e) => setCreateAccountData({ ...createAccountData, email: e.target.value })}
                  placeholder="coach@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={createAccountData.password}
                  onChange={(e) => setCreateAccountData({ ...createAccountData, password: e.target.value })}
                  placeholder="Min 8 characters"
                  minLength="8"
                  required
                />
              </div>
              <div className="form-group">
                <label>Team Name *</label>
                <input
                  type="text"
                  value={createAccountData.teamName}
                  onChange={(e) => setCreateAccountData({ ...createAccountData, teamName: e.target.value })}
                  placeholder="Your Team"
                  required
                />
              </div>
              <div className="form-group">
                <label>Division / League</label>
                <select
                  value={createAccountData.division}
                  onChange={(e) => setCreateAccountData({ ...createAccountData, division: e.target.value })}
                >
                  <option value="">Select Division</option>
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
                <label>Offensive System</label>
                <select
                  value={createAccountData.offensiveSystem}
                  onChange={(e) => setCreateAccountData({ ...createAccountData, offensiveSystem: e.target.value })}
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
                  value={createAccountData.defensiveSystem}
                  onChange={(e) => setCreateAccountData({ ...createAccountData, defensiveSystem: e.target.value })}
                >
                  <option value="">Select System</option>
                  <option value="Pack Line">Pack Line</option>
                  <option value="Havoc">Havoc</option>
                  <option value="Switch">Switch</option>
                  <option value="Zone">Zone</option>
                  <option value="No-Middle">No-Middle</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">Create Account</button>
              <div className="form-footer">
                <a href="#privacy" className="footer-link">Privacy Policy</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

