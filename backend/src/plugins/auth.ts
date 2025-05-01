import fp from 'fastify-plugin'
import type { FastifyPluginAsync, preHandlerHookHandler } from 'fastify'

const authPlugin: FastifyPluginAsync = async (fastify) => {
  const verify: preHandlerHookHandler = async (request, reply) => {
    const auth = request.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return reply.code(401).send({ message: 'Missing or invalid Authorization header' })
    }
    const idToken = auth.slice(7)
    try {
      // verifyIdToken throws if invalid/expired
      const decoded = await fastify.firebaseAuth.verifyIdToken(idToken)
      request.uid = decoded.uid
    } catch (err) {
      request.log.info('Unauthenticated: invalid Firebase ID token')
      return reply.code(401).send({ message: 'unauthenticated' })
    }
  }

  fastify.decorate('auth', verify)
}

export default fp(authPlugin)
