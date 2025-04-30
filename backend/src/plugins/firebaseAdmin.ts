import fp from 'fastify-plugin'
import admin from 'firebase-admin'
import type { Auth } from 'firebase-admin/auth'
import type { FastifyPluginAsync } from 'fastify'

// initialize once from GOOGLE_APPLICATION_CREDENTIALS
admin.initializeApp()

const firebaseAdminPlugin: FastifyPluginAsync = async (fastify) => {
    // get the Auth service
    const auth: Auth = admin.auth()
    // decorate the Fastify instance with the Auth object
    fastify.decorate('firebaseAuth', auth)
}

export default fp(firebaseAdminPlugin)
