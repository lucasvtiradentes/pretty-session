import { parseJsonRecord } from '../../lib/json'
import { findJsonlRecord } from '../../lib/jsonl'
import { ParseResult } from '../../lib/result'
import { ClaudeMessageType, ParserMode, SystemSubtype } from './constants'
import {
	handleAssistantMessage,
	handleResult,
	handleStreamEvent,
	handleSystem,
	handleUserMessage,
} from './handlers/index'
import { renderUserText } from './handlers/user'
import type { ParserState } from './state'

function flushInitialUserMessage(state: ParserState, result: ParseResult) {
	if (state.initialUserRendered) return

	if (state.pendingUserMessage) {
		renderUserText(state.pendingUserMessage, state, result)
		state.pendingUserMessage = ''
		return
	}

	if (state.initialUserFallbackTried || !state.sessionFilePath) return
	state.initialUserFallbackTried = true
	const record = findJsonlRecord(state.sessionFilePath, (item) => {
		const message = (item.message as Record<string, unknown>) ?? {}
		return item.type === ClaudeMessageType.User && typeof message.content === 'string'
	})
	const message = (record?.message as Record<string, unknown>) ?? {}
	const content = message.content
	if (typeof content === 'string') renderUserText(content, state, result)
}

export function parseJsonLine(line: string, state: ParserState): ParseResult {
	const result = new ParseResult()

	const data = parseJsonRecord(line)
	if (!data) return result

	const msgType = (data.type as string) ?? ''

	if (msgType === ClaudeMessageType.System) {
		result.markRecognized()
		handleSystem(data, state, result)
	} else if (msgType === ClaudeMessageType.StreamEvent) {
		result.markRecognized()
		handleStreamEvent(data, state, result)
	} else if (msgType === ClaudeMessageType.User) {
		result.markRecognized()
		if (!state.sessionShown && data.sessionId) {
			state.pendingSessionId = (data.sessionId as string) ?? ''
			state.pendingCwd = (data.cwd as string) ?? ''
			state.mode = ParserMode.Replay
		}
		if (data.sessionId) state.turnCount++
		const message = (data.message as Record<string, unknown>) ?? {}
		if (!state.sessionShown && typeof message.content === 'string') {
			state.pendingUserMessage = message.content
		} else {
			handleUserMessage(data, state, result)
		}
	} else if (msgType === ClaudeMessageType.Assistant) {
		result.markRecognized()
		const message = (data.message as Record<string, unknown>) ?? {}
		if (message.model) state.lastModel = (message.model as string) ?? ''
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

		flushInitialUserMessage(state, result)
		handleAssistantMessage(data, state, result)
	} else if (msgType === ClaudeMessageType.Result) {
		result.markRecognized()
		handleResult(data, state, result)
	} else if (msgType === ClaudeMessageType.LastPrompt) {
		result.markRecognized()
		state.sawLastPrompt = true
	} else if (msgType === ClaudeMessageType.Error) {
		result.markRecognized()
		const errorMsg = (data.error as string) ?? 'unknown error'
		result.add(`\n${state.sp}${state.renderer.red(`[error] ${errorMsg}`)}`)
	}

	return result
}

export function finalizeClaude(state: ParserState): ParseResult {
	const result = new ParseResult()
	if (!state.sawLastPrompt || state.doneRendered || state.mode !== ParserMode.Replay || !state.pendingSessionId)
		return result

	const usage = state.lastUsage
	const inputTokens =
		(usage.input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0)
	const outputTokens = usage.output_tokens ?? 0
	const stats = `0.0s, $0.0000, ${state.turnCount} turns, ${inputTokens} in / ${outputTokens} out`
	result.add(`\n${state.renderer.dim(`[done] ${stats}`)}\n`)
	state.doneRendered = true
	return result
}
