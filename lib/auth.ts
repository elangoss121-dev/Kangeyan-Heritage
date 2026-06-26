import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getUserById } from './users'
import type { User } from './types'

const FALLBACK = "dev-only-insecure-secret";

export function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!secret || secret === FALLBACK) {
      throw new Error(
        "[auth] JWT_SECRET is missing or set to the dev fallback in production. " +
        "Set a strong secret in your environment variables."
      );
    }
    if (secret === process.env.NEXTAUTH_SECRET) {
      throw new Error(
        "[auth] JWT_SECRET and NEXTAUTH_SECRET must be different values."
      );
    }
  }
  return secret ?? FALLBACK;
}

export const JWT_SECRET = resolveJwtSecret();
const COOKIE_NAME = 'kh_session'

export interface TokenPayload {
  userId: string
  email: string
  role: 'customer' | 'admin'
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

/**
 * Server-side helper to retrieve the currently logged in user based on the cookie session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)
    if (!sessionCookie?.value) return null

    const payload = verifyToken(sessionCookie.value)
    if (!payload?.userId) return null

    return await getUserById(payload.userId)
  } catch (err) {
    console.log('[v0] getCurrentUser error:', (err as Error).message)
    return null
  }
}

/**
 * Server-side helper to set the session cookie
 */
export async function setSessionCookie(payload: TokenPayload): Promise<void> {
  const token = signToken(payload)
  const cookieStore = await cookies()
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

/**
 * Server-side helper to clear the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
