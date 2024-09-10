import fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import z from 'zod';
import { createGoal } from '../functions/create-goal';
import { createGoalCompletion } from '../functions/create-goal-completion';
import { getWeekPendingGoals } from '../functions/get-week-pending-goals';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

async function boostrap() {
  registerRoutes();
  await app.listen({
    port: 3333,
  });
  console.log('HTTP server running!');
}

function registerRoutes() {
  app.get('/pending-goals', async () => {
    const { pendingGoals } = await getWeekPendingGoals();

    return { pendingGoals };
  });

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

  app.post(
    '/completions',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async req => {
      const { goalId } = req.body;

      const result = await createGoalCompletion({
        goalId,
      });

      return result;
    }
  );
}

boostrap();
