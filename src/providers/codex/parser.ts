import { parseJsonRecord } from '../../lib/json'
import { ParseResult } from '../../lib/result'
import {
	CODEX_DEFAULT_MODEL,
	CodexAppServerMethod,
	CodexEventType,
	CodexItemType,
	CodexMessageType,
	CodexRole,
	STREAM_MESSAGE_TYPES,
} from './constants'
import {
	applyTokenUsage,
	dispatchTool,
	flushStreamingText,
	handleAssistant,
	handleSessionMeta,
	handleStreamItem,
	handleThreadStarted,
	handleToolResult,
	handleTurnCompleted,
	handleTurnContext,
	handleUserMessage,
	showSession,
} from './handlers/index'
import type { CodexState } from './state'

function parseStreamLine(type: string, data: Record<string, unknown>, state: CodexState, result: ParseResult) {
	result.markRecognized()
	if (type === CodexMessageType.ThreadStarted) handleThreadStarted(data, state)
	else if (type === CodexMessageType.TurnStarted) state.turnCount++
	else if (type === CodexMessageType.TurnCompleted) handleTurnCompleted(data, state)
	else {
		const item = (data.item as Record<string, unknown>) ?? {}
		const isCompleted = type === CodexMessageType.ItemCompleted
		handleStreamItem(item, isCompleted, state, result)
	}
}

function parseAppServerItem(method: string, data: Record<string, unknown>, state: CodexState, result: ParseResult) {
	result.markRecognized()
	const params = (data.params as Record<string, unknown>) ?? {}
	const item = (params.item as Record<string, unknown>) ?? {}
	const isCompleted = method === CodexAppServerMethod.ItemCompleted
	handleStreamItem(item, isCompleted, state, result)
}

function parseSessionLine(type: string, data: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const payload = (data.payload as Record<string, unknown>) ?? {}

	if (type === CodexMessageType.SessionMeta) {
		result.markRecognized()
		handleSessionMeta(payload, state)
	} else if (type === CodexMessageType.TurnContext) {
		result.markRecognized()
		handleTurnContext(payload, state)
	} else if (type === CodexMessageType.EventMsg) {
		result.markRecognized()
		const eventType = (payload.type as string) ?? ''
		if (eventType === CodexEventType.UserMessage) handleUserMessage(payload, state, result)
		else if (eventType === CodexEventType.TokenCount) {
			const info = payload.info as Record<string, unknown> | null
			if (info) applyTokenUsage(state, (info.total_token_usage as Record<string, unknown>) ?? {})
		}
	} else if (type === CodexMessageType.ResponseItem) {
		result.markRecognized()
		const itemType = (payload.type as string) ?? ''
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

	const type = (data.type as string) ?? ''
	const method = (data.method as string) ?? ''
	const rpcResult = (data.result as Record<string, unknown>) ?? {}
	const thread = (rpcResult.thread as Record<string, unknown>) ?? {}

	if (thread.id) {
		result.markRecognized()
		state.sessionId = (thread.id as string) ?? ''
		if (!state.model) state.model = CODEX_DEFAULT_MODEL
		return result
	}

	if (method === CodexAppServerMethod.Delta) {
		result.markRecognized()
		const params = (data.params as Record<string, unknown>) ?? {}
		state.streamingAssistantText += (params.delta as string) ?? ''
		return result
	}

	if (method === CodexAppServerMethod.TokenUsage) {
		result.markRecognized()
		const params = (data.params as Record<string, unknown>) ?? {}
		const tokenUsage = (params.tokenUsage as Record<string, unknown>) ?? {}
		applyTokenUsage(state, (tokenUsage.total as Record<string, unknown>) ?? {})
		return result
	}

	if (method === CodexAppServerMethod.TurnCompleted) {
		result.markRecognized()
		showSession(state, result)
		flushStreamingText(state, result)
		state.turnCount++
		return result
	}

	if (method === CodexAppServerMethod.ItemStarted || method === CodexAppServerMethod.ItemCompleted) {
		parseAppServerItem(method, data, state, result)
		return result
	}

	if (STREAM_MESSAGE_TYPES.has(type)) parseStreamLine(type, data, state, result)
	else if (type) parseSessionLine(type, data, state, result)

	return result
}
