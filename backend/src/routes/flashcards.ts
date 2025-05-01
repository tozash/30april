// src/routes/flashcards.ts
import { FastifyPluginAsync } from 'fastify'
import type { FlashcardBase, Flashcard } from '../data'

const fetchFlashcardsForDay = async (user: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>, day: number) => {
    // 1) decide which buckets to fetch
    const dueBuckets = Array.from({ length: 5 }, (_, i) => i + 1)
        .filter((b) => day % (2 ** (b - 1)) === 0)

    // 2) fetch all cards from those bucket subcollections
    const snaps = await Promise.all(
        dueBuckets.map((b) =>
        user
            .collection(String(b))
            .get()
        )
    )

    return snaps;
}

const flashcardRoutes: FastifyPluginAsync = async (app) => {
  // ─── GET /flashcards/today ─────────────────────────────────────
  app.get(
    '/flashcards/today',
    { preHandler: app.auth },
    async (req, reply) => {
      const uid = req.uid!;
      const user = app.db.collection('users').doc(uid)
      const userSnap = await user.get()
      if (!userSnap.exists) {
        return reply.code(404).send({ message: 'User not found' })
      }

      const currentDay = (userSnap.data()!.day as number) || 0

      const flashcardDocuments = await fetchFlashcardsForDay(user, currentDay)

      // 4) flatten and return
      const cards: Flashcard[] = flashcardDocuments.flatMap((snap) =>
        snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as FlashcardBase) }))
      )

      return reply.send(cards)
    }
  )

  // ─── POST /flashcards ────────────────────────────────────────────
  // Always add new cards into bucket “1”
  app.post<{ Body: FlashcardBase }>(
    '/flashcards',
    { preHandler: app.auth },
    async (req, reply) => {
      const uid = req.uid!
      const { front, back, hint, tags } = req.body

      const bucket1Ref = app.db
        .collection('users')
        .doc(uid)
        .collection('1')

      const docRef = await bucket1Ref.add({ front, back, hint, tags })
      return reply.code(201).send({ id: docRef.id, front, back, hint, tags })
    }
  )
}

export default flashcardRoutes
