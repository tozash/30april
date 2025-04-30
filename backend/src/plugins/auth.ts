import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate(
    'auth',
    async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch {
        request.log.info('Unauthenticated');
        
        reply.code(401).send({ message: 'unauthenticated' });
      }
    }
  );
};

export default fp(authPlugin);
