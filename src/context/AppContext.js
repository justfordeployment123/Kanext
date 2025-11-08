import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Coach Profile State
  const [coachProfile, setCoachProfile] = useState(() => {
    const saved = localStorage.getItem('coachProfile');
    return saved ? JSON.parse(saved) : null;
  });

  // Coaching IQ / Bias State
  const [coachingBias, setCoachingBias] = useState(() => {
    const saved = localStorage.getItem('coachingBias');
    return saved ? JSON.parse(saved) : null;
  });

  // Team State
  const [teamState, setTeamState] = useState(() => {
    const saved = localStorage.getItem('teamState');
    return saved ? JSON.parse(saved) : {
      roster: [],
      teamKPI: 0,
      systemFit: 0,
      confidenceAvg: 0,
      scholarshipUsed: 0,
      nilUtilized: 0
    };
  });

  // Player Profiles
  const [playerProfiles, setPlayerProfiles] = useState(() => {
    const saved = localStorage.getItem('playerProfiles');
    return saved ? JSON.parse(saved) : [];
  });

  // Recruiting State
  const [recruitingState, setRecruitingState] = useState(() => {
    const saved = localStorage.getItem('recruitingState');
    return saved ? JSON.parse(saved) : {
      activeRecruits: [],
      priorityRecruits: [],
      committedCount: 0
    };
  });

  // Coach K Assistant State
  const [coachKState, setCoachKState] = useState({
    isOpen: false,
    isMinimized: false,
    messages: [],
    currentStage: 'welcome'
  });

  // Persist to localStorage
  useEffect(() => {
    if (coachProfile) {
      localStorage.setItem('coachProfile', JSON.stringify(coachProfile));
    }
  }, [coachProfile]);

  useEffect(() => {
    if (coachingBias) {
      localStorage.setItem('coachingBias', JSON.stringify(coachingBias));
    }
  }, [coachingBias]);

  useEffect(() => {
    localStorage.setItem('teamState', JSON.stringify(teamState));
  }, [teamState]);

  useEffect(() => {
    localStorage.setItem('playerProfiles', JSON.stringify(playerProfiles));
  }, [playerProfiles]);

  useEffect(() => {
    localStorage.setItem('recruitingState', JSON.stringify(recruitingState));
  }, [recruitingState]);

  // Helper Functions
  const addPlayerProfile = (player) => {
    setPlayerProfiles(prev => [...prev, { ...player, id: Date.now().toString() }]);
  };

  const updatePlayerProfile = (id, updates) => {
    setPlayerProfiles(prev => 
      prev.map(player => player.id === id ? { ...player, ...updates } : player)
    );
  };

  const addToRoster = (player) => {
    setTeamState(prev => ({
      ...prev,
      roster: [...prev.roster, player]
    }));
  };

  const updateCoachingBias = (bias) => {
    setCoachingBias(bias);
  };

  const addCoachKMessage = (message) => {
    setCoachKState(prev => ({
      ...prev,
      messages: [...prev.messages, { ...message, timestamp: Date.now() }]
    }));
  };

  const toggleCoachK = () => {
    setCoachKState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const minimizeCoachK = () => {
    setCoachKState(prev => ({ ...prev, isMinimized: true, isOpen: false }));
  };

  const value = {
    coachProfile,
    setCoachProfile,
    coachingBias,
    setCoachingBias,
    updateCoachingBias,
    teamState,
    setTeamState,
    playerProfiles,
    setPlayerProfiles,
    addPlayerProfile,
    updatePlayerProfile,
    addToRoster,
    recruitingState,
    setRecruitingState,
    coachKState,
    setCoachKState,
    addCoachKMessage,
    toggleCoachK,
    minimizeCoachK
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

