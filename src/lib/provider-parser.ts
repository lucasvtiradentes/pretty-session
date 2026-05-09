import { Provider } from '../constants'
import { ParserState, finalizeClaude, parseJsonLine } from '../providers/claude'
import { CodexState, finalizeCodex, parseCodexLine } from '../providers/codex'
import { GeminiState, finalizeGemini, parseGeminiLine } from '../providers/gemini'
import type { LineParser } from './stream'

export function createProviderParser(provider: Provider): LineParser {
	if (provider === Provider.Claude) {
		const state = new ParserState()
		return {
			parseLine: (line) => parseJsonLine(line, state),
			finalize: () => finalizeClaude(state),
		}
	}

	if (provider === Provider.Codex) {
		const state = new CodexState()
		return {
			parseLine: (line) => parseCodexLine(line, state),
			finalize: () => finalizeCodex(state),
		}
	}

	const state = new GeminiState()
	return {
		parseLine: (line) => parseGeminiLine(line, state),
		finalize: () => finalizeGemini(state),
	}
}
