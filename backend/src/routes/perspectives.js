import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/perspectives - List all perspectives with their initiatives
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

// GET /api/perspectives/:id - Get single perspective with initiatives
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const perspective = await prisma.perspective.findUnique({
      where: { id },
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
    });

    if (!perspective) {
      return res.status(404).json({ error: 'Perspective not found' });
    }

    res.json(perspective);
  } catch (error) {
    next(error);
  }
});

export default router;

