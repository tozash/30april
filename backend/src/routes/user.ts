import { FastifyPluginAsync } from 'fastify'

const userRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    '/user/next-day',
    { preHandler: app.auth },
    async (req, reply) => {
      const uid = req.uid!
      const userRef = app.db.collection('users').doc(uid)
      const snap = await userRef.get()
      if (!snap.exists) {
        return reply.code(404).send({ message: 'User not found' })
      }
      const currentDay = (snap.data()!.day as number) || 0
      const newDay = currentDay + 1
      await userRef.update({ day: newDay })
      return reply.send({ day: newDay })
    }
  )
}

export default userRoutes
