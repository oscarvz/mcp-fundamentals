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

	try {
		expect(firstTool).toEqual(
			expect.objectContaining({
				name: expect.stringMatching(/^add$/i),
				description: expect.stringMatching(/^add two numbers$/i),
				inputSchema: expect.objectContaining({
					type: 'object',
					properties: expect.objectContaining({
						firstNumber: expect.objectContaining({
							type: 'number',
							description: expect.stringMatching(/first/i),
						}),
						secondNumber: expect.objectContaining({
							type: 'number',
							description: expect.stringMatching(/second/i),
						}),
					}),
					required: expect.arrayContaining(['firstNumber', 'secondNumber']),
				}),
			}),
		)
	} catch (error: any) {
		console.error('🚨 Tool schema mismatch!')
		console.error(
			'🚨 This exercise requires updating the "add" tool to accept dynamic arguments',
		)
		console.error('🚨 Current tool schema:', JSON.stringify(firstTool, null, 2))
		console.error(
			'🚨 You need to: 1) Add proper inputSchema with firstNumber and secondNumber parameters',
		)
		console.error('🚨 2) Update the tool description to "add two numbers"')
		console.error(
			'🚨 3) Make the tool calculate firstNumber + secondNumber instead of hardcoding 1 + 2',
		)
		const enhancedError = new Error(
			'🚨 Tool schema update required. Add firstNumber and secondNumber parameters to the "add" tool. ' +
				(error.message || error),
		)
		enhancedError.stack = error.stack
		throw enhancedError
	}

	// 🚨 Proactive check: Ensure the tool schema includes both required arguments
	invariant(
		firstTool.inputSchema?.properties?.firstNumber,
		'🚨 Tool must have firstNumber parameter defined',
	)
	invariant(
		firstTool.inputSchema?.properties?.secondNumber,
		'🚨 Tool must have secondNumber parameter defined',
	)
})

test('Tool Call', async () => {
	await using setup = await setupTestClient(server, handler)
	const { client } = setup
	const result = await client.callTool({
		name: 'add',
		arguments: {
			firstNumber: 1,
			secondNumber: 2,
		},
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

test('Tool Call with Different Numbers', async () => {
	await using setup = await setupTestClient(server, handler)
	const { client } = setup
	try {
		const result = await client.callTool({
			name: 'add',
			arguments: {
				firstNumber: 5,
				secondNumber: 7,
			},
		})

		expect(result).toEqual(
			expect.objectContaining({
				content: expect.arrayContaining([
					expect.objectContaining({
						type: 'text',
						text: expect.stringMatching(/12/),
					}),
				]),
			}),
		)
	} catch (error: any) {
		console.error('🚨 Tool call with different numbers failed!')
		console.error('🚨 This suggests the tool implementation is still hardcoded')
		console.error(
			'🚨 The tool should calculate firstNumber + secondNumber = 5 + 7 = 12',
		)
		console.error('🚨 But it\'s probably still returning hardcoded "1 + 2 = 3"')
		console.error(
			'🚨 Update the tool implementation to use the dynamic arguments from the input schema',
		)
		const enhancedError = new Error(
			'🚨 Dynamic tool calculation required. Tool should calculate arguments, not return hardcoded values. ' +
				(error.message || error),
		)
		enhancedError.stack = error.stack
		throw enhancedError
	}
})
