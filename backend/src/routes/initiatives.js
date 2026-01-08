import express from 'express';
import { body, param } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/initiatives - List all initiatives (include perspective data)
router.get('/', async (req, res, next) => {
  try {
    const initiatives = await prisma.initiative.findMany({
      include: {
        perspective: true,
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
    });

    // Transform teams array to match frontend expectations
    const transformedInitiatives = initiatives.map((initiative) => ({
      ...initiative,
      teams: initiative.teams.map((it) => it.team),
    }));

    res.json(transformedInitiatives);
  } catch (error) {
    next(error);
  }
});

// GET /api/initiatives/:id - Get single initiative with schedule
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const initiative = await prisma.initiative.findUnique({
      where: { id },
      include: {
        perspective: true,
        teams: {
          include: {
            team: true,
          },
        },
        schedule: true,
      },
    });

    if (!initiative) {
      return res.status(404).json({ error: 'Initiative not found' });
    }

    // Transform teams array to match frontend expectations
    const transformedInitiative = {
      ...initiative,
      teams: initiative.teams.map((it) => it.team),
    };

    res.json(transformedInitiative);
  } catch (error) {
    next(error);
  }
});

// POST /api/initiatives - Create new initiative
router.post(
  '/',
  [
    body('code').trim().isLength({ min: 1, max: 10 }).withMessage('Code is required and must be 1-10 characters'),
    body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be 1-255 characters'),
    body('perspective_id').isUUID().withMessage('Valid perspective_id is required'),
    body('team_ids').optional().isArray().withMessage('team_ids must be an array'),
    body('team_ids.*').optional().isUUID().withMessage('Each team_id must be a valid UUID'),
    body('description').optional().isString(),
    body('target_kpi').optional().isLength({ max: 100 }),
    body('estimated_effort').optional().isLength({ max: 50 }),
    body('priority').optional().isIn(['high', 'medium', 'low']),
    body('display_order').isInt().withMessage('Display order must be an integer'),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { team_ids = [], ...initiativeData } = req.body;
      
      // Filter out empty/null values and ensure unique
      const validTeamIds = [...new Set(team_ids.filter((id) => id && id !== ''))];

      const initiative = await prisma.initiative.create({
        data: {
          ...initiativeData,
          teams: {
            create: validTeamIds.map((teamId) => ({
              team_id: teamId,
            })),
          },
        },
        include: {
          perspective: true,
          teams: {
            include: {
              team: true,
            },
          },
          schedule: true,
        },
      });

      // Transform teams array to match frontend expectations
      const transformedInitiative = {
        ...initiative,
        teams: initiative.teams.map((it) => it.team),
      };

      res.status(201).json(transformedInitiative);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/initiatives/:id - Update initiative details
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Valid initiative ID is required'),
    body('code').optional().trim().isLength({ min: 1, max: 10 }),
    body('name').optional().trim().isLength({ min: 1, max: 255 }),
    body('description').optional().isString(),
    body('perspective_id').optional().isUUID().withMessage('Valid perspective_id is required'),
    body('team_ids').optional().isArray().withMessage('team_ids must be an array'),
    body('team_ids.*').optional().isUUID().withMessage('Each team_id must be a valid UUID'),
    body('target_kpi').optional().isLength({ max: 100 }),
    body('estimated_effort').optional().isLength({ max: 50 }),
    body('priority').optional().isIn(['high', 'medium', 'low']),
    body('display_order').optional().isInt(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { team_ids, ...initiativeData } = req.body;

      // Filter out empty/null values and ensure unique
      const validTeamIds = team_ids ? [...new Set(team_ids.filter((id) => id && id !== ''))] : undefined;

      // Get current teams to determine what needs to be updated
      const currentInitiative = await prisma.initiative.findUnique({
        where: { id },
        include: {
          teams: true,
        },
      });

      if (!currentInitiative) {
        return res.status(404).json({ error: 'Initiative not found' });
      }

      // Update teams if team_ids is provided
      const updateData = { ...initiativeData };
      if (validTeamIds !== undefined) {
        const currentTeamIds = currentInitiative.teams.map((it) => it.team_id);
        const toConnect = validTeamIds.filter((tid) => !currentTeamIds.includes(tid));
        const toDisconnect = currentTeamIds.filter((tid) => !validTeamIds.includes(tid));

        updateData.teams = {
          deleteMany: toDisconnect.length > 0 ? {
            team_id: { in: toDisconnect },
          } : undefined,
          create: toConnect.map((teamId) => ({
            team_id: teamId,
          })),
        };
      }

      const initiative = await prisma.initiative.update({
        where: { id },
        data: updateData,
        include: {
          perspective: true,
          teams: {
            include: {
              team: true,
            },
          },
          schedule: true,
        },
      });

      // Transform teams array to match frontend expectations
      const transformedInitiative = {
        ...initiative,
        teams: initiative.teams.map((it) => it.team),
      };

      res.json(transformedInitiative);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/initiatives/:id - Delete initiative and its schedule
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.initiative.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// PATCH /api/initiatives/:id/schedule - Upsert schedule (create or update)
router.patch(
  '/:id/schedule',
  [
    param('id').isUUID().withMessage('Valid initiative ID is required'),
    body('year').optional().isInt({ min: 2020, max: 2100 }),
    body('start_month').isInt({ min: 0, max: 11 }).withMessage('Start month must be 0-11'),
    body('end_month').isInt({ min: 0, max: 11 }).withMessage('End month must be 0-11'),
    body('notes').optional().isString(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { year = 2026, start_month, end_month, notes } = req.body;

      if (start_month > end_month) {
        return res.status(400).json({ error: 'Start month must be <= end month' });
      }

      // Check if initiative exists
      const initiative = await prisma.initiative.findUnique({
        where: { id },
      });

      if (!initiative) {
        return res.status(404).json({ error: 'Initiative not found' });
      }

      const schedule = await prisma.schedule.upsert({
        where: { initiative_id: id },
        update: {
          year,
          start_month,
          end_month,
          notes,
        },
        create: {
          initiative_id: id,
          year,
          start_month,
          end_month,
          notes,
        },
      });

      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

