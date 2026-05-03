import { ParseResult } from "../../result"
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

const STREAM_TYPES = new Set(["thread.started", "turn.started", "turn.completed", "item.started", "item.completed"])
const APP_SERVER_DELTA_METHOD = "item/agentMessage/delta"
const APP_SERVER_TOKEN_USAGE_METHOD = "thread/tokenUsage/updated"
const APP_SERVER_TURN_COMPLETED_METHOD = "turn/completed"

function parseStreamLine(type: string, data: Record<string, unknown>, state: CodexState, result: ParseResult) {
	if (type === "thread.started") handleThreadStarted(data, state)
	else if (type === "turn.started") state.turnCount++
	else if (type === "turn.completed") handleTurnCompleted(data, state)
	else handleStreamItem(data, state, result)
}

function parseSessionLine(type: string, data: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const payload = (data.payload as Record<string, unknown>) ?? {}

	if (type === "session_meta") handleSessionMeta(payload, state)
	else if (type === "turn_context") handleTurnContext(payload, state)
	else if (type === "event_msg") {
		const eventType = (payload.type as string) ?? ""
		if (eventType === "user_message") handleUserMessage(payload, state, result)
		else if (eventType === "token_count") {
			const info = payload.info as Record<string, unknown> | null
			if (info) {
				const usage = (info.total_token_usage as Record<string, number>) ?? {}
				state.lastInputTokens = (usage.input_tokens ?? 0) + (usage.cached_input_tokens ?? 0)
				state.lastOutputTokens = (usage.output_tokens ?? 0) + (usage.reasoning_output_tokens ?? 0)
			}
		}
	} else if (type === "response_item") {
		const itemType = (payload.type as string) ?? ""
		if (itemType === "message" && (payload.role as string) === "assistant") {
			handleAssistant(payload, state, result)
		} else if (itemType === "function_call" || itemType === "custom_tool_call") {
			dispatchTool(payload, state, result)
		} else if (itemType === "function_call_output") {
			handleToolResult(payload, state, result)
		}
	}
}

export function parseCodexLine(line: string, state: CodexState): ParseResult {
	const result = new ParseResult()

	let data: Record<string, unknown>
	try {
		data = JSON.parse(line)
	} catch {
		return result
	}

	const type = (data.type as string) ?? ""
	const method = (data.method as string) ?? ""
	const rpcResult = (data.result as Record<string, unknown>) ?? {}
	const thread = (rpcResult.thread as Record<string, unknown>) ?? {}

	if (thread.id) {
		state.sessionId = (thread.id as string) ?? ""
		if (!state.model) state.model = "codex"
		return result
	}

	if (method === APP_SERVER_DELTA_METHOD) {
		const params = (data.params as Record<string, unknown>) ?? {}
		state.streamingAssistantText += (params.delta as string) ?? ""
		return result
	}

	if (method === APP_SERVER_TOKEN_USAGE_METHOD) {
		const params = (data.params as Record<string, unknown>) ?? {}
		const tokenUsage = (params.tokenUsage as Record<string, unknown>) ?? {}
		const total = (tokenUsage.total as Record<string, number>) ?? {}
		state.lastInputTokens = (total.inputTokens ?? 0) + (total.cachedInputTokens ?? 0)
		state.lastOutputTokens = (total.outputTokens ?? 0) + (total.reasoningOutputTokens ?? 0)
		return result
	}

	if (method === APP_SERVER_TURN_COMPLETED_METHOD) {
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

	if (STREAM_TYPES.has(type)) parseStreamLine(type, data, state, result)
	else parseSessionLine(type, data, state, result)

	return result
}
