import { createRequestHandler } from '@remix-run/express'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? null
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      )

const app = express()
const port = 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/assets')))
app.use('/styles/govuk-frontend.min.css', express.static(path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css')))
app.use('/styles/govuk-frontend.min.css.map', express.static(path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.css.map')))
app.use('/scripts/govuk-frontend.min.js', express.static(path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js')))
app.use('/scripts/govuk-frontend.min.js.map', express.static(path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js.map')))

app.use(viteDevServer ? viteDevServer.middlewares : express.static('build/client'))

const build = viteDevServer ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build') : await import('./build/server/index.js')

app.all('*', createRequestHandler({ build }))

app.listen(port, () => {
  console.log(`listening on ${port}`)
})
