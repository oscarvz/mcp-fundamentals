import { test, expect } from 'vitest'
import { setupTestClient } from '@exercises/shared/test-utils'
import { server, handler } from './index.js'

test('Ping', async () => {
	await using setup = await setupTestClient(server, handler)
	const { client } = setup

	const result = await client.ping()
	expect(result).toEqual({})
})
