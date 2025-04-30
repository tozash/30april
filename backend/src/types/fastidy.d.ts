import 'fastify'
import type { Auth } from 'firebase-admin/auth'

declare module 'fastify' {
  interface FastifyInstance {
    /** Firebase Admin Auth service */
    firebaseAuth: Auth
  }
}
