import { invariant } from '@epic-web/invariant'
import { test, expect } from 'vitest'
import { setupTestClient } from '@exercises/shared/test-utils'
import { server, handler } from './index.js'

test('Tool Definition', async () => {
	await using setup = await setupTestClient(server, handler)
	const { client } = setup

	const list = await client.listTools()
	const [firstTool] = list.tools
	invariant(firstTool, '🚨 No tools found')

	expect(firstTool).toEqual(
		expect.objectContaining({
			name: expect.stringMatching(/^add$/i),
			description: expect.stringMatching(/add/i),
			inputSchema: expect.objectContaining({
				type: 'object',
			}),
		}),
	)
})

test('Tool Call', async () => {
	await using setup = await setupTestClient(server, handler)
	const { client } = setup

	const result = await client.callTool({
		name: 'add',
		arguments: {},
	})

	expect(result).toEqual(
		expect.objectContaining({
			content: expect.arrayContaining([
				expect.objectContaining({
					type: 'text',
					text: expect.stringMatching(/3/),
				}),
			]),
		}),
	)
})
