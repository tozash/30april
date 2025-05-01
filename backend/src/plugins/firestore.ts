import fp from 'fastify-plugin'
import admin from 'firebase-admin'
import type { FastifyPluginAsync } from 'fastify'
import type { Firestore } from 'firebase-admin/firestore'

// Note: admin.initializeApp() already called in firebaseAdminPlugin
const firestorePlugin: FastifyPluginAsync = async (fastify) => {
  const db: Firestore = admin.firestore()
  fastify.decorate('db', db)
}

export default fp(firestorePlugin)
