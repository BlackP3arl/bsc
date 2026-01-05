import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import perspectivesRoutes from './routes/perspectives.js';
import initiativesRoutes from './routes/initiatives.js';
import schedulesRoutes from './routes/schedules.js';
import ganttRoutes from './routes/gantt.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/perspectives', perspectivesRoutes);
app.use('/api/initiatives', initiativesRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/gantt-data', ganttRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

