import {
	JSON_RPC_ERROR_CODES,
	createJsonRpcError,
	createJsonRpcResponse,
	McpServer,
} from 'mcp-lite'

export type CompletionRef =
	| { type: 'ref/prompt'; name: string }
	| { type: 'ref/resource'; uri: string }
	| { type: 'ref/invocation'; id: string }
	| { type: 'ref/message'; id: string }

export type CompletionArgument = {
	name: string
	value?: unknown
}

export type CompletionParams = {
	ref: CompletionRef
	argument: CompletionArgument
}

export type CompletionResult = string[]

export type CompletionHandler = (
	params: CompletionParams,
) => CompletionResult | undefined | Promise<CompletionResult | undefined>

export function registerCompletionHandlers(
	server: McpServer,
	handlers: CompletionHandler[],
) {
	server.use(async (ctx, next) => {
		if (
			!('method' in ctx.request) ||
			ctx.request.method !== 'completion/complete'
		) {
			await next()
			return
		}

		if (!('id' in ctx.request)) {
			await next()
			return
		}

		const params = ctx.request.params
		if (typeof params !== 'object' || params === null) {
			ctx.response = createJsonRpcError(ctx.request.id, {
				code: JSON_RPC_ERROR_CODES.INVALID_PARAMS,
				message: 'completion/complete requires an object params value',
			})
			return
		}

		const completionParams = params as CompletionParams

		for (const handler of handlers) {
			const values = await handler(completionParams)
			if (values !== undefined) {
				ctx.response = createJsonRpcResponse(ctx.request.id, {
					completion: {
						type: 'list',
						values,
					},
				})
				return
			}
		}

		ctx.response = createJsonRpcError(ctx.request.id, {
			code: JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND,
			message: 'No completion handler registered for request',
		})
	})
}
