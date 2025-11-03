# Notes & Summaries REST API

A clean REST API following **Controller -> Service -> Repository** pattern for managing patients, voice notes, and summaries.

## Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────┐
│   Routes    │ ─── Define HTTP endpoints
└──────┬──────┘
       │
┌──────▼──────────┐
│  Controllers    │ ─── Handle HTTP requests/responses
└──────┬──────────┘
       │
┌──────▼──────────┐
│    Services     │ ─── Business logic & validation
└──────┬──────────┘
       │
┌──────▼──────────┐
│  Repositories   │ ─── Data access layer
└──────┬──────────┘
       │
┌──────▼──────────┐
│    Database     │ ─── JSON file storage
└─────────────────┘
```

## Layer Responsibilities

### **Controllers** (`src/controllers/`)
- Handle HTTP request/response
- Parse request data
- Call appropriate services
- Format responses
- **NO business logic**

### **Services** (`src/services/`)
- Business logic
- Data validation (business rules)
- Orchestrate multiple repositories
- Transaction management
- **NO HTTP concerns**

### **Repositories** (`src/repositories/`)
- Data access only
- CRUD operations
- Query building
- **NO business logic**

## Project Structure

```
src/
├── server.ts                      # Entry point
├── app.ts                        # Express app setup
│
├── controllers/                  # HTTP layer
│   ├── patient.controller.ts     # Patient endpoints handler
│   ├── note.controller.ts        # Note endpoints handler
│   └── health.controller.ts      # Health check handler
│
├── services/                     # Business logic layer
│   ├── patient.service.ts        # Patient business logic
│   ├── note.service.ts           # Note business logic
│   └── summary.service.ts        # Summary generation logic
│
├── repositories/                 # Data access layer
│   ├── patient.repository.ts     # Patient data operations
│   ├── note.repository.ts        # Note data operations
│   └── summary.repository.ts     # Summary data operations
│
├── routes/                       # Route definitions
│   ├── patient.routes.ts         # Patient routes
│   ├── note.routes.ts            # Note routes
│   └── health.routes.ts          # Health routes
│
├── middleware/                   # Express middleware
│   ├── auth.ts                   # Authentication
│   └── errorHandler.ts           # Error handling
│
├── validators/                   # Input validation
│   └── schemas.ts                # Zod schemas
│
├── types/                        # TypeScript types
│   └── index.ts                  # Interfaces & DTOs
│
└── database/                     # Database layer
    └── jsonDb.ts                 # JSON file operations
```

## Request Flow Example

Creating a patient:
```
1. POST /api/patients
   ↓
2. patient.routes.ts → Maps to controller
   ↓
3. PatientController.createPatient()
   - Validates input with Zod
   - Calls service
   ↓
4. PatientService.createPatient()
   - Checks email uniqueness
   - Applies business rules
   - Generates ID and timestamps
   - Calls repository
   ↓
5. PatientRepository.create()
   - Writes to database
   - Returns patient
   ↓
6. Response flows back up through layers
   ↓
7. Client receives JSON response
```

## Features

✅ Clean MVC Architecture
✅ Separation of concerns
✅ Dependency injection ready
✅ Easy to test each layer
✅ Zod validation
✅ API key authentication
✅ Health checks
✅ Comprehensive tests

## Quick Start

### Option 1: Local Development

```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
API_KEYS=dev-key-123,test-key-456
PORT=3000
EOF

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Option 2: Docker 🐳

The application is fully dockerized for easy deployment.

#### Using Docker Compose (Recommended)

```bash
# 1. Create .env file
cat > .env << EOF
API_KEYS=dev-key-123
PORT=3000
EOF

# 2. Build and start the container
docker-compose up -d

# 3. View logs
docker-compose logs -f

# 4. Stop the container
docker-compose down
```

## API Endpoints

### Health
```
GET /health           - Health check
GET /health/ready     - Readiness check
```

### Patients
```
GET    /api/patients           - List all patients
GET    /api/patients/:id       - Get patient by ID
POST   /api/patients           - Create patient
PATCH  /api/patients/:id       - Update patient
DELETE /api/patients/:id       - Delete patient
```

### Voice Notes
```
GET    /api/notes              - List notes (?patientId=xxx)
GET    /api/notes/:id          - Get note by ID
POST   /api/notes              - Create note
DELETE /api/notes/:id          - Delete note
```

### Summaries
```
POST   /api/notes/:id/summary  - Generate summary
GET    /api/notes/:id/summary  - Get summary
```

## Authentication

All API endpoints (except health checks) require authentication using an API key.

### Setup

1. **Create a `.env` file** in the project root:

```bash
# .env
API_KEY=your-secret-key-123
PORT=3000
```

2. **Load environment variables** (already configured in the app)

3. **Use the API key** in your requests:

```bash
curl -X GET http://localhost:3000/api/patients \
  -H "X-API-Key: your-secret-key-123"
```

### How It Works

- API key is stored in the `API_KEY` environment variable (comma-separated)
- Each request must include the `X-API-Key` header
- If the key doesn't match, you'll get a `401 Unauthorized` response


### Generating Secure API Keys

```bash
# Generate a secure random key (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online tools like:
# https://randomkeygen.com/
```

## Example Usage

```bash
# Create a patient
curl -X POST http://localhost:3000/api/patients \
  -H "X-API-Key: dev-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "dateOfBirth": "1990-05-15",
    "email": "john@example.com"
  }'

# Create a voice note
curl -X POST http://localhost:3000/api/notes \
  -H "X-API-Key: dev-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "abc123",
    "title": "Consultation",
    "duration": 180,
    "recordedAt": "2025-11-02T10:00:00Z"
  }'

# Generate summary
curl -X POST http://localhost:3000/api/notes/xyz789/summary \
  -H "X-API-Key: dev-key-123"
```

## Testing Architecture

Tests verify the entire flow through all layers:
- Controller receives request
- Service applies business logic
- Repository accesses data
- Response returns to client

```bash
npm test
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
Each layer has a single responsibility

### 2. **Testability**
Easy to unit test each layer independently

### 3. **Maintainability**
Changes in one layer don't affect others

### 4. **Scalability**
Easy to add new features following the pattern

### 5. **Reusability**
Services can be used by multiple controllers

### 6. **Database Agnostic**
Repositories can be swapped (JSON → SQLite → PostgreSQL)

## Extending the Architecture

### Adding a new entity:

1. **Define types** in `src/types/index.ts`
2. **Create repository** in `src/repositories/`
3. **Create service** in `src/services/`
4. **Create controller** in `src/controllers/`
5. **Define routes** in `src/routes/`
6. **Register routes** in `src/app.ts`
7. **Add tests** in `tests/`