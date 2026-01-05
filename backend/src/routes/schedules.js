import express from 'express';
import { body, param } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/schedules - List all schedules (include initiative data)
router.get('/', async (req, res, next) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        initiative: {
          include: {
            perspective: true,
          },
        },
      },
      orderBy: {
        start_month: 'asc',
      },
    });

    res.json(schedules);
  } catch (error) {
    next(error);
  }
});

// GET /api/schedules/:id - Get single schedule
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        initiative: {
          include: {
            perspective: true,
          },
        },
      },
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    next(error);
  }
});

// POST /api/schedules - Create schedule for an initiative
router.post(
  '/',
  [
    body('initiative_id').isUUID().withMessage('Valid initiative_id is required'),
    body('year').optional().isInt({ min: 2020, max: 2100 }),
    body('start_month').isInt({ min: 0, max: 11 }).withMessage('Start month must be 0-11'),
    body('end_month').isInt({ min: 0, max: 11 }).withMessage('End month must be 0-11'),
    body('notes').optional().isString(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { initiative_id, year = 2026, start_month, end_month, notes } = req.body;

      if (start_month > end_month) {
        return res.status(400).json({ error: 'Start month must be <= end month' });
      }

      const schedule = await prisma.schedule.create({
        data: {
          initiative_id,
          year,
          start_month,
          end_month,
          notes,
        },
        include: {
          initiative: {
            include: {
              perspective: true,
            },
          },
        },
      });

      res.status(201).json(schedule);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/schedules/:id - Update schedule (start_month, end_month)
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Valid schedule ID is required'),
    body('year').optional().isInt({ min: 2020, max: 2100 }),
    body('start_month').optional().isInt({ min: 0, max: 11 }),
    body('end_month').optional().isInt({ min: 0, max: 11 }),
    body('notes').optional().isString(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { start_month, end_month, year, notes } = req.body;

      if (start_month !== undefined && end_month !== undefined && start_month > end_month) {
        return res.status(400).json({ error: 'Start month must be <= end month' });
      }

      const schedule = await prisma.schedule.update({
        where: { id },
        data: {
          ...(year !== undefined && { year }),
          ...(start_month !== undefined && { start_month }),
          ...(end_month !== undefined && { end_month }),
          ...(notes !== undefined && { notes }),
        },
        include: {
          initiative: {
            include: {
              perspective: true,
            },
          },
        },
      });

      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/schedules/:id - Delete schedule
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.schedule.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
    }
});

// PUT /api/schedules/bulk - Bulk update multiple schedules
router.put(
  '/bulk',
  [
    body('schedules').isArray().withMessage('Schedules must be an array'),
    body('schedules.*.id').isUUID().withMessage('Each schedule must have a valid ID'),
    body('schedules.*.start_month').optional().isInt({ min: 0, max: 11 }),
    body('schedules.*.end_month').optional().isInt({ min: 0, max: 11 }),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { schedules } = req.body;

      // Validate all schedules first
      for (const schedule of schedules) {
        if (schedule.start_month !== undefined && schedule.end_month !== undefined) {
          if (schedule.start_month > schedule.end_month) {
            return res.status(400).json({
              error: `Schedule ${schedule.id}: Start month must be <= end month`,
            });
          }
        }
      }

      // Update all schedules
      const updatePromises = schedules.map((schedule) =>
        prisma.schedule.update({
          where: { id: schedule.id },
          data: {
            ...(schedule.start_month !== undefined && { start_month: schedule.start_month }),
            ...(schedule.end_month !== undefined && { end_month: schedule.end_month }),
            ...(schedule.year !== undefined && { year: schedule.year }),
            ...(schedule.notes !== undefined && { notes: schedule.notes }),
          },
        })
      );

      const updatedSchedules = await Promise.all(updatePromises);

      res.json(updatedSchedules);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

