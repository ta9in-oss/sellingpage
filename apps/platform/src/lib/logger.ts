/**
 * evlog wide-event logging for platform server functions.
 *
 * Server functions aren't route handlers, so instead of the Nitro middleware we
 * use evlog standalone: one `event()` per operation, `.set()` for context,
 * `.audit()` for security-sensitive actions (credential/billing/deploy), and a
 * manual `.emit()`. `createError()` gives self-documenting structured errors.
 */
import { initLogger, createRequestLogger, createError } from 'evlog'

let inited = false
function ensure() {
  if (inited) return
  initLogger({ env: { service: 'platform', environment: process.env.NODE_ENV || 'production' } })
  inited = true
}

/** Start a wide event for one server-function invocation. Call `.emit()` when done. */
export function event(fields?: Record<string, unknown>) {
  ensure()
  return createRequestLogger(fields ?? {})
}

export { createError }
