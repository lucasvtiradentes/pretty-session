import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'
import { renderToolHeader } from '../render'

export function handleUpdateTopic(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	const title = (args.title as string) ?? ''
	if (!title) return
	renderToolHeader(GeminiToolLabel.UpdateTopic, title, 'dim', state, result)
}
