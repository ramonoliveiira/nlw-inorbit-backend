import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { createGoal } from '../../functions/create-goal';

export const createGoalRoute: FastifyPluginAsyncZod = async (app, _opts) => {
  app.post(
    '/goals',
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
      },
    },
    async req => {
      const { title, desiredWeeklyFrequency } = req.body;

      await createGoal({
        title,
        desiredWeeklyFrequency,
      });
    }
  );
};