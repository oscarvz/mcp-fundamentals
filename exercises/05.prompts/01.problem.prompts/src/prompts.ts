// 💰 you'll need this for the argument schema
// import { z } from 'zod'
import { type EpicMeMCP } from './index.ts'

export async function initializePrompts(agent: EpicMeMCP) {
	// 🐨 use agent.server.prompt to create a prompt here called "suggest_tags" with a reasonable description
	// 🐨 it should take an entryId as an argument (with arguments schema)
	// 🐨 the handler should return a prompt message that instructs the assistant to:
	// - lookup the journal entry with the given ID (tell it to use the get_entry tool)
	// - look up the available tags (tell it to use the list_tags tool)
	// - suggest tags (creating new ones if necessary)
	// - for approved tags, tell it to create new ones (tell it to use the create_tag tool)
	//   and then add them to the entry (tell it to use the add_tag_to_entry tool)
	// 💰 agent.server.prompt('suggest_tags', {
	// 💰   description: 'Suggest tags for a journal entry',
	// 💰   arguments: z.object({
	// 💰     entryId: z.string().describe('The ID of the journal entry to suggest tags for'),
	// 💰   }),
	// 💰   handler: async ({ entryId }) => ({
	// 💰     messages: [{
	// 💰       role: 'user',
	// 💰       content: { type: 'text', text: `Your prompt message here...` }
	// 💰     }]
	// 💰   })
	// 💰 })
}
