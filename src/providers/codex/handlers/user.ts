import type { ParseResult } from '../../../lib/result'
import type { CodexState } from '../state'

export function renderUserText(raw: string, state: CodexState, result: ParseResult) {
	const r = state.renderer
	if (!raw) return
	if (state.turnCount > 1) result.add(`\n${r.dim('----')}\n`)
	result.add(`\n${r.green('[user]')} ${raw}`)
	result.add(`\n\n${r.dim('----')}\n`)
	state.initialUserRendered = true
}

export function handleUserMessage(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	state.turnCount++
	const raw = (payload.message as string) ?? ''
	if (!raw) return
	if (!state.sessionShown) {
		state.pendingUserMessage = raw
		return
	}
	renderUserText(raw, state, result)
}
