import { serve } from '@hono/node-server'
import { app } from './index.js'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

serve({ fetch: app.fetch, port: PORT })
console.error(`EpicMe MCP Server running on http://localhost:${PORT}`)
