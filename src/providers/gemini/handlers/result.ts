import { ParseResult } from '../../../lib/result'
import type { GeminiState } from '../state'

export function finalizeGemini(state: GeminiState): ParseResult {
	const result = new ParseResult()
	if (!state.sessionShown) return result

	if (!state.hasSessionTurns) state.turnCount += 1
	const stats = `${state.turnCount} turns, ${state.lastInputTokens} in / ${state.lastOutputTokens} out`
	result.add(`\n\n${state.renderer.dim(`[done] ${stats}`)}\n`)
	return result
}

export function handleStreamResult(data: Record<string, unknown>, state: GeminiState) {
	const stats = (data.stats as Record<string, number>) ?? {}
	state.lastInputTokens = stats.input_tokens ?? stats.input ?? 0
	state.lastOutputTokens = stats.output_tokens ?? 0
}

export function handleAcpTurnResult(data: Record<string, unknown>, state: GeminiState) {
	const rpcResult = (data.result as Record<string, unknown>) ?? {}
	const meta = (rpcResult._meta as Record<string, unknown>) ?? {}
	const quota = (meta.quota as Record<string, unknown>) ?? {}
	const tokenCount = (quota.token_count as Record<string, number>) ?? {}
	if (tokenCount.input_tokens || tokenCount.output_tokens) {
		state.lastInputTokens = tokenCount.input_tokens ?? 0
		state.lastOutputTokens = tokenCount.output_tokens ?? 0
	}
}

export function handleAcpUsageUpdate(update: Record<string, unknown>, state: GeminiState) {
	const usage = (update.usage as Record<string, number>) ?? {}
	state.lastInputTokens = (usage.inputTokens ?? usage.input_tokens ?? 0) + (usage.cachedInputTokens ?? 0)
	state.lastOutputTokens = usage.outputTokens ?? usage.output_tokens ?? 0
}
