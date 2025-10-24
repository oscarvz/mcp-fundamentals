import { invariant } from '@epic-web/invariant'
import { type EpicMeMCP } from './index.ts'

export async function initializeResources(agent: EpicMeMCP) {
	agent.server.resource(
		'epicme://tags',
		{
			description: 'All tags currently in the database',
		},
		async (uri) => {
			const tags = await agent.db.getTags()
			return {
				contents: [
					{
						mimeType: 'application/json',
						text: JSON.stringify(tags),
						uri: uri.href,
					},
				],
			}
		},
	)

	// 🐨 implement a resource for individual tags with URI template 'epicme://tags/{id}'
	// Note: In mcp-lite, resource listing is handled differently than in the old SDK
	// The resource handler receives the URI and extracted variables
	agent.server.resource(
		'epicme://tags/{id}',
		{
			description: 'A single tag with the given ID',
		},
		async (uri, { id }) => {
			const tag = await agent.db.getTag(Number(id))
			invariant(tag, `Tag with ID "${id}" not found`)
			return {
				contents: [
					{
						mimeType: 'application/json',
						text: JSON.stringify(tag),
						uri: uri.href,
					},
				],
			}
		},
	)

	agent.server.resource(
		'epicme://entries/{id}',
		{
			description: 'A single journal entry with the given ID',
		},
		async (uri, { id }) => {
			const entry = await agent.db.getEntry(Number(id))
			invariant(entry, `Entry with ID "${id}" not found`)
			return {
				contents: [
					{
						mimeType: 'application/json',
						text: JSON.stringify(entry),
						uri: uri.href,
					},
				],
			}
		},
	)
}
