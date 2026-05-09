import type { ParseResult } from '../../../../lib/result'
import type { CodexState } from '../../state'
import { renderToolOutput } from '../render'

export function handleToolResult(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const output = getOutputText(payload.output)
	const outputMatch = output.match(/Output:\n([\s\S]*)/)
	const content = outputMatch ? outputMatch[1] : ''
	renderToolOutput(content, state, result)
}

function getOutputText(output: unknown) {
	if (typeof output === 'string') return output
	if (!Array.isArray(output)) return ''

	return output
		.map((block) => {
			if (!block || typeof block !== 'object') return ''
			const text = (block as Record<string, unknown>).text
			return typeof text === 'string' ? text : ''
		})
		.filter(Boolean)
		.join('\n')
}
