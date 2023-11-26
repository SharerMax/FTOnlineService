import process from 'node:process'
import Koa from 'koa'
import Router from '@koa/router'
import fetch from 'node-fetch'
import cors from '@koa/cors'
import Debug from 'debug'
import TTLCache from '@isaacs/ttlcache'

const logger = Debug('ft-online-service')
const listenPort = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'
const app = new Koa()
const router = new Router()
const proxyCache = new TTLCache({ max: 100, ttl: 10 * 60 * 1000 })
router.get('/', ctx => ctx.body = 'Hello World!')
router.get('/api/proxy', async (ctx) => {
  const proxyUrl = ctx.request.query.url
  if (!proxyUrl) {
    ctx.status = 400
    ctx.body = 'url is required'
    return
  }
  logger(proxyUrl)
  let result = null
  if (proxyCache.has(proxyUrl)) {
    logger('hit cache:', proxyUrl)
    result = proxyCache.get(proxyUrl)
  }
  else {
    const response = await fetch(proxyUrl)
    result = {
      body: await response.json(),
      headers: response.headers,
    }
    proxyCache.set(proxyUrl, result)
  }
  ctx.body = result.body
  ctx.set('Content-Type', result.headers.get('Content-Type'))
  ctx.set('Content-Length', result.headers.get('Content-Length'))
})
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(listenPort, host)
