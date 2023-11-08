import Koa from 'koa'
import Router from '@koa/router'
import fetch from 'node-fetch'
import cors from '@koa/cors'
import Debug from 'debug'

const logger = Debug('ft-online-service')

const app = new Koa()
const router = new Router()
router.get('/', ctx => ctx.body = 'Hello World!')
router.get('/api/proxy', async (ctx) => {
  const proxyUrl = ctx.request.query.url
  if (!proxyUrl) {
    ctx.status = 400
    ctx.body = 'url is required'
    return
  }
  logger(proxyUrl)
  const response = await fetch(proxyUrl)
  ctx.body = await response.json()
  ctx.set('Content-Type', response.headers.get('Content-Type'))
  ctx.set('Content-Length', response.headers.get('Content-Length'))
})
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3001)
