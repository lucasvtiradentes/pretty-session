import { INDENT } from '../../../constants'
import { formatToolOutput } from '../../../lib/format'
import { appendRenderedMarkdown } from '../../../lib/markdown'
import type { ParseResult } from '../../../lib/result'
import { CodexToolLabel, PLAN_MARKERS, type PlanItem } from '../constants'
import type { CodexState } from '../state'
import { showSession } from './session'

export function renderBashStart(cmd: string, state: CodexState, result: ParseResult) {
	showSession(state, result)
	result.add(`\n${state.renderer.purple(`[${CodexToolLabel.Bash}] ${cmd}`)}\n`)
}

export function renderToolOutput(output: string, state: CodexState, result: ParseResult) {
	if (!output) return
	formatToolOutput(output.trimEnd(), state.renderer, result)
}

export function renderEdit(file: string, state: CodexState, result: ParseResult) {
	showSession(state, result)
	const label = file ? `[${CodexToolLabel.Edit}] ${file}` : `[${CodexToolLabel.Edit}]`
	result.add(`\n${state.renderer.orange(label)}\n`)
}

export function renderStdin(sessionId: string, state: CodexState, result: ParseResult) {
	showSession(state, result)
	result.add(`\n${state.renderer.purple(`[${CodexToolLabel.Stdin}] session=${sessionId}`)}\n`)
}

export function renderAgentMarkdown(text: string, state: CodexState, result: ParseResult) {
	if (!text) return
	showSession(state, result)
	appendRenderedMarkdown(text, state.renderer, result)
}

export function renderPlan(items: PlanItem[], state: CodexState, result: ParseResult) {
	if (items.length === 0) return
	showSession(state, result)
	result.add(`\n${state.renderer.purple(`[${CodexToolLabel.Plan}]`)}\n`)
	for (const item of items) {
		const marker = PLAN_MARKERS[item.status] ?? PLAN_MARKERS.pending
		result.add(`${INDENT}${marker} ${item.text}\n`)
	}
}
