import fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createCompletionRoute } from './routes/create-completion';
import { createGoalRoute } from './routes/create-goal';
import { getPendingGoalsRoute } from './routes/get-pending-goals';

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
  app.register(createGoalRoute);
  app.register(createCompletionRoute);
  app.register(getPendingGoalsRoute);
}

boostrap();
