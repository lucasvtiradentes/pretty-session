import type { Program } from '@caporal/core'
import { Provider } from '../constants'
import { createProviderParser } from '../lib/provider-parser'
import { streamLines } from '../lib/stream'

const PARSE_COMMAND_NAME = 'parse'

export function registerParseCommand(program: Program) {
	for (const provider of Object.values(Provider)) {
		program
			.command(`${PARSE_COMMAND_NAME} ${provider}`, `Parse a ${provider} session stream from stdin`)
			.strict(false)
			.action(() => {
				streamLines(createProviderParser(provider))
				return 0
			})
	}
}
