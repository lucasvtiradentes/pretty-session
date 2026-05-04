import { INDENT } from '../../../../constants'
import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'

export function handleGrepSearch(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const r = state.renderer
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	const pattern = (args.pattern as string) ?? ''
	result.add(`\n${r.purple(`[${GeminiToolLabel.GrepSearch}] ${pattern}`)}\n`)

	const display = (toolCall.resultDisplay as Record<string, unknown>) ?? {}
	const summary = (display.summary as string) ?? ''
	if (summary) result.add(`${INDENT}${r.dim(`→ ${summary}`)}\n`)
}
