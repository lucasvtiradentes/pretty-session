import type { ParseResult } from '../../../../lib/result'
import type { CodexState } from '../../state'
import { renderEdit } from '../render'

export function handleEdit(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const input = (payload.input as string) ?? ''
	const files = [...input.matchAll(/\*\*\* (?:Update|Create|Add|Delete) File: (.+)/g)].map((m) => m[1])

	if (files.length === 0) {
		renderEdit('', state, result)
		return
	}
	for (const file of files) renderEdit(file, state, result)
}
