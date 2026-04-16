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
} from "./handlers/index"
import type { CodexState } from "./state"

export { CodexState } from "./state"
export { finalizeCodex } from "./handlers/result"

export function parseCodexLine(line: string, state: CodexState): ParseResult {
	const result = new ParseResult()

	let data: Record<string, unknown>
	try {
		data = JSON.parse(line)
	} catch {
		return result
	}

	const type = (data.type as string) ?? ""

	if (type === "thread.started") handleThreadStarted(data, state)
	else if (type === "turn.started") state.turnCount++
	else if (type === "turn.completed") handleTurnCompleted(data, state)
	else if (type === "item.completed" || type === "item.started") handleStreamItem(data, state, result)
	else {
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

	return result
}
