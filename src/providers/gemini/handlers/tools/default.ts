import { INDENT } from '../../../../constants'
import type { ParseResult } from '../../../../lib/result'
import type { GeminiState } from '../../state'

export function handleDefaultTool(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const r = state.renderer
	const displayName = (toolCall.displayName as string) ?? (toolCall.name as string) ?? 'Tool'
	const description = (toolCall.description as string) ?? ''
	result.add(`\n${r.purple(`[${displayName}] ${description}`)}`)
	const resultDisplay = toolCall.resultDisplay
	if (typeof resultDisplay === 'string' && resultDisplay) {
		result.add(`\n${INDENT}${r.dim('→')} ${resultDisplay}`)
	}
	result.add('\n')
}
