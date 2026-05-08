import { defineCommand, defineSubCommand } from '../cli/define'
import { Provider } from '../constants'
import { createProviderParser } from '../lib/provider-parser'
import { streamLines } from '../lib/stream'

const PARSE_COMMAND_NAME = 'parse'

export const parseCommand = defineCommand({
	name: PARSE_COMMAND_NAME,
	description: 'Parse provider session streams from stdin',
	subcommands: Object.values(Provider).map((provider) =>
		defineSubCommand({
			name: provider,
			description: `Parse a ${provider} session stream from stdin`,
			action: () => {
				streamLines(createProviderParser(provider))
				return 0
			},
		}),
	),
})
