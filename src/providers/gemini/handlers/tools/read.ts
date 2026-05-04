import { formatToolOutput } from '../../../../lib/format'
import type { ParseResult } from '../../../../lib/result'
import { GeminiToolLabel } from '../../constants'
import type { GeminiState } from '../../state'

export function handleReadFile(toolCall: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const r = state.renderer
	const args = (toolCall.args as Record<string, unknown>) ?? {}
	const filePath = (args.file_path as string) ?? ''
	result.add(`\n${r.purple(`[${GeminiToolLabel.ReadFile}] ${filePath}`)}\n`)

	const output = extractOutput(toolCall)
	if (output) formatToolOutput(output, r, result)
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
