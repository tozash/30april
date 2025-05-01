import 'dotenv/config'
import Fastify from 'fastify'

import firebaseAdmin      from './plugins/firebaseAdmin'
import firestorePlugin    from './plugins/firestore'
import authPlugin         from './plugins/auth'
import authRoutes         from './routes/auth'
import flashcardRoutes    from './routes/flashcards'
import userRoutes         from './routes/user'

const app = Fastify({ logger: true })

app.register(firebaseAdmin)
app.register(firestorePlugin)
app.register(authPlugin)

app.register(authRoutes)
app.register(flashcardRoutes)
app.register(userRoutes)

app.get('/health', () => ({ ok: true }))

app.listen({ port: 3000, host: '0.0.0.0' })
  .catch((err) => { app.log.error(err); process.exit(1) })
