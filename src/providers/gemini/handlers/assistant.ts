import type { ParseResult } from '../../../lib/result'
import type { GeminiState } from '../state'
import { renderAgentText } from './render'
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

export function handleStreamAssistantMessage(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	renderAgentText((data.content as string) ?? '', state, result)
}

export function handleAcpAgentMessageChunk(update: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const content = (update.content as Record<string, unknown>) ?? {}
	renderAgentText((content.text as string) ?? '', state, result)
}
