import { parseJsonRecord } from "../../lib/json"
import { ParseResult } from "../../result"
import {
	CODEX_DEFAULT_MODEL,
	CodexAppServerMethod,
	CodexEventType,
	CodexItemType,
	CodexMessageType,
	CodexRole,
	STREAM_MESSAGE_TYPES,
} from "./constants"
import {
	dispatchTool,
	handleAssistant,
	handleSessionMeta,
	handleStreamItem,
	handleThreadStarted,
	handleToolResult,
	handleTurnCompleted,
	handleTurnContext,
	handleUserMessage,
	showSession,
} from "./handlers/index"
import type { CodexState } from "./state"

export { CodexState } from "./state"
export { finalizeCodex } from "./handlers/result"

function parseStreamLine(type: string, data: Record<string, unknown>, state: CodexState, result: ParseResult) {
	if (type === CodexMessageType.ThreadStarted) handleThreadStarted(data, state)
	else if (type === CodexMessageType.TurnStarted) state.turnCount++
	else if (type === CodexMessageType.TurnCompleted) handleTurnCompleted(data, state)
	else handleStreamItem(data, state, result)
}

function parseSessionLine(type: string, data: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const payload = (data.payload as Record<string, unknown>) ?? {}

	if (type === CodexMessageType.SessionMeta) handleSessionMeta(payload, state)
	else if (type === CodexMessageType.TurnContext) handleTurnContext(payload, state)
	else if (type === CodexMessageType.EventMsg) {
		const eventType = (payload.type as string) ?? ""
		if (eventType === CodexEventType.UserMessage) handleUserMessage(payload, state, result)
		else if (eventType === CodexEventType.TokenCount) {
			const info = payload.info as Record<string, unknown> | null
			if (info) {
				const usage = (info.total_token_usage as Record<string, number>) ?? {}
				state.lastInputTokens = (usage.input_tokens ?? 0) + (usage.cached_input_tokens ?? 0)
				state.lastOutputTokens = (usage.output_tokens ?? 0) + (usage.reasoning_output_tokens ?? 0)
			}
		}
	} else if (type === CodexMessageType.ResponseItem) {
		const itemType = (payload.type as string) ?? ""
		if (itemType === CodexItemType.Message && (payload.role as string) === CodexRole.Assistant) {
			handleAssistant(payload, state, result)
		} else if (itemType === CodexItemType.FunctionCall || itemType === CodexItemType.CustomToolCall) {
			dispatchTool(payload, state, result)
		} else if (itemType === CodexItemType.FunctionCallOutput) {
			handleToolResult(payload, state, result)
		}
	}
}

export function parseCodexLine(line: string, state: CodexState): ParseResult {
	const result = new ParseResult()

	const data = parseJsonRecord(line)
	if (!data) return result

	const type = (data.type as string) ?? ""
	const method = (data.method as string) ?? ""
	const rpcResult = (data.result as Record<string, unknown>) ?? {}
	const thread = (rpcResult.thread as Record<string, unknown>) ?? {}

	if (thread.id) {
		state.sessionId = (thread.id as string) ?? ""
		if (!state.model) state.model = CODEX_DEFAULT_MODEL
		return result
	}

	if (method === CodexAppServerMethod.Delta) {
		const params = (data.params as Record<string, unknown>) ?? {}
		state.streamingAssistantText += (params.delta as string) ?? ""
		return result
	}

	if (method === CodexAppServerMethod.TokenUsage) {
		const params = (data.params as Record<string, unknown>) ?? {}
		const tokenUsage = (params.tokenUsage as Record<string, unknown>) ?? {}
		const total = (tokenUsage.total as Record<string, number>) ?? {}
		state.lastInputTokens = (total.inputTokens ?? 0) + (total.cachedInputTokens ?? 0)
		state.lastOutputTokens = (total.outputTokens ?? 0) + (total.reasoningOutputTokens ?? 0)
		return result
	}

	if (method === CodexAppServerMethod.TurnCompleted) {
		if (!state.sessionShown) showSession(state, result)
		const raw = state.streamingAssistantText.replace(/^\n+|\n+$/g, "")
		state.streamingAssistantText = ""
		if (raw) {
			const rendered = state.renderer.renderMarkdown(raw).replace(/\n+$/, "")
			if (rendered) result.add(`\n${rendered}\n`)
		}
		state.turnCount++
		return result
	}

	if (STREAM_MESSAGE_TYPES.has(type)) parseStreamLine(type, data, state, result)
	else parseSessionLine(type, data, state, result)

	return result
}
