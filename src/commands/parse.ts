import { argument, defineCommand, defineSubCommand } from '../cli/define'
import { Provider } from '../constants'
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
			action: async ({ args }) => {
				const parser = createProviderParser(provider)
				if (args.pathOrSessionId)
					await parseFileLines(await resolveSessionSource(provider, args.pathOrSessionId), parser)
				else streamLines(parser)
				return 0
			},
		}),
	),
})
