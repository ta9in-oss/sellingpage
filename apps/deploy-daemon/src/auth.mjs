import { timingSafeEqual } from 'node:crypto'

/**
 * Constant-time bearer-token check for the deploy webhook. The platform sends
 * `Authorization: Bearer <DEPLOY_SHARED_SECRET>`; only that shared secret may
 * trigger a deploy. Uses timingSafeEqual to avoid leaking the secret through
 * response-time differences.
 */
export function isAuthorized(authHeader, secret) {
  if (!secret) return false // never authorize when no secret is configured
  if (typeof authHeader !== 'string') return false
  const prefix = 'Bearer '
  if (!authHeader.startsWith(prefix)) return false
  const provided = Buffer.from(authHeader.slice(prefix.length))
  const expected = Buffer.from(secret)
  if (provided.length !== expected.length) return false
  return timingSafeEqual(provided, expected)
}
