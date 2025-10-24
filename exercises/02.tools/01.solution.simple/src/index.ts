import { Hono } from 'hono'
import { McpServer, StreamableHttpTransport } from 'mcp-lite'
import type { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Create the MCP server using mcp-lite
export const server = new McpServer({
	name: 'epicme',
	version: '1.0.0',
	schemaAdapter: (schema) => zodToJsonSchema(schema as z.ZodType),
})

server.tool('add', {
	description: 'Add one and two',
	handler: () => ({
		content: [
			{
				type: 'text',
				text: `The sum of 1 and 2 is 3.`,
			},
		],
	}),
})

// Create the HTTP transport and bind it to the server
const transport = new StreamableHttpTransport()
export const handler = transport.bind(server)

// Create Hono app
const app = new Hono()
app.all('/mcp', (c) => handler(c.req.raw))

export { app }
