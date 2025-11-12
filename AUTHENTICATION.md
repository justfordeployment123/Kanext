# JWT Authentication System

This application uses JWT (JSON Web Token) authentication to secure user sessions and protect routes.

## Features

- ✅ User registration with JWT token generation
- ✅ User login with JWT token storage
- ✅ Protected routes that require authentication
- ✅ Token expiration handling (24 hours)
- ✅ Automatic token validation
- ✅ Secure logout with token removal
- ✅ API client with automatic token injection

## Architecture

### Services

#### `authService.js`
Handles all authentication operations:
- `login(email, password)` - Authenticate user and receive JWT token
- `register(userData)` - Create new user account and receive JWT token
- `logout()` - Remove token and clear user data
- `isAuthenticated()` - Check if user has valid token
- `getCurrentUser()` - Get user data from token
- `getToken()` - Get stored JWT token
- `refreshToken()` - Refresh expired token (if implemented)

#### `api.js`
HTTP client with automatic JWT token injection:
- `get(endpoint, options)` - GET request with auth header
- `post(endpoint, data, options)` - POST request with auth header
- `put(endpoint, data, options)` - PUT request with auth header
- `delete(endpoint, options)` - DELETE request with auth header
- `patch(endpoint, data, options)` - PATCH request with auth header

### Components

#### `ProtectedRoute.js`
Wrapper component that protects routes requiring authentication:
- Checks if user is authenticated
- Redirects to login if not authenticated
- Syncs user profile from token

## Usage

### Login Flow

1. User enters email and password
2. `login()` function is called
3. Backend validates credentials and returns JWT token
4. Token is stored in `localStorage` as `authToken`
5. User profile is set in context
6. User is redirected to protected route

### Registration Flow

1. User fills registration form
2. `register()` function is called with user data
3. Backend creates user account and returns JWT token
4. Token is stored in `localStorage`
5. User profile is set in context
6. User is redirected to office

### Protected Routes

All routes except `/`, `/login`, and `/about` are protected:

```jsx
<Route 
  path="/office" 
  element={
    <ProtectedRoute>
      <OfficePage />
    </ProtectedRoute>
  } 
/>
```

### Making Authenticated API Calls

```javascript
import { get, post } from '../services/api';

// GET request with token
const data = await get('/users/profile');

// POST request with token
const result = await post('/players', {
  name: 'John Doe',
  position: 'PG'
});
```

## Token Structure

JWT tokens contain:
- User information (id, email, fullName, teamName, etc.)
- Expiration timestamp (`exp`)
- Issued at timestamp (`iat`)

## Mock vs Production

### Current Implementation (Mock)
- Uses in-memory user database
- Simple JWT-like token generation (base64 encoded)
- No real backend required

### Production Setup
To connect to a real backend:

1. Set environment variable:
```bash
REACT_APP_API_URL=https://your-api.com/api
```

2. Update `authService.js` to use real API endpoints:
```javascript
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

3. Ensure backend:
   - Validates credentials
   - Generates proper JWT tokens
   - Returns tokens in response
   - Validates tokens on protected endpoints

## Security Notes

⚠️ **Important for Production:**

1. **Never store sensitive data in JWT tokens** - Only store user ID and non-sensitive info
2. **Use HTTPS** - Always use HTTPS in production
3. **Token expiration** - Tokens expire after 24 hours
4. **Token refresh** - Implement refresh token flow for better security
5. **Password hashing** - Backend must hash passwords (never store plain text)
6. **CORS** - Configure CORS properly on backend
7. **Token validation** - Backend must verify token signature

## Testing

### Test Credentials (Mock)
- Email: `coach@example.com`
- Password: `password123`

### Creating New Users
Use the registration form to create new accounts. New users are stored in memory (mock) and will persist until page refresh.

## Environment Variables

Create a `.env` file for production:

```env
REACT_APP_API_URL=https://your-api.com/api
```

## Logout

Logout clears:
- JWT token
- User profile
- All localStorage data
- Redirects to login page

```javascript
import { logout } from '../services/authService';

logout();
```

