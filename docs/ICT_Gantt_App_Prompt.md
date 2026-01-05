# Claude Code Prompt: ICT Scorecard Gantt Chart Web Application

## Project Overview

Build a full-stack web application for planning and tracking ICT initiatives using an interactive Gantt chart. The application allows users to visually schedule initiatives by drawing, moving, and resizing timeline bars. All changes persist to a database in real-time.
This will be deployed on a VPS using Dokploy, so ensure the project works with Nixpacks (specify Node 20+ in package json engines).

## Technical Stack

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** PostgreSQL (use Prisma ORM for database operations)
- **API:** RESTful JSON API

### Frontend
- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **State Management:** React hooks (useState, useEffect, useCallback)
- **HTTP Client:** Axios or fetch API

## Database Schema

Create the following tables:

```
Table: perspectives
- id: UUID (primary key)
- name: VARCHAR(100) NOT NULL UNIQUE
- color_bg: VARCHAR(7) NOT NULL (hex color for background)
- color_bar: VARCHAR(7) NOT NULL (hex color for bars)
- color_header: VARCHAR(7) NOT NULL (hex color for headers)
- display_order: INTEGER NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

Table: initiatives
- id: UUID (primary key)
- code: VARCHAR(10) NOT NULL UNIQUE (e.g., "F1", "C2", "I3")
- name: VARCHAR(255) NOT NULL
- description: TEXT
- perspective_id: UUID FOREIGN KEY -> perspectives.id
- target_kpi: VARCHAR(100)
- estimated_effort: VARCHAR(50)
- priority: ENUM('high', 'medium', 'low')
- display_order: INTEGER NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

Table: schedules
- id: UUID (primary key)
- initiative_id: UUID FOREIGN KEY -> initiatives.id (UNIQUE)
- year: INTEGER NOT NULL DEFAULT 2026
- start_month: INTEGER NOT NULL (0-11, where 0=January)
- end_month: INTEGER NOT NULL (0-11, where 0=January)
- notes: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

CONSTRAINT: start_month <= end_month
CONSTRAINT: start_month >= 0 AND start_month <= 11
CONSTRAINT: end_month >= 0 AND end_month <= 11
```

## Seed Data

Populate the database with the following initial data:

### Perspectives (4 records)
1. Financial - colors: bg=#dbeafe, bar=#3b82f6, header=#1e40af
2. Customer - colors: bg=#dcfce7, bar=#22c55e, header=#166534
3. Internal Process - colors: bg=#fef3c7, bar=#f59e0b, header=#b45309
4. Organization - colors: bg=#f3e8ff, bar=#a855f7, header=#7c3aed

### Initiatives (30 records)

**Financial (F1-F6):**
- F1: License usage audit
- F2: Real-time license monitoring system
- F3: Open-source alternatives assessment
- F4: Pilot testing open-source solutions
- F5: Migration roadmap development
- F6: Staff training on open-source tools

**Customer (C1-C11):**
- C1: Project/task management system
- C2: Extend CMMS functionality
- C3: Extend PMS functionality
- C4: Boatyard Management System (ERD)
- C5: Digitize historical records (CS)
- C6: Digitalize board paper submission (CS)
- C7: Implement Retail module (TD)
- C8: Implement CRM module (TD)
- C9: Helpdesk KPIs and metrics
- C10: AI chatbots for support
- C11: Cybersecurity awareness training

**Internal Process (I1-I7):**
- I1: Define SLAs for critical services
- I2: SLA monitoring and reporting tools
- I3: Regular SLA performance reviews
- I4: Corrective measures for SLA issues
- I5: ICT staff SLA management training
- I6: Map IT processes and identify gaps
- I7: Standardized workflows documentation

**Organization (O1-O6):**
- O1: Technical workshops/knowledge sharing
- O2: Certification incentives program
- O3: Pilot emerging technologies
- O4: Innovation lab/sandbox environment
- O5: Innovation brainstorming sessions
- O6: Reward technology adoption success

## API Endpoints

### Perspectives
```
GET    /api/perspectives          - List all perspectives with their initiatives
GET    /api/perspectives/:id      - Get single perspective with initiatives
```

### Initiatives
```
GET    /api/initiatives           - List all initiatives (include perspective data)
GET    /api/initiatives/:id       - Get single initiative with schedule
POST   /api/initiatives           - Create new initiative
PUT    /api/initiatives/:id       - Update initiative details
DELETE /api/initiatives/:id       - Delete initiative and its schedule
```

### Schedules
```
GET    /api/schedules             - List all schedules (include initiative data)
GET    /api/schedules/:id         - Get single schedule
POST   /api/schedules             - Create schedule for an initiative
PUT    /api/schedules/:id         - Update schedule (start_month, end_month)
DELETE /api/schedules/:id         - Delete schedule
PATCH  /api/initiatives/:id/schedule - Upsert schedule (create or update)
```

### Bulk Operations
```
GET    /api/gantt-data            - Get all data needed for Gantt chart (perspectives, initiatives, schedules in one call)
PUT    /api/schedules/bulk        - Bulk update multiple schedules
```

## Frontend Components

