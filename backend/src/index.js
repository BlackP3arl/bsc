import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import perspectivesRoutes from './routes/perspectives.js';
import initiativesRoutes from './routes/initiatives.js';
import schedulesRoutes from './routes/schedules.js';
import ganttRoutes from './routes/gantt.js';
import teamsRoutes from './routes/teams.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/perspectives', perspectivesRoutes);
app.use('/api/initiatives', initiativesRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/gantt-data', ganttRoutes);
app.use('/api/teams', teamsRoutes);

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from React app in production
if (isProduction) {
  // Try multiple possible paths for frontend build
  const possiblePaths = [
    path.join(__dirname, '../../frontend/dist'),
    path.join(process.cwd(), 'frontend/dist'),
    path.join(process.cwd(), '../frontend/dist'),
  ];
  
  let frontendBuildPath = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      frontendBuildPath = possiblePath;
      break;
    }
  }
  
  if (frontendBuildPath) {
    console.log(`Using frontend path: ${frontendBuildPath}`);
    app.use(express.static(frontendBuildPath));
    
    // Serve React app for all non-API routes
    app.get('*', (req, res, next) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(500).send('Error loading application');
        }
      });
    });
  } else {
    console.warn('Frontend build not found. API-only mode.');
  }
}

// Error handling middleware
app.use(errorHandler);

// Bind to 0.0.0.0 to be accessible from outside the container
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Working directory: ${process.cwd()}`);
});

