import { FastifyPluginAsync } from 'fastify'
import axios from 'axios'
import 'dotenv/config';

const API_KEY = process.env.FIREBASE_API_KEY!
const BASE_URL = 'https://identitytoolkit.googleapis.com/v1'

interface FirebaseAuthResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

const authRoutes: FastifyPluginAsync = async (app) => {
  // Register
  app.post('/auth/register', async (req, reply) => {
    const { email, password, confirmPassword } = req.body as { email: string; password: string, confirmPassword: string }
    if (password !== confirmPassword) {
      return reply.code(400).send({ error: 'Passwords do not match' });
    }

    try {
      const encodedAPIKey = encodeURIComponent(API_KEY);
      const url = `${BASE_URL}/accounts:signUp?key=${encodedAPIKey}`;
      
      console.log('🔑 Using API_KEY:', JSON.stringify(API_KEY))
      console.log('🌐 Calling Firebase URL:', url)
  
      const { data } = await axios.post<FirebaseAuthResponse>(
        url,
        { email, password, returnSecureToken: true }
      );

      const uid = data.localId;

      await app.db
        .collection('users')
        .doc(uid)
        .set({ day: 0 });

      return reply.send({
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        localId: data.localId
      })
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Registration failed'
      console.error('Registration error:', msg)
      return reply.code(400).send({ error: msg })
    }
  })

  // Login
  app.post('/auth/login', async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string }
    try {
      const response = await axios.post(
        `${BASE_URL}/accounts:signInWithPassword?key=${API_KEY}`,
        { email, password, returnSecureToken: true }
      );
      const data = response.data as FirebaseAuthResponse;

      return reply.send({
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        localId: data.localId
      })
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Login failed'
      return reply.code(400).send({ error: msg })
    }
  })

  // Logout
  app.post(
    '/auth/logout',
    {
      preHandler: async (req, reply) => {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return reply.code(401).send({ error: 'No token' })
        try {
          const decoded = await app.firebaseAuth.verifyIdToken(token)
          await app.firebaseAuth.revokeRefreshTokens(decoded.uid)
        } catch {
          return reply.code(401).send({ error: 'Invalid token' })
        }
      }
    },
    async (_, reply) => {
      reply.code(204).send()
    }
  )
}

export default authRoutes
