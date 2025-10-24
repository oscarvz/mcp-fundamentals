import type { CompletionHandler } from '@exercises/shared/completion'
import { z } from 'zod'
import { type EpicMeMCP } from './index.ts'

const EntryIdArgumentSchema = z.object({
	name: z.literal('entryId'),
	value: z.string().optional(),
})

export function initializeCompletionHandlers(
	agent: EpicMeMCP,
): CompletionHandler[] {
	return [
		async (params) => {
			if (
				params.ref.type !== 'ref/prompt' ||
				params.ref.name !== 'suggest_tags'
			) {
				return undefined
			}

			const parsedArg = EntryIdArgumentSchema.safeParse(params.argument)
			if (!parsedArg.success) {
				return undefined
			}

			const entries = await agent.db.getEntries()
			const { value } = parsedArg.data
			if (typeof value === 'string' && value.length > 0) {
				return entries
					.map((entry) => entry.id.toString())
					.filter((id) => id.includes(value))
			}

			return entries.map((entry) => entry.id.toString())
		},
	]
}
