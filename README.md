# ICT Scorecard Gantt Chart Web Application

A full-stack web application for planning and tracking ICT initiatives using an interactive Gantt chart. The application allows users to visually schedule initiatives by drawing, moving, and resizing timeline bars. All changes persist to a database in real-time.

## Features

- **Interactive Gantt Chart**: Visual timeline for scheduling initiatives
- **Drag & Drop**: Move and resize schedule bars with mouse interactions
- **Auto-Save**: Changes are automatically saved to the database
- **Initiative Management**: View and edit initiative details
- **Schedule Summary**: Overview of all scheduled initiatives
- **Data Export**: Export schedules as JSON or CSV
- **Responsive Design**: Clean, professional UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js 20+ with Express.js
- PostgreSQL database
- Prisma ORM

### Frontend
- React 18+ with Vite
- Tailwind CSS
- Axios for API calls

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 12+ (if using local instance instead of Docker)
- Docker and Docker Compose (optional - only if not using local PostgreSQL)
- npm or yarn

## Setup Instructions

### 1. Start Database

Choose one of the following options:

#### Option A: Using Docker Compose

```bash
docker-compose up -d
```

This will start PostgreSQL and pgAdmin containers.

#### Option B: Using Local PostgreSQL

If you already have PostgreSQL running locally:

1. Create the database:
   ```bash
   createdb BSC
   # Or using psql:
   psql -U your_username -c "CREATE DATABASE BSC;"
   ```

2. Ensure PostgreSQL is running on your system

3. Update the `DATABASE_URL` in `backend/.env` (see Environment Variables section below)

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env  # Edit .env with your database credentials if needed
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env  # Edit if needed
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **View Initiatives**: All initiatives are grouped by perspective (Financial, Customer, Internal Process, Organization)

2. **Create Schedule**: Click on an empty grid cell in a row to create a new schedule bar

3. **Move Schedule**: Click and drag a schedule bar to move it to different months

4. **Resize Schedule**: Click and drag the left or right edge of a bar to adjust start/end dates

5. **Delete Schedule**: Double-click a schedule bar to delete it

6. **View Details**: Click on an initiative name to view details in the sidebar

7. **Export Data**: Click the "Export" button to download schedules as JSON or CSV

## Project Structure

```
ict-gantt-planner/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Perspectives
- `GET /api/perspectives` - List all perspectives with initiatives
- `GET /api/perspectives/:id` - Get single perspective

### Initiatives
- `GET /api/initiatives` - List all initiatives
- `GET /api/initiatives/:id` - Get single initiative
- `POST /api/initiatives` - Create initiative
- `PUT /api/initiatives/:id` - Update initiative
- `DELETE /api/initiatives/:id` - Delete initiative
- `PATCH /api/initiatives/:id/schedule` - Upsert schedule

### Schedules
- `GET /api/schedules` - List all schedules
- `GET /api/schedules/:id` - Get single schedule
- `POST /api/schedules` - Create schedule
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule
- `PUT /api/schedules/bulk` - Bulk update schedules

### Gantt Data
- `GET /api/gantt-data` - Get all data for Gantt chart

## Environment Variables

### Backend (.env)

**If using Docker Compose:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/BSC"
PORT=3001
NODE_ENV=development
```

**If using Local PostgreSQL:**
```
DATABASE_URL="postgresql://username:password@localhost:5432/BSC"
PORT=3001
NODE_ENV=development
```

Replace `username` and `password` with your PostgreSQL credentials. Adjust the port if your PostgreSQL instance uses a different port (default is 5432).

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

## Development

- Backend uses `--watch` flag for auto-reload
- Frontend uses Vite's hot module replacement
- Prisma Studio: `cd backend && npx prisma studio` to view database

## Deployment

This application is designed to work with Nixpacks for deployment on VPS using Dokploy. The project is pre-configured with Node.js 20+ in the `engines` field and includes an optimized `nixpacks.toml` configuration.

### Prerequisites for VPS Deployment

Before deploying, ensure your VPS has the following installed:

- **Docker** (latest version)
- **Docker Swarm** (initialized)
- **RClone** (for file management)
- **Nixpacks** (build tool)
- **Buildpacks** (collection of build scripts)

### Installing Dokploy on VPS

Run the following command on your VPS to install Dokploy and all dependencies:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

This script will:
- Install Dokploy and its dependencies
- Initialize Docker Swarm
- Create the Dokploy network
- Set up the main directory for applications

### Database Setup

You have two options for PostgreSQL:

#### Option A: External PostgreSQL Database

1. Set up PostgreSQL on your VPS or use a managed database service (e.g., AWS RDS, DigitalOcean Managed Database)
2. Create a database named `BSC` (or your preferred name)
3. Note the connection details (host, port, username, password)

#### Option B: PostgreSQL via Dokploy

1. In Dokploy dashboard, deploy PostgreSQL as a separate service
2. Use the internal Docker service name for the connection
3. Create the database: `CREATE DATABASE BSC;`

