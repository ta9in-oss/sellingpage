import { describe, it, expect, vi } from 'vitest'

const { initLogger, createRequestLogger, createError } = vi.hoisted(() => ({
  initLogger: vi.fn(),
  createRequestLogger: vi.fn((fields: Record<string, unknown>) => ({ fields })),
  createError: vi.fn(),
}))
vi.mock('evlog', () => ({ initLogger, createRequestLogger, createError }))

import { event, createError as reExported } from './logger'

describe('logger.event', () => {
  it('initialises evlog once for the platform service and starts a wide event per call', () => {
    const a = event({ op: 'deploy' })
    const b = event()
    expect(initLogger).toHaveBeenCalledTimes(1)
    expect(initLogger.mock.calls[0][0]).toMatchObject({ env: { service: 'platform' } })
    expect(a).toEqual({ fields: { op: 'deploy' } })
    expect(b).toEqual({ fields: {} })
  })

  it('re-exports evlog createError', () => {
    expect(reExported).toBe(createError)
  })
})
