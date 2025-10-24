import { type EpicMeMCP } from './index.ts'

export async function initializeResources(agent: EpicMeMCP) {
	// 🐨 create a resource with the URI "epicme://tags" using agent.server.resource
	// - the config object should include a description for the resource
	// - the handler accepts the uri and returns the contents array which should
	//   have an object with mimeType application/json, text, and uri
	// 💰 You can use this to get the tags
	// `await agent.db.getTags()`
	// 💰 agent.server.resource('epicme://tags', {
	// 💰   description: 'All tags currently in the database',
	// 💰 }, async (uri) => ({
	// 💰   contents: [{
	// 💰     mimeType: 'application/json',
	// 💰     text: JSON.stringify(await agent.db.getTags()),
	// 💰     uri: uri.href,
	// 💰   }],
	// 💰 }))
}
