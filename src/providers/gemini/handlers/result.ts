import { ParseResult } from '../../../lib/result'
import type { GeminiState } from '../state'
import { flushStreamingText } from './render'

function num(value: unknown): number {
	return typeof value === 'number' ? value : 0
}

function fieldOr(record: Record<string, unknown>, ...keys: string[]): unknown {
	for (const key of keys) if (record[key] !== undefined) return record[key]
	return undefined
}

export function applySavedTokens(state: GeminiState, tokens: Record<string, unknown>) {
	state.lastInputTokens = num(tokens.input)
	state.lastOutputTokens = num(tokens.output) + num(tokens.thoughts)
}

export function finalizeGemini(state: GeminiState): ParseResult {
	const result = new ParseResult()
	flushStreamingText(state, result)
	if (!state.sessionShown) return result

	if (!state.hasSessionTurns) state.turnCount += 1
	const stats = `${state.turnCount} turns, ${state.lastInputTokens} in / ${state.lastOutputTokens} out`
	result.add(`\n\n${state.renderer.dim(`[done] ${stats}`)}\n`)
	return result
}

export function handleStreamResult(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	flushStreamingText(state, result)
	const stats = (data.stats as Record<string, unknown>) ?? {}
	state.lastInputTokens = num(fieldOr(stats, 'input_tokens', 'input'))
	state.lastOutputTokens = num(fieldOr(stats, 'output_tokens', 'output'))
}

export function handleAcpTurnResult(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	flushStreamingText(state, result)
	const rpcResult = (data.result as Record<string, unknown>) ?? {}
	const meta = (rpcResult._meta as Record<string, unknown>) ?? {}
	const quota = (meta.quota as Record<string, unknown>) ?? {}
	const tokenCount = (quota.token_count as Record<string, unknown>) ?? {}
	if (tokenCount.input_tokens || tokenCount.output_tokens) {
		state.lastInputTokens = num(tokenCount.input_tokens)
		state.lastOutputTokens = num(tokenCount.output_tokens)
	}
}

export function handleAcpUsageUpdate(update: Record<string, unknown>, state: GeminiState) {
	const usage = (update.usage as Record<string, unknown>) ?? {}
	state.lastInputTokens = num(fieldOr(usage, 'inputTokens', 'input_tokens')) + num(usage.cachedInputTokens)
	state.lastOutputTokens = num(fieldOr(usage, 'outputTokens', 'output_tokens'))
}
