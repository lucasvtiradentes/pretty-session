import { appendRenderedMarkdown } from '../../../lib/markdown'
import type { ParseResult } from '../../../lib/result'
import { CodexBlockType } from '../constants'
import type { CodexState } from '../state'
import { showSession } from './session'

export function handleAssistant(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	if (!state.sessionShown) showSession(state, result)

	const content = payload.content as Array<Record<string, unknown>>
	if (!Array.isArray(content)) return

	for (const block of content) {
		if (block.type !== CodexBlockType.OutputText) continue
		appendRenderedMarkdown((block.text as string) ?? '', state.renderer, result)
	}
}
