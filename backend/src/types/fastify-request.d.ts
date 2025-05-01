import 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        /** Set by your Firebase‐verify preHandler */
        uid: string
    }
}
