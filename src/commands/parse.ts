import { argument, defineCommand, defineSubCommand, flag } from '../cli/define'
import { Provider } from '../constants'
import { lastTurnsLines } from '../lib/last-turns'
import { createProviderParser } from '../lib/provider-parser'
import { resolveSessionSource } from '../lib/session-source'
import { parseFileLines, streamLines } from '../lib/stream'

const PARSE_COMMAND_NAME = 'parse'

export const parseCommand = defineCommand({
	name: PARSE_COMMAND_NAME,
	description: 'Parse provider session streams from stdin',
	subcommands: Object.values(Provider).map((provider) =>
		defineSubCommand({
			name: provider,
			description: `Parse a ${provider} session stream from stdin or a saved session`,
			arguments: [
				argument.string('path-or-session-id', 'Session JSONL file path or session id to parse', { required: false }),
			],
			flags: [flag.string('--last-turns', 'Parse only the latest N real user turns from a saved session')],
			action: async ({ args, options }) => {
				const parser = createProviderParser(provider)
				const lastTurns = parseLastTurns(options.lastTurns)
				if (args.pathOrSessionId) {
					await parseFileLines(await resolveSessionSource(provider, args.pathOrSessionId), parser, {
						filterLines: lastTurns ? (lines) => lastTurnsLines(provider, lines, lastTurns) : undefined,
					})
				} else streamLines(parser)
				return 0
			},
		}),
	),
})

function parseLastTurns(value: string | undefined): number | undefined {
	if (value === undefined) return undefined
	const count = Number(value)
	if (!Number.isInteger(count) || count < 1) throw new Error('--last-turns must be a positive integer')
	return count
}
