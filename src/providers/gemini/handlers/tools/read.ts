import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'
import { renderToolHeader, renderToolOutput } from '../render'

export function handleReadFile(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	const filePath = (args.file_path as string) ?? ''
	renderToolHeader(GeminiToolLabel.ReadFile, filePath, 'purple', state, result)
	renderToolOutput(extractOutput(toolCall), state, result)
}

function extractOutput(toolCall: Record<string, unknown>): string {
	const responses = toolCall.result as Record<string, unknown>[] | undefined
	if (!Array.isArray(responses)) return ''
	for (const item of responses) {
		const fr = (item.functionResponse as Record<string, unknown>) ?? {}
		const resp = (fr.response as Record<string, unknown>) ?? {}
		if (typeof resp.output === 'string') return resp.output
	}
	return ''
}
