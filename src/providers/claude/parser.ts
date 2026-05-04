import { ClaudeMessageType, ParserMode, SystemSubtype } from "./constants"
import {
	ParseResult,
	type ParserState,
	handleAssistantMessage,
	handleResult,
	handleStreamEvent,
	handleSystem,
	handleUserMessage,
} from "./handlers/index"

export function parseJsonLine(line: string, state: ParserState): ParseResult {
	const result = new ParseResult()

	let data: Record<string, unknown>
	try {
		data = JSON.parse(line)
	} catch {
		return result
	}

	const msgType = (data.type as string) ?? ""

	if (msgType === ClaudeMessageType.System) handleSystem(data, state, result)
	else if (msgType === ClaudeMessageType.StreamEvent) handleStreamEvent(data, state, result)
	else if (msgType === ClaudeMessageType.User) {
		if (!state.sessionShown && data.sessionId) {
			state.pendingSessionId = (data.sessionId as string) ?? ""
			state.pendingCwd = (data.cwd as string) ?? ""
			state.mode = ParserMode.Replay
		}
		if (data.sessionId) state.turnCount++
		handleUserMessage(data, state, result)
	} else if (msgType === ClaudeMessageType.Assistant) {
		const message = (data.message as Record<string, unknown>) ?? {}
		if (message.model) state.lastModel = (message.model as string) ?? ""
		if (message.usage) state.lastUsage = (message.usage as Record<string, number>) ?? {}

		if (!state.sessionShown && state.pendingSessionId) {
			handleSystem(
				{
					subtype: SystemSubtype.Init,
					session_id: state.pendingSessionId,
					cwd: state.pendingCwd,
					model: state.lastModel,
				},
				state,
				result,
			)
		}

		handleAssistantMessage(data, state, result)
	} else if (msgType === ClaudeMessageType.Result) handleResult(data, state, result)
	else if (msgType === ClaudeMessageType.LastPrompt) {
		if (state.mode === ParserMode.Replay && state.pendingSessionId) {
			const usage = state.lastUsage
			const inputTokens =
				(usage.input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0)
			const outputTokens = usage.output_tokens ?? 0
			const r = state.renderer
			const stats = `0.0s, $0.0000, ${state.turnCount} turns, ${inputTokens} in / ${outputTokens} out`
			result.add(`\n${r.dim(`[done] ${stats}`)}\n`)
		}
	} else if (msgType === ClaudeMessageType.Error) {
		const errorMsg = (data.error as string) ?? "unknown error"
		result.add(`\n${state.sp}${state.renderer.red(`[error] ${errorMsg}`)}`)
	}

	return result
}
