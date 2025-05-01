import 'fastify'
import type { Firestore } from 'firebase-admin/firestore'

declare module 'fastify' {
  interface FastifyInstance {
    /** Firestore client, vended by plugins/firestore.ts */
    db: Firestore
  }
}
