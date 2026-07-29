import { describe, it, expect, vi } from 'vitest'
import { createDeployQueue } from './queue.mjs'

const tick = () => new Promise((r) => setTimeout(r, 0))
const defer = () => {
  let resolve
  const promise = new Promise((r) => (resolve = r))
  return { promise, resolve }
}

describe('createDeployQueue', () => {
  it('runs an enqueued job', async () => {
    const run = vi.fn().mockResolvedValue(undefined)
    const q = createDeployQueue({ run })
    q.enqueue('a')
    await tick()
    expect(run).toHaveBeenCalledWith('a')
  })

  it('respects the global concurrency cap', async () => {
    const gates = { a: defer(), b: defer(), c: defer() }
    let concurrent = 0
    let peak = 0
    const run = vi.fn(async (id) => {
      concurrent++
      peak = Math.max(peak, concurrent)
      await gates[id].promise
      concurrent--
    })
    const q = createDeployQueue({ concurrency: 2, run })
    q.enqueue('a'); q.enqueue('b'); q.enqueue('c')
    await tick()
    expect(peak).toBe(2) // c waits until a or b frees a slot
    gates.a.resolve(); gates.b.resolve(); gates.c.resolve()
    await tick(); await tick()
  })

  it('never runs the same store concurrently', async () => {
    const gate = defer()
    let sameStoreActive = 0
    let violation = false
    const run = vi.fn(async () => {
      sameStoreActive++
      if (sameStoreActive > 1) violation = true
      await gate.promise
      sameStoreActive--
    })
    const q = createDeployQueue({ concurrency: 5, run })
    q.enqueue('same')
    await tick()
    // A second request while running is not coalesced (nothing pending) — it queues
    // and must wait for the first to finish rather than run alongside it.
    q.enqueue('same')
    await tick()
    expect(violation).toBe(false)
    expect(run).toHaveBeenCalledTimes(1) // second is still waiting
    gate.resolve()
    await tick(); await tick()
    expect(run).toHaveBeenCalledTimes(2)
  })

  it('coalesces duplicate pending requests to one run', async () => {
    const gate = defer()
    const run = vi.fn(async () => { await gate.promise })
    const q = createDeployQueue({ concurrency: 1, run })
    q.enqueue('x') // starts running
    await tick()
    q.enqueue('y') // waits (slot full)
    expect(q.enqueue('y').status).toBe('coalesced') // second 'y' folds into the first
    gate.resolve()
    await tick(); await tick()
    // x once, y once — the duplicate y did not add a third run
    expect(run.mock.calls.map((c) => c[0]).sort()).toEqual(['x', 'y'])
  })
})
