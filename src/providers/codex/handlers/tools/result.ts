import { TOOL_RESULT_MAX_CHARS } from '../../../../constants'
import type { ParseResult } from '../../../../lib/result'
import type { CodexState } from '../../state'
import { renderToolOutput } from '../render'

export function handleToolResult(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	if (TOOL_RESULT_MAX_CHARS === 0) return
	const output = (payload.output as string) ?? ''
	const outputMatch = output.match(/Output:\n([\s\S]*)/)
	const content = outputMatch ? outputMatch[1] : ''
	renderToolOutput(content, state, result)
}
