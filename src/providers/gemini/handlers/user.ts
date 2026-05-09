import type { ParseResult } from '../../../lib/result'
import type { GeminiState } from '../state'
import { showSession } from './session'

function cleanUserMessage(content: string) {
	return content.replace(/<hook_context>[\s\S]*?<\/hook_context>/g, '').trim()
}

function renderUserText(content: string, state: GeminiState, result: ParseResult) {
	const cleaned = cleanUserMessage(content)
	if (!cleaned) return
	showSession(state, result)
	result.add(`\n${state.renderer.green('[user]')} ${cleaned}`)
	result.add(`\n\n${state.renderer.dim('----')}\n`)
}

function textFromContentParts(content: unknown) {
	if (!Array.isArray(content)) return ''
	return content
		.map((part) => ((part as Record<string, unknown>).text as string) ?? '')
		.filter(Boolean)
		.join('\n')
}

export function handleSavedUserMessage(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	renderUserText(textFromContentParts(data.content), state, result)
}

export function handleStreamUserMessage(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const content = data.content
	if (typeof content === 'string') renderUserText(content, state, result)
	else renderUserText(textFromContentParts(content), state, result)
}
