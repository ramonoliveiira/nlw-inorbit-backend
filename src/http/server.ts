import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { createGoal } from '../functions/create-goal';
import z from 'zod';

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
}

boostrap();
