# Review

## Security Issues

### 1. **SQL Injection Risk**
→ Directly interpolating user input into SQL queries.
```typescript
const sql = `SELECT * FROM users WHERE email='${email}' AND
password='${hash}'`;
```
This allows attackers to inject SQL via crafted input (e.g., email=' OR '1'='1).

✅ Fix: Use parameterized queries with $1
```typescript
const sql = "SELECT * FROM users WHERE email=$1 AND password=$2";
const result = await pool.query(sql, [email, hash]);
```

### 2. **Weak Password Hashing (MD5)**
→ MD5 is cryptographically broken and unsafe for password storage.

✅ Fix: Use `bcrypt` or `argon2` for hashing and verifying passwords.

### 3. **No Input Validation**
→ User input is not validated, leading to injection or runtime errors.

✅ Use a validation rules for the inputs, like use library such as `zod`

### 4. **No Error Handling**
→ Database or logic errors are not wrapped in try/catch, which can crash the app.

✅ Fix: Add `try/catch` blocks and global error middleware.

### 5. **Temporary Password Leak**
→ Returning the temporary password (tempPassword) in the response leaks credentials.

✅ Fix: Send it securely via email instead of exposing in response

### 6. **Insecure Session Handling**
→ Sessions are stored in a global variable, which:
- Is lost when the server restarts
- Leaks across requests if the app scales horizontally

✅ Fix: Use a proper session store (e.g., Redis, PostgreSQL, or JWT)

## Performance / Maintainability Issues

### 1. **All Logic in One File**

→ Routes, business logic, and DB access mixed together.

✅ Fix: Split into layers (Controller, Service, Repository).

### 2. **No Layered Architecture**

→ Hard to maintain, extend, or test.

✅ Fix: Introduced clean folder structure with clear responsibilities.

```
src/
├── app.ts                     # Express app configuration (middlewares, routes)
├── server.ts                  # Server startup (listen, environment)
│
├── routes/
│   └── auth.routes.ts         # Defines auth routes and maps them to controller methods
│
├── controllers/
│   └── auth.controller.ts     # Handles request/response layer only
│
├── services/
│   ├── auth.service.ts        # Handles authentication logic
│   └── hash.service.ts        # Handles hashing/comparison logic
│
├── repositories/
│   └── user.repository.ts     # Responsible for database queries only
│
├── middlewares/
│   └── error.middleware.ts    # Global error handler, validation middlewares, etc.
│
├── utils/
│   ├── validation             # folder for inputs validation functions 
│   └── logger.ts              # Optional logger setup
│
├── config/
│   ├── db.ts                  # Database connection setup (e.g., pg Pool)
│   └── env.ts                 # Environment variable loader/validator
│
└── types/
    └── index.d.ts             # Shared interfaces and types (User, TokenPayload, etc.)
```