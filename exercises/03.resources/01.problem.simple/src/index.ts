import { Hono } from 'hono'
import { McpServer, StreamableHttpTransport } from 'mcp-lite'
import type { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { DB } from './db/index.ts'
// 💰 bring in initializeResources from the new ./resources.ts file
// import { initializeResources } from './resources.ts'
import { initializeTools } from './tools.ts'

export class EpicMeMCP {
	db: DB
	server = new McpServer({
		name: 'epicme',
		version: '1.0.0',
		schemaAdapter: (schema) => zodToJsonSchema(schema as z.ZodType),
	})

	constructor(path: string) {
		this.db = DB.getInstance(path)
	}
	async init() {
		await initializeTools(this)
		// 🐨 add initializeResources to the init method
	}

	getHandler() {
		const transport = new StreamableHttpTransport()
		return transport.bind(this.server)
	}
}

// Export a default instance for testing
export const defaultAgent = new EpicMeMCP(
	process.env.EPIC_ME_DB_PATH ?? './db.sqlite',
)
await defaultAgent.init()

export const server = defaultAgent.server
export const handler = defaultAgent.getHandler()

// Create Hono app
const app = new Hono()
app.all('/mcp', (c) => handler(c.req.raw))

export { app }
