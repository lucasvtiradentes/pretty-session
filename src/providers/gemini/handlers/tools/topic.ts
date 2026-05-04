import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'

export function handleUpdateTopic(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const r = state.renderer
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	const title = (args.title as string) ?? ''
	if (!title) return
	result.add(`\n${r.dim(`[${GeminiToolLabel.UpdateTopic}] ${title}`)}\n`)
}
