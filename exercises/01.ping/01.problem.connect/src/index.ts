// 💰 you're gonna want these imports
// import { Hono } from 'hono'
// import { McpServer, StreamableHttpTransport } from 'mcp-lite'

// 🐨 create and export a new McpServer using mcp-lite
// - it should have a name of 'epicme' and a version of '1.0.0'
// 📜 If you're unsure how to do this, check out the mcp-lite docs:
//   https://github.com/fiberplane/mcp-lite
// 💰 export const server = new McpServer({ name: 'epicme', version: '1.0.0' })

// 🐨 create a new StreamableHttpTransport
// 🐨 bind the transport to the server to get a handler function
// 🐨 export the handler
// 💰 const transport = new StreamableHttpTransport()
// 💰 export const handler = transport.bind(server)

// 🐨 create and export a Hono app
// 💰 export const app = new Hono()

// 🐨 add a route to handle all MCP requests on the '/mcp' path
// 💰 app.all('/mcp', (c) => handler(c.req.raw))
// 📝 Note: c.req.raw gives you the Web API Request object that the handler expects
