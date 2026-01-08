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
            teams: {
              include: {
                team: true,
              },
            },
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

    // Transform teams array to match frontend expectations
    const transformedPerspectives = perspectives.map((perspective) => ({
      ...perspective,
      initiatives: perspective.initiatives.map((initiative) => ({
        ...initiative,
        teams: initiative.teams.map((it) => it.team),
      })),
    }));

    res.json(transformedPerspectives);
  } catch (error) {
    next(error);
  }
});

export default router;


