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
      payload: { email: 'aafdasaf@b.com', password: 'pass123', confirmPassword: 'pass123' }
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

/* ------------------------------------------------------------------
   Extra auth scenarios (negative & edge cases)
------------------------------------------------------------------- */

describe('Auth routes – negative & edge cases', () => {
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
  const makeEmail = (tag: string) =>
    `user_${tag}_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;

  const password = 'Secret123!';

  it('rejects registration when passwords do not match', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: makeEmail('mismatch'),
        password,
        confirmPassword: 'DifferentPass!'
      }
    });
    expect(res.statusCode).toBe(400);          // validation error
  });

  it('rejects registration if email already exists', async () => {
    const email = makeEmail('dup');

    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email, password, confirmPassword: password }
    });

    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email, password, confirmPassword: password }
    });
    expect(res.statusCode).toBe(400);          // duplicate-email conflict
  });

  it('rejects login with wrong password', async () => {
    const email = makeEmail('wrongpass');

    await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email, password, confirmPassword: password }
    });

    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email, password: 'WrongPass!' }
    });
    expect(res.statusCode).toBe(400);          // unauthorised
  });

  it('rejects login for unknown email', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: makeEmail('unknown'), password }
    });
    expect(res.statusCode).toBe(400);          // user not found
  });

  it('rejects logout when no Bearer token provided', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/logout'
    });
    expect([401, 403]).toContain(res.statusCode);
  });
});
