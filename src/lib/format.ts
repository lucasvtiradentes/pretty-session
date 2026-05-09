import { INDENT, TOOL_RESULT_LINES } from '../constants'
import type { Renderer } from './renderer'
import type { ParseResult } from './result'

export function formatToolOutput(content: string, r: Renderer, result: ParseResult, prefix = '') {
	if (!content) return
	if (TOOL_RESULT_LINES === 0) return

	if (content.includes('\n')) {
		const lines = content.split('\n').slice(0, TOOL_RESULT_LINES)
		for (const line of lines) {
			result.add(`${prefix}${r.dim(`${INDENT}→ ${line}`)}\n`)
		}
		if (content.split('\n').length > TOOL_RESULT_LINES) {
			result.add(`${prefix}${INDENT}...\n`)
		}
	} else {
		result.add(`${prefix}${r.dim(`${INDENT}→ ${content}`)}\n`)
	}
}
