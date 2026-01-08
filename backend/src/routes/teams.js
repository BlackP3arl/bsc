import express from 'express';
import { body, param } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/teams - List all teams
router.get('/', async (req, res, next) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        initiatives: {
          include: {
            initiative: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform to match frontend expectations
    const transformedTeams = teams.map((team) => ({
      ...team,
      initiatives: team.initiatives.map((it) => it.initiative),
    }));

    res.json(transformedTeams);
  } catch (error) {
    next(error);
  }
});

// GET /api/teams/:id - Get single team
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        initiatives: {
          include: {
            initiative: {
              include: {
                perspective: true,
                schedule: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Transform to match frontend expectations
    const transformedTeam = {
      ...team,
      initiatives: team.initiatives.map((it) => it.initiative),
    };

    res.json(transformedTeam);
  } catch (error) {
    next(error);
  }
});

// POST /api/teams - Create new team
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be 1-100 characters'),
    body('color').trim().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex color (e.g., #FF5733)'),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const team = await prisma.team.create({
        data: req.body,
      });

      res.status(201).json(team);
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Team name already exists' });
      }
      next(error);
    }
  }
);

// PUT /api/teams/:id - Update team
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Valid team ID is required'),
    body('name').optional().trim().isLength({ min: 1, max: 100 }),
    body('color').optional().trim().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a valid hex color'),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const team = await prisma.team.update({
        where: { id },
        data: req.body,
      });

      res.json(team);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Team not found' });
      }
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Team name already exists' });
      }
      next(error);
    }
  }
);

// DELETE /api/teams/:id - Delete team
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if team has initiatives
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        initiatives: true,
      },
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    if (team.initiatives.length > 0) {
      return res.status(400).json({ 
        error: `Cannot delete team. It has ${team.initiatives.length} initiative(s) assigned. Please reassign or remove initiatives first.` 
      });
    }

    await prisma.team.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Team not found' });
    }
    next(error);
  }
});

export default router;

