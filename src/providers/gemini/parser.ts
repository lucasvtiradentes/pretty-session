import { parseJsonRecord } from '../../lib/json'
import { ParseResult } from '../../lib/result'
import {
	GEMINI_SAVED_KIND_MAIN,
	GEMINI_SESSION_UPDATE_METHOD,
	GeminiMessageType,
	GeminiRole,
	GeminiUpdateType,
} from './constants'
import {
	handleAcpAgentMessageChunk,
	handleAcpInitialize,
	handleAcpSessionUpdateParams,
	handleAcpToolCall,
	handleAcpToolCallUpdate,
	handleAcpTurnResult,
	handleAcpUsageUpdate,
	handleSavedGeminiMessage,
	handleSavedSessionStart,
	handleStreamAssistantMessage,
	handleStreamInit,
	handleStreamResult,
} from './handlers/index'
import type { GeminiState } from './state'

export function parseGeminiLine(line: string, state: GeminiState): ParseResult {
	const result = new ParseResult()

	const data = parseJsonRecord(line)
	if (!data) return result

	if (data.kind === GEMINI_SAVED_KIND_MAIN && data.sessionId) {
		result.markRecognized()
		handleSavedSessionStart(data, state)
		return result
	}

	if (data.result && typeof data.result === 'object') {
		const rpcResult = data.result as Record<string, unknown>
		if (rpcResult.sessionId || rpcResult.models) {
			result.markRecognized()
			handleAcpInitialize(data, state)
		}
		if (rpcResult._meta) {
			result.markRecognized()
			handleAcpTurnResult(data, state)
		}
	}

	const type = (data.type as string) ?? ''

	if (type === GeminiMessageType.Gemini) {
		result.markRecognized()
		handleSavedGeminiMessage(data, state, result)
		return result
	}

	if (type === GeminiMessageType.Init) {
		result.markRecognized()
		handleStreamInit(data, state)
		return result
	}

	if (type === GeminiMessageType.Message) {
		result.markRecognized()
		if (data.role === GeminiRole.Assistant) handleStreamAssistantMessage(data, state, result)
		return result
	}

	if (type === GeminiMessageType.Result) {
		result.markRecognized()
		handleStreamResult(data, state)
		return result
	}

	const method = (data.method as string) ?? ''
	if (method !== GEMINI_SESSION_UPDATE_METHOD) return result
	result.markRecognized()

	const params = (data.params as Record<string, unknown>) ?? {}
	handleAcpSessionUpdateParams(params, state)

	const update = (params.update as Record<string, unknown>) ?? {}
	const updateType = (update.sessionUpdate as string) ?? ''

	if (updateType === GeminiUpdateType.AgentMessageChunk) handleAcpAgentMessageChunk(update, state, result)
	else if (updateType === GeminiUpdateType.UsageUpdate) handleAcpUsageUpdate(update, state)
	else if (updateType === GeminiUpdateType.ToolCall) handleAcpToolCall(update, state, result)
	else if (updateType === GeminiUpdateType.ToolCallUpdate) handleAcpToolCallUpdate(update, state, result)

	return result
}
