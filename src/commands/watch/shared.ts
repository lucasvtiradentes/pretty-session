import { defineCommand, z } from 'unicommand'
import type { Provider } from '../../constants'
import { createProviderParser } from '../../lib/provider-parser'
import { resolveSessionSource } from '../../lib/session-source'
import { watchLines } from '../../lib/stream'

const inputSchema = z.object({
	pathOrSessionId: z.coerce.string(),
	fromEnd: z.boolean().optional(),
	interval: z.coerce.string().optional(),
})

export const defineWatchCommand = (provider: Provider) =>
	defineCommand({
		name: `watch ${provider}`,
		description: `Follow a saved ${provider} session JSONL file`,
		examples: (binName) => [`${binName} watch ${provider} <path-or-session-id>`],
		inputSchema,
		outputSchema: z.number(),
		arguments: [
			{
				synopsis: '<path-or-session-id>',
				description: 'Session JSONL file path or session id to follow',
			},
		],
		options: [
			{ name: 'from-end', description: 'Start at the end of the file instead of replaying existing events' },
			{ name: 'interval', value: '<value>', description: 'Polling interval in milliseconds' },
		],
	})

export const createWatchHandler = (provider: Provider) => async (input: z.infer<typeof inputSchema>) => {
	const intervalMs = Number(input.interval ?? '250')
	if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
		console.log(`error: invalid interval '${String(input.interval)}'`)
		return 1
	}

	const controller = new AbortController()
	process.once('SIGINT', () => controller.abort())
	process.once('SIGTERM', () => controller.abort())

	const path = await resolveSessionSource(provider, input.pathOrSessionId)
	await watchLines({
		path,
		createParser: () => createProviderParser(provider),
		fromEnd: Boolean(input.fromEnd),
		intervalMs,
		signal: controller.signal,
	})

	return 0
}
