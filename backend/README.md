# KaNeXT IQ Backend API

Backend server for KaNeXT IQ™ platform with JWT authentication.

## Features

- ✅ JWT-based authentication
- ✅ User registration with password hashing (bcrypt)
- ✅ User login with token generation
- ✅ Protected routes with token verification
- ✅ CORS enabled for frontend
- ✅ JSON file-based database (easily replaceable with MongoDB/PostgreSQL)

## Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and set your JWT_SECRET (minimum 32 characters)
```

3. **Start server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

### Register User
```
POST /api/auth/register
Body: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "teamName": "Team Name",
  "division": "NCAA D1",
  "offensiveSystem": "Five-Out",
  "defensiveSystem": "Pack Line"
}
```

### Login
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

### Verify Token
```
GET /api/auth/verify
Headers: {
  "Authorization": "Bearer <token>"
}
```

### Get Profile
```
GET /api/auth/profile
Headers: {
  "Authorization": "Bearer <token>"
}
```

## Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT signing (REQUIRED in production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## Database

Currently uses JSON file storage (`data/users.json`). To use a real database:

1. Install database driver (e.g., `mongoose` for MongoDB, `pg` for PostgreSQL)
2. Replace `readUsers()` and `writeUsers()` functions with database queries
3. Update user schema as needed

## Security Notes

⚠️ **For Production:**

1. **Change JWT_SECRET** - Use a strong, random secret (minimum 32 characters)
2. **Use HTTPS** - Always use HTTPS in production
3. **Environment Variables** - Never commit `.env` file
4. **Rate Limiting** - Add rate limiting to prevent brute force attacks
5. **Input Validation** - Add more robust input validation
6. **Database** - Replace JSON file with proper database (MongoDB, PostgreSQL, etc.)

## Testing

Test the API with curl or Postman:

```bash
# Health check
curl http://localhost:3001/api/health

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "teamName": "Test Team"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

