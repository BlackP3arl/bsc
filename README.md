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

This application is designed to work with Nixpacks for deployment on VPS using Dokploy. Ensure Node.js 20+ is specified in package.json engines field (already configured).

## License

ISC

