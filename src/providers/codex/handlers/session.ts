import { INDENT } from '../../../constants'
import { toTildePath } from '../../../lib/home'
import { findJsonlRecord } from '../../../lib/jsonl'
import type { ParseResult } from '../../../lib/result'
import { findTodaysCodexSessionPath, getCodexSessionPath } from '../../../lib/session-paths'
import { CodexEventType } from '../constants'
import type { CodexState } from '../state'
import { renderUserText } from './user'

function buildSessionPath(state: CodexState): string {
	return getCodexSessionPath(state.sessionTimestamp, state.timezone, state.sessionId)
}

function findSessionPath(sessionId: string): string {
	return findTodaysCodexSessionPath(sessionId)
}

function flushInitialUserMessage(state: CodexState, result: ParseResult) {
	if (state.initialUserRendered) return

	if (state.pendingUserMessage) {
		renderUserText(state.pendingUserMessage, state, result)
		state.pendingUserMessage = ''
		return
	}

	if (state.initialUserFallbackTried || !state.sessionFilePath) return
	state.initialUserFallbackTried = true
	const record = findJsonlRecord(state.sessionFilePath, (item) => {
		const payload = (item.payload as Record<string, unknown>) ?? {}
		return (
			item.type === 'event_msg' && payload.type === CodexEventType.UserMessage && typeof payload.message === 'string'
		)
	})
	const payload = (record?.payload as Record<string, unknown>) ?? {}
	const message = payload.message
	if (typeof message === 'string') renderUserText(message, state, result)
}

export function showSession(state: CodexState, result: ParseResult) {
	if (state.sessionShown) return
	state.sessionShown = true
	const r = state.renderer
	const path = buildSessionPath(state) || (state.sessionId ? findSessionPath(state.sessionId) : '')
	state.sessionFilePath = path
	let lines = `[session]\n${INDENT}id:    ${state.sessionId}`
	if (path) lines += `\n${INDENT}path:  ${toTildePath(path)}`
	lines += `\n${INDENT}model: ${state.model}`
	result.add(`${r.dim(lines)}\n\n${r.dim('----')}\n`)
	flushInitialUserMessage(state, result)
}

export function handleSessionMeta(payload: Record<string, unknown>, state: CodexState) {
	state.sessionId = (payload.id as string) ?? ''
	state.sessionTimestamp = (payload.timestamp as string) ?? ''
}

export function handleTurnContext(payload: Record<string, unknown>, state: CodexState) {
	if (!state.model) state.model = (payload.model as string) ?? ''
	if (!state.timezone) state.timezone = (payload.timezone as string) ?? ''
}
