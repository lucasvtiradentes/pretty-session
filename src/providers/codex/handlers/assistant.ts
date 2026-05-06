import type { ParseResult } from '../../../lib/result'
import { CodexBlockType } from '../constants'
import type { CodexState } from '../state'
import { renderAgentMarkdown } from './render'

export function handleAssistant(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const content = payload.content as Array<Record<string, unknown>>
	if (!Array.isArray(content)) return

	for (const block of content) {
		if (block.type !== CodexBlockType.OutputText) continue
		renderAgentMarkdown((block.text as string) ?? '', state, result)
	}
}
