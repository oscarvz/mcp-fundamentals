import type { McpServer } from 'mcp-lite'

export type CompletionRef =
	| { type: 'ref/prompt'; name: string }
	| { type: 'ref/invocation'; id: string }
	| { type: 'ref/message'; id: string }

export type CompletionParams = {
	ref: CompletionRef
	argument: { name: string; value?: unknown }
}

export type ClientCapabilities = {
	tools?: Record<string, unknown>
	resources?: Record<string, unknown>
	prompts?: Record<string, unknown>
	completion?: Record<string, unknown>
}

/**
 * Create a test client for in-process MCP testing
 * This allows us to test MCP servers without spawning processes or starting HTTP servers
 */
export function createTestClient(
	server: McpServer,
	handler: (request: Request) => Promise<Response>,
) {
	let requestId = 0
	const baseUrl = 'http://localhost/mcp'

	async function sendRequest(method: string, params?: unknown) {
		const id = ++requestId
		const request = new Request(baseUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id,
				method,
				params,
			}),
		})

		const response = await handler(request)
		const body = await response.json()

		if ('error' in body) {
			const error = new Error(body.error.message)
			Object.assign(error, { code: body.error.code, data: body.error.data })
			throw error
		}

		return body.result
	}

	return {
		async ping() {
			return await sendRequest('ping')
		},

		async initialize(params: {
			protocolVersion: string
			clientInfo: { name: string; version: string }
			capabilities: ClientCapabilities
		}) {
			return await sendRequest('initialize', params)
		},

		async listTools() {
			return await sendRequest('tools/list')
		},

		async callTool(params: { name: string; arguments?: unknown }) {
			return await sendRequest('tools/call', params)
		},

		async listResources() {
			return await sendRequest('resources/list')
		},

		async readResource(params: { uri: string }) {
			return await sendRequest('resources/read', params)
		},

		async listResourceTemplates() {
			return await sendRequest('resources/templates/list')
		},

		async listPrompts() {
			return await sendRequest('prompts/list')
		},

		async getPrompt(params: { name: string; arguments?: unknown }) {
			return await sendRequest('prompts/get', params)
		},

		async complete(params: CompletionParams) {
			return await sendRequest('completion/complete', params)
		},

		async completePrompt(params: CompletionParams) {
			return await sendRequest('completion/complete', params)
		},

		async close() {
			// No-op for in-process testing
		},
	}
}

/**
 * Helper to create a test setup with auto-cleanup
 */
export async function setupTestClient(
	server: McpServer,
	handler: (request: Request) => Promise<Response>,
	capabilities: ClientCapabilities = {},
) {
	const client = createTestClient(server, handler)

	// Initialize the client
	await client.initialize({
		protocolVersion: '2024-11-05',
		clientInfo: { name: 'test-client', version: '1.0.0' },
		capabilities,
	})

	return {
		client,
		async [Symbol.asyncDispose]() {
			await client.close()
		},
	}
}