### Component Structure
```
src/
├── components/
│   ├── GanttChart/
│   │   ├── GanttChart.jsx        - Main container component
│   │   ├── GanttHeader.jsx       - Timeline header (quarters/months)
│   │   ├── GanttRow.jsx          - Single initiative row
│   │   ├── GanttBar.jsx          - Draggable/resizable bar
│   │   ├── PerspectiveGroup.jsx  - Group header for each perspective
│   │   └── TimelineGrid.jsx      - Background grid cells
│   ├── Sidebar/
│   │   ├── InitiativeDetails.jsx - Detail panel for selected initiative
│   │   └── ScheduleSummary.jsx   - List of scheduled initiatives
│   ├── Modals/
│   │   ├── InitiativeModal.jsx   - Add/Edit initiative form
│   │   └── ExportModal.jsx       - Export options
│   └── common/
│       ├── LoadingSpinner.jsx
│       ├── ErrorMessage.jsx
│       └── Toast.jsx             - Notification component
├── hooks/
│   ├── useGanttData.js           - Fetch and manage Gantt data
│   ├── useDragAndDrop.js         - Drag/resize logic
│   └── useAutoSave.js            - Debounced auto-save
├── services/
│   └── api.js                    - API client functions
├── utils/
│   ├── dateUtils.js              - Month/date helpers
│   └── colorUtils.js             - Color manipulation
└── App.jsx
```

## Core Features

### 1. Interactive Gantt Chart
- Display all initiatives grouped by perspective
- Show Jan-Dec 2026 timeline with Q1-Q4 quarter markers
- Color-coded bars by perspective
- Smooth scrolling for the timeline area
- Sticky left column (initiative names) when scrolling horizontally

### 2. Bar Interactions
- **Create:** Click and drag on empty grid cells to draw a new bar
- **Move:** Drag existing bar to reposition (maintains duration)
- **Resize:** Drag left/right edges to adjust start/end dates
- **Delete:** Double-click bar to remove schedule
- Visual feedback during drag operations (opacity change, cursor)
- Prevent invalid states (end before start, out of bounds)

### 3. Auto-Save
- Automatically save changes to database after user stops interacting
- Debounce saves (300-500ms delay)
- Show subtle saving indicator
- Display success/error toast notifications

### 4. Initiative Details Panel
- Click initiative name to view details in sidebar
- Show: code, name, description, target KPI, estimated effort, priority
- Display current schedule if set
- Allow editing initiative metadata

### 5. Schedule Summary
- Show count of scheduled vs total initiatives
- List all scheduled initiatives sorted by start date
- Quick jump to initiative when clicked

### 6. Data Export
- Export schedule data as JSON
- Export as CSV (initiative code, name, start month, end month)
- Print-friendly view option

## UI/UX Requirements

### Layout
- Full-height application (100vh)
- Left sidebar (collapsible): 300px for details/summary
- Main area: Gantt chart with horizontal scroll
- Top header: Application title, export buttons, view options

### Visual Design
- Clean, professional appearance
- White background for chart area
- Subtle grid lines (light gray)
- Quarter separators slightly darker
- Alternating row backgrounds for readability
- Perspective headers with full-width color bands

### Responsiveness
- Minimum supported width: 1024px
- Horizontal scroll for timeline on smaller screens
- Touch-friendly bar manipulation for tablets

### Accessibility
- Keyboard navigation support
- ARIA labels for interactive elements
- Sufficient color contrast
- Focus indicators

## Error Handling

- Display user-friendly error messages
- Retry failed API calls with exponential backoff
- Optimistic UI updates with rollback on failure
- Validate data before sending to API
- Handle network disconnection gracefully

## Project Structure

```
ict-gantt-planner/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── routes/
│   │   │   ├── perspectives.js
│   │   │   ├── initiatives.js
│   │   │   ├── schedules.js
│   │   │   └── gantt.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validateRequest.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   └── [component structure above]
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── docker-compose.yml          - PostgreSQL + pgAdmin
├── README.md
└── .gitignore
```

## Development Instructions

1. **Setup Database**
   - Create docker-compose.yml for PostgreSQL
   - Configure Prisma connection
   - Run migrations and seed data

2. **Build Backend**
   - Initialize Express server with CORS enabled
   - Implement all API endpoints
   - Add request validation
   - Add error handling middleware
   - Test endpoints with sample requests

3. **Build Frontend**
   - Setup Vite + React + Tailwind
   - Implement GanttChart component with all interactions
   - Connect to backend API
   - Add auto-save functionality
   - Implement sidebar panels
   - Add export features

4. **Integration Testing**
   - Test all CRUD operations
   - Test drag/drop/resize interactions
   - Test auto-save and error recovery
   - Test across different screen sizes

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/ict_gantt"
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

## Stretch Goals (Optional Enhancements)

If time permits, consider adding:

1. **Year Selector** - Switch between years (2025, 2026, 2027)
2. **Dependencies** - Draw arrows between related initiatives
3. **Milestones** - Add diamond markers for key dates
4. **Comments** - Add notes/comments to schedules
5. **History** - Undo/redo functionality
6. **Collaboration** - Real-time updates via WebSocket
7. **Reports** - Generate PDF reports with charts
8. **Filters** - Filter by perspective, priority, or scheduled status

---

## Execution Command

Start by creating the project structure, then build the backend with database, and finally the frontend. Ensure the application runs with:

```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd backend && npm install && npx prisma migrate dev && npx prisma db seed && npm run dev

# Terminal 3: Frontend
cd frontend && npm install && npm run dev
```

The application should be accessible at http://localhost:5173 with the API at http://localhost:3001.
