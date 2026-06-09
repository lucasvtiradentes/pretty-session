import { ParseResult } from '../../../lib/result'
import type { PiState } from '../state'

export function finalizePi(state: PiState): ParseResult {
	const result = new ParseResult()
	if (!state.sessionShown) return result

	const r = state.renderer
	const stats = `${state.turnCount} turns, ${state.lastInputTokens} in / ${state.lastOutputTokens} out`
	result.add(`\n${r.dim(`[done] ${stats}`)}\n`)

	return result
}
