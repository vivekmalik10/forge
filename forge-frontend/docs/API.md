# Forge API – Request/Response Reference

Base URL: `process.env.NEXT_PUBLIC_API_URL` (e.g. `http://localhost:4000`).

All JSON requests: `Content-Type: application/json`.

Protected routes require: `Authorization: Bearer <accessToken>`.

---

## App (root)

| Method | Path | Auth | Headers | Body | Response |
|--------|------|------|---------|------|----------|
| **GET** | `/` | No | — | — | `string` (e.g. "Hello World!") |

---

## Auth (`/auth`)

| Method | Path | Auth | Headers | Body | Response |
|--------|------|------|---------|------|----------|
| **POST** | `/auth/register` | No | `Content-Type: application/json` | **RegisterDto** | **AuthResponse** |
| **POST** | `/auth/login` | No | `Content-Type: application/json` | **LoginDto** | **AuthResponse** |
| **POST** | `/auth/refresh` | No | `Content-Type: application/json` | **RefreshTokenDto** | **AuthResponse** |
| **POST** | `/auth/logout` | No | `Content-Type: application/json` | **RefreshTokenDto** | `{ revoked: boolean }` |
| **GET** | `/auth/me` | Yes (Bearer) | `Authorization: Bearer <accessToken>` | — | **AuthResponse** |

### Body types (Auth)

**RegisterDto**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 4 chars)",
  "name": "string (optional, max 100)"
}
```

**LoginDto**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**RefreshTokenDto**
```json
{
  "refreshToken": "string (required)"
}
```

### AuthResponse
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "expiresIn": "string",
  "refreshExpiresIn": "string",
  "user": {
    "id": "string (uuid)",
    "email": "string",
    "name": "string | null",
    "emailVerified": "boolean",
    "isActive": "boolean",
    "role": "user | admin",
    "avatarUrl": "string | null",
    "lastLoginAt": "string (ISO date) | null",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
}
```

---

## Users (`/users`)

| Method | Path | Auth | Headers | Body | Response |
|--------|------|------|---------|------|----------|
| **GET** | `/users/me` | Yes (Bearer) | `Authorization: Bearer <accessToken>` | — | **User** |
| **PATCH** | `/users/me` | Yes (Bearer) | `Authorization: Bearer <accessToken>`, `Content-Type: application/json` | **UpdateProfileDto** | **User** |

### Body type (Users)

**UpdateProfileDto**
```json
{
  "name": "string (optional, max 100)",
  "avatarUrl": "string | null (optional, valid URL or null to clear)"
}
```

### User (response)
```json
{
  "id": "string (uuid)",
  "email": "string",
  "name": "string | null",
  "emailVerified": "boolean",
  "isActive": "boolean",
  "role": "user | admin",
  "avatarUrl": "string | null",
  "lastLoginAt": "string (ISO date) | null",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

---

## Health (`/health`)

| Method | Path | Auth | Headers | Body | Response |
|--------|------|------|---------|------|----------|
| **GET** | `/health` | No | — | — | **HealthCheckResult** (database + redis status) |
| **GET** | `/health/live` | No | — | — | `{ "status": "ok" }` |

### Health check response (GET /health)
```json
{
  "status": "ok" | "error",
  "info": { "database": { "status": "up" }, "redis": { "status": "up" } },
  "error": {},
  "details": {}
}
```

---

## Quick copy-paste (frontend)

### Headers

**No auth (public):**
```ts
{ "Content-Type": "application/json" }
```

**With auth (protected):**
```ts
{
  "Content-Type": "application/json",
  "Authorization": `Bearer ${accessToken}`,
}
```

### Fetch examples

```ts
// GET / (public)
fetch(`${API_URL}/`).then(r => r.text());

// POST /auth/login (public)
fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "...", password: "..." }),
}).then(r => r.json());

// POST /auth/refresh (public)
fetch(`${API_URL}/auth/refresh`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ refreshToken: "..." }),
}).then(r => r.json());

// GET /auth/me (protected)
fetch(`${API_URL}/auth/me`, {
  headers: { Authorization: `Bearer ${accessToken}` },
}).then(r => r.json());

// GET /users/me (protected)
fetch(`${API_URL}/users/me`, {
  headers: { Authorization: `Bearer ${accessToken}` },
}).then(r => r.json());

// PATCH /users/me (protected)
fetch(`${API_URL}/users/me`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
  body: JSON.stringify({ name: "...", avatarUrl: "..." }),
}).then(r => r.json());

// GET /health (public)
fetch(`${API_URL}/health`).then(r => r.json());
```
