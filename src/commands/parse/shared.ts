import { defineCommand, z } from 'unicommand'
import type { Provider } from '../../constants'
import { lastTurnsLines } from '../../lib/last-turns'
import { createProviderParser } from '../../lib/provider-parser'
import { resolveSessionSource } from '../../lib/session-source'
import { parseFileLines, streamLines } from '../../lib/stream'

const inputSchema = z.object({
	pathOrSessionId: z.coerce.string().optional(),
	lastTurns: z.coerce.string().optional(),
})

export const defineParseCommand = (provider: Provider) =>
	defineCommand({
		name: `parse ${provider}`,
		description: `Parse a ${provider} session stream from stdin or a saved session`,
		examples: (binName) => [
			`${binName} parse ${provider} < session.jsonl`,
			`${binName} parse ${provider} <path-or-session-id>`,
		],
		inputSchema,
		outputSchema: z.number(),
		arguments: [
			{
				synopsis: '[path-or-session-id]',
				description: 'Session JSONL file path or session id to parse',
			},
		],
		options: [
			{
				name: 'last-turns',
				value: '<value>',
				description: 'Parse only the latest N real user turns from a saved session',
			},
		],
	})

export const createParseHandler = (provider: Provider) => async (input: z.infer<typeof inputSchema>) => {
	const parser = createProviderParser(provider)
	const lastTurns = parseLastTurns(input.lastTurns)
	if (input.pathOrSessionId) {
		await parseFileLines(await resolveSessionSource(provider, input.pathOrSessionId), parser, {
			filterLines: lastTurns ? (lines) => lastTurnsLines(provider, lines, lastTurns) : undefined,
		})
	} else {
		await streamLines(parser)
	}
	return typeof process.exitCode === 'number' ? process.exitCode : 0
}

function parseLastTurns(value: string | undefined): number | undefined {
	if (value === undefined) return undefined
	const count = Number(value)
	if (!Number.isInteger(count) || count < 1) throw new Error('--last-turns must be a positive integer')
	return count
}
