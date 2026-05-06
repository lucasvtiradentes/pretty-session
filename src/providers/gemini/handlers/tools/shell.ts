import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'
import { renderToolHeader } from '../render'

export function handleShellCommand(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	const command = (args.command as string) ?? ''
	renderToolHeader(GeminiToolLabel.Shell, command, 'purple', state, result)
}
