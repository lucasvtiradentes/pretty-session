import { INDENT } from '../../../constants'
import { formatToolOutput } from '../../../lib/format'
import { toTildePath } from '../../../lib/home'
import { appendRenderedMarkdown } from '../../../lib/markdown'
import type { ParseResult } from '../../../lib/result'
import type { PiState } from '../state'

export function showSession(state: PiState, result: ParseResult) {
	if (!state.sessionShown) {
		state.sessionShown = true
		const r = state.renderer
		let lines = `[session]\n${INDENT}id:    ${state.sessionId}`
		if (state.sessionFilePath) lines += `\n${INDENT}path:  ${toTildePath(state.sessionFilePath)}`
		if (state.cwd) lines += `\n${INDENT}cwd:   ${toTildePath(state.cwd)}`
		if (state.model) lines += `\n${INDENT}model: ${state.provider ? `${state.provider}/` : ''}${state.model}`
		result.add(`${r.dim(lines)}\n\n${r.dim('----')}\n`)
	}
	flushPendingUserMessage(state, result)
}

export function queueUserText(raw: string, state: PiState) {
	if (!raw) return
	state.pendingUserMessage = raw
}

function flushPendingUserMessage(state: PiState, result: ParseResult) {
	if (!state.pendingUserMessage) return
	const raw = state.pendingUserMessage
	state.pendingUserMessage = ''
	renderUserText(raw, state, result)
}

export function renderUserText(raw: string, state: PiState, result: ParseResult) {
	if (!raw) return
	if (state.turnCount > 0) result.add(`\n${state.renderer.dim('----')}\n`)
	result.add(`\n${state.renderer.green('[user]')} ${raw}`)
	result.add(`\n\n${state.renderer.dim('----')}\n`)
	state.turnCount++
}

export function renderAssistantText(text: string, state: PiState, result: ParseResult) {
	if (!text) return
	showSession(state, result)
	appendRenderedMarkdown(text, state.renderer, result)
}

export function renderToolCall(name: string, args: Record<string, unknown>, state: PiState, result: ParseResult) {
	showSession(state, result)
	const label = name ? `[${name}]` : '[tool]'
	const target = summarizeToolTarget(name, args)
	result.add(`\n${state.renderer.purple(target ? `${label} ${target}` : label)}\n`)
}

export function renderToolResult(content: string, isError: boolean, state: PiState, result: ParseResult) {
	if (!content) return
	formatToolOutput(content.trimEnd(), state.renderer, result)
	if (isError) result.add(`${state.renderer.red(`${INDENT}error`)}\n`)
}

export function renderInfo(label: string, value: string, state: PiState, result: ParseResult) {
	if (!value) return
	showSession(state, result)
	result.add(`\n${state.renderer.orange(`[${label}] ${value}`)}\n`)
}

function summarizeToolTarget(name: string, args: Record<string, unknown>) {
	if (name === 'bash') return stringValue(args.command)
	return stringValue(args.path) ?? stringValue(args.file_path) ?? stringValue(args.filePath) ?? stringValue(args.name)
}

function stringValue(value: unknown) {
	return typeof value === 'string' ? value : undefined
}
