import { INDENT, READ_PREVIEW_LINES, TOOL_RESULT_MAX_CHARS } from '../constants'
import type { Renderer } from './renderer'
import type { ParseResult } from './result'

export function formatToolOutput(content: string, r: Renderer, result: ParseResult, prefix = '') {
	if (TOOL_RESULT_MAX_CHARS === 0) return
	if (!content) return

	if (content.includes('\n')) {
		if (READ_PREVIEW_LINES === 0) return
		const lines = content.split('\n').slice(0, READ_PREVIEW_LINES)
		for (const line of lines) {
			result.add(`${prefix}${r.dim(`${INDENT}→ ${line}`)}\n`)
		}
		if (content.split('\n').length > READ_PREVIEW_LINES) {
			result.add(`${prefix}${INDENT}...\n`)
		}
	} else {
		const text = TOOL_RESULT_MAX_CHARS < 0 ? content : content.slice(0, TOOL_RESULT_MAX_CHARS)
		result.add(`${prefix}${r.dim(`${INDENT}→ ${text}`)}\n`)
	}
}
