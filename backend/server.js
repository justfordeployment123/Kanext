const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in Docker
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database file path
const DB_PATH = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

// Helper functions to read/write users
const readUsers = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'KaNeXT IQ Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      teamName, 
      division, 
      offensiveSystem, 
      defensiveSystem 
    } = req.body;

    // Validation
    if (!fullName || !email || !password || !teamName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fullName, email, password, teamName'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters'
      });
    }

    // Check if user already exists
    const users = readUsers();
    const existingUser = users.find(u => u.email === email.toLowerCase());
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      teamName,
      division: division || 'NCAA D1',
      offensiveSystem: offensiveSystem || 'Five-Out',
      defensiveSystem: defensiveSystem || 'Pack Line',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // Generate JWT token
    const tokenPayload = {
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      teamName: newUser.teamName,
      division: newUser.division,
      offensiveSystem: newUser.offensiveSystem,
      defensiveSystem: newUser.defensiveSystem
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        teamName: newUser.teamName,
        division: newUser.division,
        offensiveSystem: newUser.offensiveSystem,
        defensiveSystem: newUser.defensiveSystem
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const users = readUsers();
    const user = users.find(u => u.email === email.toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      teamName: user.teamName,
      division: user.division,
      offensiveSystem: user.offensiveSystem,
      defensiveSystem: user.defensiveSystem
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        teamName: user.teamName,
        division: user.division,
        offensiveSystem: user.offensiveSystem,
        defensiveSystem: user.defensiveSystem
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
});

// Verify token (protected route example)
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Get user profile (protected route)
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      teamName: user.teamName,
      division: user.division,
      offensiveSystem: user.offensiveSystem,
      defensiveSystem: user.defensiveSystem
    }
  });
});

// Start server - listen on all interfaces for Docker
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KaNeXT IQ Backend API running on http://0.0.0.0:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

