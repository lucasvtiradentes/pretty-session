import { INDENT } from '../../../constants'
import type { ParseResult } from '../../../lib/result'
import type { GeminiState } from '../state'

export function showSession(state: GeminiState, result: ParseResult) {
	if (state.sessionShown) return
	state.sessionShown = true
	const lines = `[session]\n${INDENT}id:    ${state.sessionId}\n${INDENT}model: ${state.model}`
	result.add(`${state.renderer.dim(lines)}\n\n`)
}

export function handleSavedSessionStart(data: Record<string, unknown>, state: GeminiState) {
	if (data.sessionId) state.sessionId = (data.sessionId as string) ?? state.sessionId
}

export function handleStreamInit(data: Record<string, unknown>, state: GeminiState) {
	state.sessionId = (data.session_id as string) ?? state.sessionId
	state.model = (data.model as string) ?? state.model
}

export function handleAcpInitialize(data: Record<string, unknown>, state: GeminiState) {
	const rpcResult = (data.result as Record<string, unknown>) ?? {}
	if (rpcResult.sessionId) state.sessionId = (rpcResult.sessionId as string) ?? state.sessionId
	const models = (rpcResult.models as Record<string, unknown>) ?? {}
	if (models.currentModelId) state.model = (models.currentModelId as string) ?? state.model
}

export function handleAcpSessionUpdateParams(params: Record<string, unknown>, state: GeminiState) {
	if (params.sessionId) state.sessionId = (params.sessionId as string) ?? state.sessionId
}
