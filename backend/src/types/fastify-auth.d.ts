import 'fastify';
import { preHandlerHookHandler } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    /** Verify JWT, 401 on failure */
    auth: preHandlerHookHandler;
  }
}
