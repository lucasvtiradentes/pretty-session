import type { ParseResult } from '../../../lib/result'
import type { GeminiState } from '../state'
import { showSession } from './session'
import { dispatchTool } from './tools/dispatch'

export function handleSavedGeminiMessage(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	state.model = (data.model as string) ?? state.model
	const tokens = (data.tokens as Record<string, number>) ?? {}
	state.lastInputTokens = tokens.input ?? 0
	state.lastOutputTokens = (tokens.output ?? 0) + (tokens.thoughts ?? 0)
	state.turnCount++
	state.hasSessionTurns = true
	showSession(state, result)

	const content = (data.content as string) ?? ''
	if (content) result.add(state.renderer.renderMarkdown(content))

	const toolCalls = (data.toolCalls as Record<string, unknown>[]) ?? []
	for (const toolCall of toolCalls) {
		dispatchTool(toolCall, state, result)
	}
}

export function handleStreamAssistantMessage(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	showSession(state, result)
	const raw = (data.content as string) ?? ''
	if (raw) result.add(state.renderer.renderMarkdown(raw))
}

export function handleAcpAgentMessageChunk(update: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	showSession(state, result)
	const content = (update.content as Record<string, unknown>) ?? {}
	const raw = (content.text as string) ?? ''
	if (raw) result.add(state.renderer.renderMarkdown(raw))
}
