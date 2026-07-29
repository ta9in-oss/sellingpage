import { createServer } from 'node:http'
import { isAuthorized } from './auth.mjs'
import { createDeployQueue } from './queue.mjs'
import { runDeploy } from './runDeploy.mjs'

const PORT = Number(process.env.PORT ?? 8787)
const SECRET = process.env.DEPLOY_SHARED_SECRET
// Must stay 1: the daemon reuses one working tree and generateStoreConfig writes
// shared files under apps/store/src/config. Parallel builds would clobber each
// other. Raising this requires an isolated checkout/worktree per job.
const CONCURRENCY = Number(process.env.DEPLOY_CONCURRENCY ?? 1)

// Fail closed: refuse to start without the pieces needed to authenticate and deploy.
const required = ['DEPLOY_SHARED_SECRET', 'VITE_INSTANT_APP_ID', 'PLATFORM_INSTANTDB_ADMIN_TOKEN']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error(`deploy-daemon: refusing to start, missing env: ${missing.join(', ')}`)
  process.exit(1)
}
if (!process.env.STORE_SECRET_KEY) {
  console.warn('deploy-daemon: STORE_SECRET_KEY not set — stores with encrypted secrets will fail to deploy')
}
if (CONCURRENCY !== 1) {
  console.warn(`deploy-daemon: DEPLOY_CONCURRENCY=${CONCURRENCY} (>1) risks clobbering shared config files`)
}

const queue = createDeployQueue({ concurrency: CONCURRENCY, run: (id) => runDeploy(id) })

const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, ...queue.stats() }))
    return
  }

  if (req.method === 'POST' && req.url === '/deploy') {
    if (!isAuthorized(req.headers['authorization'], SECRET)) {
      res.writeHead(401, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ error: 'unauthorized' }))
      return
    }
    let body = ''
    req.on('data', (c) => {
      body += c
      if (body.length > 1_000_000) req.destroy() // cap payload
    })
    req.on('end', () => {
      let storeId
      try { storeId = JSON.parse(body).storeId } catch { storeId = null }
      if (!storeId || typeof storeId !== 'string') {
        res.writeHead(400, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: 'storeId (string) required' }))
        return
      }
      const result = queue.enqueue(storeId)
      console.log(`[${storeId}] enqueue → ${result.status}`)
      res.writeHead(202, { 'content-type': 'application/json' })
      res.end(JSON.stringify(result))
    })
    return
  }

  res.writeHead(404, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`deploy-daemon listening on 127.0.0.1:${PORT} (concurrency=${CONCURRENCY})`)
})
