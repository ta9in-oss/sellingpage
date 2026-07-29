/**
 * Deploy queue for the bubble build box (2 vCPU). Mirrors the concurrency policy
 * of .github/workflows/deploy-store.yml:
 *   - global concurrency cap (a vite build is CPU-heavy; default 1)
 *   - never two concurrent runs for the SAME store
 *   - re-publishing a store while it is queued/running coalesces to a single
 *     pending run, which then reads the latest DB state — same intent as the
 *     workflow's `cancel-in-progress: false` per-store group.
 */
export function createDeployQueue({ concurrency = 1, run }) {
  if (typeof run !== 'function') throw new Error('run must be a function')
  const pending = [] // storeIds waiting to start
  const pendingSet = new Set() // dedupe of `pending`
  const running = new Set() // storeIds currently running
  let active = 0

  function enqueue(storeId) {
    if (!storeId) throw new Error('storeId is required')
    // Already waiting → the single wait will pick up the latest state. Coalesce.
    if (pendingSet.has(storeId)) return { status: 'coalesced' }
    pending.push(storeId)
    pendingSet.add(storeId)
    pump()
    return { status: 'queued' }
  }

  function pump() {
    while (active < concurrency && pending.length) {
      // Skip a waiting store that is already running; take the next eligible one.
      const idx = pending.findIndex((id) => !running.has(id))
      if (idx === -1) break
      const storeId = pending.splice(idx, 1)[0]
      pendingSet.delete(storeId)
      running.add(storeId)
      active++
      Promise.resolve()
        .then(() => run(storeId))
        .catch(() => {}) // run() is responsible for its own failure reporting
        .finally(() => {
          running.delete(storeId)
          active--
          pump()
        })
    }
  }

  return {
    enqueue,
    stats: () => ({ pending: pending.length, running: running.size, active }),
  }
}
