import type { Program } from '@caporal/core'
import { Provider } from '../constants'
import { streamLines } from '../lib/stream'
import { ParserState, parseJsonLine } from '../providers/claude'

const description = 'Format Claude Code stream or saved session JSONL'

export function registerClaudeCommand(program: Program) {
	program
		.command(Provider.Claude, description)
		.strict(false)
		.action(() => {
			const state = new ParserState()
			streamLines({ parseLine: (line) => parseJsonLine(line, state) })
		})
}
