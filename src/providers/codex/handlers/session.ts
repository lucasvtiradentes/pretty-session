import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { INDENT } from '../../../constants'
import { findJsonlRecord } from '../../../lib/jsonl'
import type { ParseResult } from '../../../lib/result'
import { CodexEventType } from '../constants'
import type { CodexState } from '../state'
import { renderUserText } from './user'

function buildSessionPath(state: CodexState): string {
	if (!state.sessionTimestamp || !state.timezone) return ''
	const d = new Date(state.sessionTimestamp)
	const local = d.toLocaleString('sv-SE', { timeZone: state.timezone })
	const [datePart, timePart] = local.split(' ')
	const [year, month, day] = datePart.split('-')
	const timeFormatted = timePart.replaceAll(':', '-')
	const home = process.env.HOME ?? ''
	if (!home) return ''
	return `${home}/.codex/sessions/${year}/${month}/${day}/rollout-${datePart}T${timeFormatted}-${state.sessionId}.jsonl`
}

function findSessionPath(sessionId: string): string {
	const home = process.env.HOME ?? ''
	const now = new Date()
	const y = now.getFullYear()
	const m = String(now.getMonth() + 1).padStart(2, '0')
	const d = String(now.getDate()).padStart(2, '0')
	const dir = resolve(home, '.codex', 'sessions', `${y}`, m, d)
	try {
		const match = readdirSync(dir).find((f) => f.includes(sessionId) && f.endsWith('.jsonl'))
		if (match) return resolve(dir, match)
	} catch {}
	return ''
}

function displaySessionPath(path: string) {
	const home = process.env.HOME ?? ''
	if (home && path.startsWith(`${home}/`)) return `~/${path.slice(home.length + 1)}`
	return path
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
	if (path) lines += `\n${INDENT}path:  ${displaySessionPath(path)}`
	lines += `\n${INDENT}model: ${state.model}`
	result.add(`${r.dim(lines)}\n\n`)
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