### Deploying the Application

#### 1. Add Application in Dokploy

1. Access your Dokploy dashboard
2. Navigate to **Applications → Add Application**
3. Configure the following:
   - **Name**: `ict-scorecard-gantt` (or your preferred name)
   - **Repository URL**: Your Git repository URL
   - **Branch**: `main` (or your deployment branch)
   - **Build Type**: Select **Nixpacks**
   - **Build Path**: `.` (root directory)
   - **Publish Directory**: Leave empty (backend serves built frontend)

#### 2. Configure Environment Variables

In the application settings, add the following environment variables:

**Backend Environment Variables:**

```bash
# Required: PostgreSQL connection string
# Format: postgresql://user:password@host:port/database
# For external database:
DATABASE_URL="postgresql://username:password@your-db-host:5432/BSC"
# For Dokploy PostgreSQL service:
DATABASE_URL="postgresql://postgres:password@postgres-service:5432/BSC"

# Optional: Server port (defaults to 3001)
PORT=3001

# Required: Set to production for deployment
NODE_ENV="production"
```

**Frontend Environment Variables (Build-time):**

```bash
# Required: API endpoint URL
# If deploying on same domain: /api
# If deploying separately: https://your-api-domain.com/api
VITE_API_URL="/api"
```

**Important Notes:**
- `VITE_API_URL` must be set at **build time** (before deployment)
- If frontend and backend are deployed together, use `/api` (relative path)
- If deploying separately, use the full API URL
- `DATABASE_URL` must be accessible from the Dokploy container

#### 3. Configure Port and Domain

1. In application settings, set the **Port** to `3001` (or your configured PORT)
2. Generate a domain in Dokploy:
   - Click **Generate Domain**
   - Configure port mapping: `3001 → 80` (HTTP) or `3001 → 443` (HTTPS)
3. Set up SSL certificate:
   - Dokploy supports Let's Encrypt for automatic SSL
   - Enable SSL in the domain settings

#### 4. Deploy

1. Click the **Deploy** button
2. Monitor the deployment logs:
   - Nixpacks will install Node.js 20+
   - Install all dependencies (backend and frontend)
   - Build the frontend (React/Vite)
   - Generate Prisma client
   - Run database migrations
   - Start the server

#### 5. Database Initialization

The deployment automatically runs Prisma migrations via the start command. If you need to seed the database with initial data:

1. Connect to your Dokploy container or use Dokploy's terminal feature
2. Run the seed command:
   ```bash
   cd backend && npx prisma db seed
   ```

**Note:** The seed script uses `upsert`, so it's safe to run multiple times.

### Build Process Overview

The Nixpacks build process follows these steps:

1. **Setup Phase**: Installs Node.js 20 (as specified in `nixpacks.toml` and `package.json`)
2. **Install Phase**: Runs `npm run install:all` (installs backend and frontend dependencies)
3. **Build Phase**: Runs `npm run build` which:
   - Builds the frontend React app (outputs to `frontend/dist`)
   - Generates Prisma client (with dummy DATABASE_URL for build)
4. **Start Phase**: Runs migrations and starts the server:
   - `cd backend && npx prisma migrate deploy` (applies database migrations)
   - `npm start` (starts the Express server)

### Troubleshooting

#### Build Fails

- **Check Node.js version**: Ensure `engines` field specifies `>=20.0.0` in `package.json`
- **Check build logs**: Verify that `npm run install:all` and `npm run build` complete successfully
- **Prisma generation**: Ensure `DATABASE_URL` is available for migrations (not needed for client generation)

#### Application Won't Start

- **Database connection**: Verify `DATABASE_URL` is correct and database is accessible
- **Port binding**: Ensure server binds to `0.0.0.0` (already configured in `backend/src/index.js`)
- **Check logs**: Review application logs in Dokploy dashboard

#### Frontend Not Loading

- **Build output**: Verify `frontend/dist` directory exists after build
- **Static serving**: Check that `NODE_ENV=production` is set
- **API URL**: Verify `VITE_API_URL` was set correctly at build time

#### Database Migration Errors

- **Connection**: Ensure `DATABASE_URL` is correct and database exists
- **Permissions**: Verify database user has CREATE/ALTER permissions
- **Manual migration**: You can run migrations manually via Dokploy terminal:
  ```bash
  cd backend && npx prisma migrate deploy
  ```

### Post-Deployment

After successful deployment:

1. **Verify Health**: Check `/api/health` or `/health` endpoints
2. **Test API**: Verify API endpoints are accessible
3. **Test Frontend**: Access the application via the generated domain
4. **Monitor Logs**: Keep an eye on application logs for any errors
5. **Database**: Verify data persistence by creating test schedules

### Additional Resources

- [Dokploy Documentation](https://docs.dokploy.com)
- [Nixpacks Documentation](https://nixpacks.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

## License

ISC

