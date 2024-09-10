import fastify from 'fastify';

const app = fastify();

async function boostrap() {
  await app.listen({
    port: 3333,
  });
  console.log('HTTP server running!');
}

boostrap();
