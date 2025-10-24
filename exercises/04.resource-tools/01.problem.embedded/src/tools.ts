import { invariant } from '@epic-web/invariant'
import {
	createEntryInputSchema,
	createTagInputSchema,
	entryIdSchema,
	entryTagIdSchema,
	tagIdSchema,
	updateEntryInputSchema,
	updateTagInputSchema,
} from './db/schema.ts'
import { type EpicMeMCP } from './index.ts'

export async function initializeTools(agent: EpicMeMCP) {
	agent.server.tool('create_entry', {
		description: 'Create a new journal entry',
		inputSchema: createEntryInputSchema,
		handler: async (entry) => {
			const createdEntry = await agent.db.createEntry(entry)
			if (entry.tags) {
				for (const tagId of entry.tags) {
					await agent.db.addTagToEntry({
						entryId: createdEntry.id,
						tagId,
					})
				}
			}
			return {
				content: [
					createText(
						`Entry "${createdEntry.title}" created successfully with ID "${createdEntry.id}"`,
					),
					createText(createdEntry),
				],
			}
		},
	})

	agent.server.tool('get_entry', {
		description: 'Get a journal entry by ID',
		inputSchema: entryIdSchema,
		handler: async ({ id }) => {
			const entry = await agent.db.getEntry(id)
			invariant(entry, `Entry with ID "${id}" not found`)
			return {
				content: [createText(entry)],
			}
		},
	})

	agent.server.tool('list_entries', {
		description: 'List all journal entries',
		handler: async () => {
			const entries = await agent.db.getEntries()
			const entryLinks = entries.map(createText)
			return {
				content: [
					createText(`Found ${entries.length} entries.`),
					...entryLinks,
				],
			}
		},
	})

	agent.server.tool('update_entry', {
		description:
			'Update a journal entry. Fields that are not provided (or set to undefined) will not be updated. Fields that are set to null or any other value will be updated.',
		inputSchema: updateEntryInputSchema,
		handler: async ({ id, ...updates }) => {
			const existingEntry = await agent.db.getEntry(id)
			invariant(existingEntry, `Entry with ID "${id}" not found`)
			const updatedEntry = await agent.db.updateEntry(id, updates)
			return {
				content: [
					createText(
						`Entry "${updatedEntry.title}" (ID: ${id}) updated successfully`,
					),
					createText(updatedEntry),
				],
			}
		},
	})

	agent.server.tool('delete_entry', {
		description: 'Delete a journal entry',
		inputSchema: entryIdSchema,
		handler: async ({ id }) => {
			const existingEntry = await agent.db.getEntry(id)
			invariant(existingEntry, `Entry with ID "${id}" not found`)
			await agent.db.deleteEntry(id)
			return {
				content: [
					createText(
						`Entry "${existingEntry.title}" (ID: ${id}) deleted successfully`,
					),
					createText(existingEntry),
				],
			}
		},
	})

	agent.server.tool('create_tag', {
		description: 'Create a new tag',
		inputSchema: createTagInputSchema,
		handler: async (tag) => {
			const createdTag = await agent.db.createTag(tag)
			return {
				content: [
					createText(
						`Tag "${createdTag.name}" created successfully with ID "${createdTag.id}"`,
					),
					createText(createdTag),
				],
			}
		},
	})

	agent.server.tool('get_tag', {
		description: 'Get a tag by ID',
		inputSchema: tagIdSchema,
		handler: async ({ id }) => {
			const tag = await agent.db.getTag(id)
			invariant(tag, `Tag ID "${id}" not found`)
			return {
				content: [createText(tag)],
			}
		},
	})

	agent.server.tool('list_tags', {
		description: 'List all tags',
		handler: async () => {
			const tags = await agent.db.getTags()
			const tagLinks = tags.map(createText)
			return {
				content: [createText(`Found ${tags.length} tags.`), ...tagLinks],
			}
		},
	})

	agent.server.tool('update_tag', {
		description: 'Update a tag',
		inputSchema: updateTagInputSchema,
		handler: async ({ id, ...updates }) => {
			const updatedTag = await agent.db.updateTag(id, updates)
			return {
				content: [
					createText(
						`Tag "${updatedTag.name}" (ID: ${id}) updated successfully`,
					),
					createText(updatedTag),
				],
			}
		},
	})

	agent.server.tool('delete_tag', {
		description: 'Delete a tag',
		inputSchema: tagIdSchema,
		handler: async ({ id }) => {
			const existingTag = await agent.db.getTag(id)
			invariant(existingTag, `Tag ID "${id}" not found`)
			await agent.db.deleteTag(id)
			return {
				content: [
					createText(
						`Tag "${existingTag.name}" (ID: ${id}) deleted successfully`,
					),
					createText(existingTag),
				],
			}
		},
	})

	agent.server.tool('add_tag_to_entry', {
		description: 'Add a tag to an entry',
		inputSchema: entryTagIdSchema,
		handler: async ({ entryId, tagId }) => {
			const tag = await agent.db.getTag(tagId)
			const entry = await agent.db.getEntry(entryId)
			invariant(tag, `Tag ${tagId} not found`)
			invariant(entry, `Entry with ID "${entryId}" not found`)
			const entryTag = await agent.db.addTagToEntry({
				entryId,
				tagId,
			})
			return {
				content: [
					createText(
						`Tag "${tag.name}" (ID: ${entryTag.tagId}) added to entry "${entry.title}" (ID: ${entryTag.entryId}) successfully`,
					),
					createText(tag),
					createText(entry),
				],
			}
		},
	})
}

function createText(text: unknown): { type: 'text'; text: string } {
	if (typeof text === 'string') {
		return { type: 'text', text }
	} else {
		return { type: 'text', text: JSON.stringify(text) }
	}
}
