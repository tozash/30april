import Fastify from 'fastify'
import authRoutes from '../src/routes/auth'
import firebaseAdmin from '../src/plugins/firebaseAdmin'
import axios from 'axios'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

// Mock firebase-admin
vi.mock('firebase-admin', () => ({
  __esModule: true,
  default: {
    initializeApp: vi.fn(),
    auth: () => ({
      verifyIdToken: vi.fn().mockResolvedValue({ uid: 'UID123' }),
      revokeRefreshTokens: vi.fn().mockResolvedValue(undefined),
    }),
  },
}))


describe('Auth endpoints', () => {
  let app: ReturnType<typeof Fastify>

  beforeAll(async () => {
    app = Fastify()
    app.register(firebaseAdmin)
    app.register(authRoutes)
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /auth/register → success', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        idToken: 't1',
        refreshToken: 'r1',
        expiresIn: '3600',
        localId: 'u1'
      }
    })
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email: 'a@b.com', password: 'pass123', confirmPassword: 'pass123' }
    })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({
      idToken: 't1', refreshToken: 'r1',
      expiresIn: '3600', localId: 'u1'
    })
  })

  it('POST /auth/login → invalid creds', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { data: { error: { message: 'INVALID_PASSWORD' } } }
    })
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'a@b.com', password: 'wrong' }
    })
    expect(res.statusCode).toBe(400)
    expect(res.json()).toEqual({ error: 'INVALID_PASSWORD' })
  })

  it('POST /auth/logout → revoked', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      headers: { authorization: 'Bearer valid.token.here' }
    })
    expect(res.statusCode).toBe(204)
  })
})
