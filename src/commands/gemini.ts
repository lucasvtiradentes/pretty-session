import type { Program } from '@caporal/core'
import { Provider } from '../constants'
import { streamLines } from '../lib/stream'
import { GeminiState, finalizeGemini, parseGeminiLine } from '../providers/gemini'

const description = 'Format Gemini stream or saved session JSONL'

export function registerGeminiCommand(program: Program) {
	program
		.command(Provider.Gemini, description)
		.strict(false)
		.action(() => {
			const state = new GeminiState()
			streamLines({
				parseLine: (line) => parseGeminiLine(line, state),
				finalize: () => finalizeGemini(state),
			})
		})
}
