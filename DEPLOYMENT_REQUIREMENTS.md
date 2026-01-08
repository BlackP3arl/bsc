# Dokploy VPS Deployment Requirements

This document lists all requirements that must be fulfilled to deploy the ICT Scorecard Gantt application on a VPS using Dokploy.

## ✅ Project Configuration Requirements (COMPLETED)

### 1. Node.js Engine Specification
- **Status**: ✅ Configured
- **Files**: 
  - `package.json` - specifies `"node": ">=20.0.0"`
  - `backend/package.json` - specifies `"node": ">=20.0.0"`
  - `frontend/package.json` - specifies `"node": ">=20.0.0"` (added)

### 2. Nixpacks Configuration
- **Status**: ✅ Optimized
- **File**: `nixpacks.toml`
- **Configuration**:
  - Uses Node.js 20
  - Installs all dependencies (backend + frontend)
  - Builds frontend and generates Prisma client
  - Runs migrations and starts server

### 3. Build Scripts
- **Status**: ✅ Configured
- **File**: `package.json`
- **Scripts**:
  - `install:all` - installs backend and frontend dependencies
  - `build` - builds frontend and generates Prisma client
  - `start` - starts the backend server

## 📋 VPS Server Requirements

### Required Software Installation

The VPS must have the following installed and configured:

1. **Docker** (latest version)
   - Containerization platform
   - Required for Dokploy

2. **Docker Swarm** (initialized)
   - Native clustering for Docker
   - Required for multi-container orchestration

3. **RClone** (installed)
   - Command-line program for managing files on cloud storage
   - Required for Dokploy's file management

4. **Nixpacks** (installed)
   - Build tool for creating optimized Docker images
   - Automatically installed with Dokploy

5. **Buildpacks** (installed)
   - Collection of scripts for building applications
   - Automatically installed with Dokploy

6. **Dokploy Network** (created)
   - Custom Docker network for Dokploy
   - Created automatically during Dokploy installation

### Installation Command

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

This single command installs Dokploy and all required dependencies.

## 🔧 Dokploy Application Configuration Requirements

### Application Settings

1. **Build Type**: Nixpacks
2. **Build Path**: Root directory (`.`)
3. **Publish Directory**: Leave empty (backend serves built frontend)
4. **Port**: 3001 (or as configured via `PORT` env var)
5. **Node Version**: 20+ (automatically detected from `engines` field)

### Domain Configuration

1. **Generate Domain**: Create domain in Dokploy dashboard
2. **Port Mapping**: Configure `3001 → 80` (HTTP) or `3001 → 443` (HTTPS)
3. **SSL Certificate**: Set up Let's Encrypt via Dokploy for HTTPS

## 🔐 Environment Variables Requirements

### Backend Environment Variables (Runtime)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/BSC` |
| `PORT` | ⚠️ Optional | Server port (defaults to 3001) | `3001` |
| `NODE_ENV` | ✅ Yes | Environment mode | `production` |

### Frontend Environment Variables (Build-time)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | API endpoint URL | `/api` or `https://api.example.com/api` |

**Important**: `VITE_API_URL` must be set **before** the build phase. If deploying frontend and backend together, use `/api` (relative path).

## 🗄️ Database Requirements

### Option A: External PostgreSQL Database

**Requirements:**
- PostgreSQL 12+ installed and running
- Database named `BSC` (or your preferred name) created
- Database accessible from Dokploy container
- User with CREATE/ALTER permissions for migrations

**Connection String Format:**
```
postgresql://username:password@host:port/database
```

### Option B: PostgreSQL via Dokploy

**Requirements:**
- Deploy PostgreSQL as separate service in Dokploy
- Use internal Docker service name in `DATABASE_URL`
- Create database: `CREATE DATABASE BSC;`

**Connection String Format:**
```
postgresql://postgres:password@postgres-service:5432/BSC
```

### Database Initialization

- **Migrations**: Run automatically via start command (`prisma migrate deploy`)
- **Seeding**: Optional, run manually if needed:
  ```bash
  cd backend && npx prisma db seed
  ```

## 📦 Build Process Requirements

The Nixpacks build process must successfully:

1. ✅ Install Node.js 20+ (via `nixpacks.toml` and `engines` field)
2. ✅ Run `npm run install:all` (installs backend and frontend dependencies)
3. ✅ Run `npm run build` (builds frontend and generates Prisma client)
4. ✅ Start application with migrations: `cd backend && npx prisma migrate deploy && cd .. && npm start`

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Git repository is accessible from VPS
- [ ] All environment variables are configured in Dokploy
- [ ] PostgreSQL database is set up and accessible
- [ ] `DATABASE_URL` is correctly formatted and accessible
- [ ] `VITE_API_URL` points to correct API endpoint
- [ ] `NODE_ENV` is set to `production`
- [ ] Port is configured correctly (3001 or custom)
- [ ] Domain/SSL is configured in Dokploy
- [ ] VPS has all required software installed (Docker, Docker Swarm, etc.)

## 🚀 Deployment Steps Summary

1. **Install Dokploy** on VPS: `curl -sSL https://dokploy.com/install.sh | sh`
2. **Set up PostgreSQL** database (external or via Dokploy)
3. **Add Application** in Dokploy dashboard
4. **Configure** build type (Nixpacks), build path (`.`), and port (3001)
5. **Set Environment Variables** (DATABASE_URL, NODE_ENV, VITE_API_URL, PORT)
6. **Generate Domain** and configure SSL
7. **Deploy** and monitor logs
8. **Verify** deployment via health endpoints
9. **Seed Database** (optional) if initial data is needed

## 📚 Additional Documentation

- See `README.md` for detailed deployment instructions
- See `nixpacks.toml` for build configuration
- See `package.json` for build scripts

## 🔍 Verification

After deployment, verify:

- ✅ Health endpoint: `/api/health` or `/health` returns `{"status":"ok"}`
- ✅ API endpoints are accessible
- ✅ Frontend loads correctly
- ✅ Database connections work
- ✅ Migrations applied successfully
- ✅ Static files are served correctly


