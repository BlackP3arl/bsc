import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import perspectivesRoutes from './routes/perspectives.js';
import initiativesRoutes from './routes/initiatives.js';
import schedulesRoutes from './routes/schedules.js';
import ganttRoutes from './routes/gantt.js';
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from React app in production
if (isProduction) {
  const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendBuildPath));
  
  // Serve React app for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (isProduction) {
    console.log(`Serving frontend from ${path.join(__dirname, '../../frontend/dist')}`);
  }
});

