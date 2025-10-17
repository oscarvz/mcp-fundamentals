import { Hono } from 'hono'
import { McpServer, StreamableHttpTransport } from 'mcp-lite'

// Create the MCP server using mcp-lite
export const server = new McpServer({
	name: 'epicme',
	version: '1.0.0',
})

// Create the HTTP transport and bind it to the server
const transport = new StreamableHttpTransport()
export const handler = transport.bind(server)

// Create Hono app
const app = new Hono()
app.all('/mcp', (c) => handler(c.req.raw))

export { app }
