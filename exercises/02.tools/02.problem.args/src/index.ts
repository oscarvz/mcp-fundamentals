import { Hono } from 'hono'
import { McpServer, StreamableHttpTransport } from 'mcp-lite'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Create the MCP server using mcp-lite
export const server = new McpServer({
	name: 'epicme',
	version: '1.0.0',
	schemaAdapter: (schema) => zodToJsonSchema(schema as z.ZodType),
})

server.tool('add', {
	// 🐨 update the description to indicate this adds any two numbers
	description: 'Add one and two',
	// 🐨 add an inputSchema with a firstNumber and secondNumber property
	// 📜 These should be zod schemas https://zod.dev/
	// 💯 add descriptions for the llm to know what they're for
	// 💰 inputSchema: z.object({
	// 💰   firstNumber: z.number().describe('The first number to add'),
	// 💰   secondNumber: z.number().describe('The second number to add'),
	// 💰 }),
	// 🐨 accept an object parameter with a firstNumber and secondNumber property
	handler: () => {
		return {
			content: [
				{
					type: 'text',
					// 🐨 use the firstNumber and secondNumber properties to return the sum
					text: `The sum of 1 and 2 is 3.`,
				},
			],
		}
	},
})

// Create the HTTP transport and bind it to the server
const transport = new StreamableHttpTransport()
export const handler = transport.bind(server)

// Create Hono app
const app = new Hono()
app.all('/mcp', (c) => handler(c.req.raw))

export { app }
