import { INDENT } from '../../../constants'
import { formatToolOutput } from '../../../lib/format'
import type { ParseResult } from '../../../lib/result'
import type { GeminiState } from '../state'
import { showSession } from './session'

export type HeaderColor = 'purple' | 'orange' | 'dim'

export function renderAgentText(text: string, state: GeminiState, result: ParseResult) {
	if (!text) return
	showSession(state, result)
	result.add(state.renderer.renderMarkdown(text))
}

export function renderToolHeader(
	label: string,
	body: string,
	color: HeaderColor,
	state: GeminiState,
	result: ParseResult,
) {
	showSession(state, result)
	const colorize = state.renderer[color].bind(state.renderer)
	const text = body ? `[${label}] ${body}` : `[${label}]`
	result.add(`\n${colorize(text)}\n`)
}

export function renderToolPreview(line: string, state: GeminiState, result: ParseResult) {
	if (!line) return
	result.add(`${INDENT}${state.renderer.dim(`→ ${line}`)}\n`)
}

export function renderToolOutput(text: string, state: GeminiState, result: ParseResult) {
	if (!text) return
	formatToolOutput(text, state.renderer, result)
}
