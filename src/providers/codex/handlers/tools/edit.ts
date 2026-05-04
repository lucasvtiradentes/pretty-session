import type { ParseResult } from '../../../../lib/result'
import type { CodexState } from '../../state'

export function handleEdit(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const r = state.renderer
	const input = (payload.input as string) ?? ''
	const files = [...input.matchAll(/\*\*\* (?:Update|Create|Add|Delete) File: (.+)/g)].map((m) => m[1])

	if (files.length > 0) {
		for (const file of files) {
			result.add(`\n${r.orange(`[Edit] ${file}`)}\n`)
		}
	} else {
		result.add(`\n${r.orange('[Edit]')}\n`)
	}
}
