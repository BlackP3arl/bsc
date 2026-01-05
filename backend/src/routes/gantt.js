import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/gantt-data - Get all data needed for Gantt chart
router.get('/', async (req, res, next) => {
  try {
    const perspectives = await prisma.perspective.findMany({
      include: {
        initiatives: {
          include: {
            schedule: true,
          },
          orderBy: {
            display_order: 'asc',
          },
        },
      },
      orderBy: {
        display_order: 'asc',
      },
    });

    res.json(perspectives);
  } catch (error) {
    next(error);
  }
});

export default router;

