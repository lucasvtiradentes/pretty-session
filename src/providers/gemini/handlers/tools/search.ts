import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'
import { renderToolHeader, renderToolPreview } from '../render'

export function handleGrepSearch(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	renderToolHeader(GeminiToolLabel.GrepSearch, (args.pattern as string) ?? '', 'purple', state, result)

	const display = (toolCall.resultDisplay as Record<string, unknown>) ?? {}
	renderToolPreview((display.summary as string) ?? '', state, result)
}
