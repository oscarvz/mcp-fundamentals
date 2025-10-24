// 💰 you'll use this in this exercise:
// import { invariant } from '@epic-web/invariant'
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

	// 🐨 create two resources with URI templates:
	// - entry - URI: "epicme://entries/{id}" (💰 use await agent.db.getEntry)
	// - tag - URI: "epicme://tags/{id}" (💰 use await agent.db.getTag)
	// 🐨 each should have a description
	// 🐨 each should have a handler that reads the entry or tag for the given id from the URI variables
	// 💰 In mcp-lite, URI template variables are automatically extracted and passed to the handler
	// 💰 agent.server.resource('epicme://tags/{id}', {
	// 💰   description: 'A single tag with the given ID',
	// 💰 }, async (uri, { id }) => {
	// 💰   const tag = await agent.db.getTag(Number(id))
	// 💰   // Handle not found case
	// 💰   return { contents: [{ mimeType: 'application/json', text: JSON.stringify(tag), uri: uri.href }] }
	// 💰 })
	// 🐨 return contents with mimeType application/json and the entry or tag
	// 💯 as extra credit, handle the case where the id is not found (you can use invariant for this)
}
