import type { ParseResult } from '../../../../lib/result'
import type { GeminiState } from '../../state'
import { renderToolHeader, renderToolPreview } from '../render'

export function handleDefaultTool(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const displayName = (toolCall.displayName as string) ?? (toolCall.name as string) ?? 'Tool'
	const description = (toolCall.description as string) ?? ''
	renderToolHeader(displayName, description, 'purple', state, result)

	const resultDisplay = toolCall.resultDisplay
	if (typeof resultDisplay === 'string') renderToolPreview(resultDisplay, state, result)
}
