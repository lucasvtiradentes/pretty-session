import type { ParseResult } from '../../../lib/result'
import type { GeminiState } from '../state'
import { bufferAgentText, flushStreamingText, renderAgentText } from './render'
import { applySavedTokens } from './result'
import { dispatchTool } from './tools/dispatch'

export function handleSavedGeminiMessage(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	state.model = (data.model as string) ?? state.model
	applySavedTokens(state, (data.tokens as Record<string, unknown>) ?? {})
	state.turnCount++
	state.hasSessionTurns = true

	renderAgentText((data.content as string) ?? '', state, result)

	const toolCalls = (data.toolCalls as Record<string, unknown>[]) ?? []
	for (const toolCall of toolCalls) dispatchTool(toolCall, state, result)
}

export function handleStreamAssistantMessage(data: Record<string, unknown>, state: GeminiState, _result: ParseResult) {
	const text = (data.content as string) ?? ''
	if (data.delta) bufferAgentText(text, state)
	else {
		flushStreamingText(state, _result)
		bufferAgentText(text, state)
		flushStreamingText(state, _result)
	}
}

export function handleAcpAgentMessageChunk(update: Record<string, unknown>, state: GeminiState, _result: ParseResult) {
	const content = (update.content as Record<string, unknown>) ?? {}
	bufferAgentText((content.text as string) ?? '', state)
}
