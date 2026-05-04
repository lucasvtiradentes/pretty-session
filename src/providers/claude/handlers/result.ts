import type { ParseResult } from '../../../lib/result'
import type { ParserState } from '../state'

export function handleResult(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer

	while (state.subagentDepth > 0) {
		state.decrementDepth()
	}

	if (data.is_error) {
		const errorMsg = (data.result as string) ?? 'unknown error'
		result.add(`\n${r.red(`[error] ${errorMsg}`)}\n`)
	} else {
		const durationMs = (data.duration_ms as number) ?? 0
		const duration = (durationMs / 1000).toFixed(1)
		const cost = ((data.total_cost_usd as number) ?? 0).toFixed(4)
		const turns = (data.num_turns as number) ?? 0
		const usage = (data.usage as Record<string, number>) ?? {}
		const inputTokens =
			(usage.input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0)
		const outputTokens = usage.output_tokens ?? 0
		const stats = `${duration}s, $${cost}, ${turns} turns, ${inputTokens} in / ${outputTokens} out`
		result.add(`\n${r.dim(`[done] ${stats}`)}\n`)
	}
}
