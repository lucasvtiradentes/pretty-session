import { INDENT, READ_PREVIEW_LINES, TOOL_RESULT_MAX_CHARS } from "../../../../constants"
import type { ParseResult } from "../../../../result"
import type { CodexState } from "../../state"

export function handleToolResult(payload: Record<string, unknown>, state: CodexState, result: ParseResult) {
	if (TOOL_RESULT_MAX_CHARS === 0) return
	const output = (payload.output as string) ?? ""
	const r = state.renderer

	const outputMatch = output.match(/Output:\n([\s\S]*)/)
	const content = outputMatch ? outputMatch[1].trimEnd() : ""
	if (!content) return

	if (content.includes("\n")) {
		if (READ_PREVIEW_LINES === 0) return
		const lines = content.split("\n").slice(0, READ_PREVIEW_LINES)
		for (const line of lines) {
			result.add(`${r.dim(`${INDENT}→ ${line}`)}\n`)
		}
		if (content.split("\n").length > READ_PREVIEW_LINES) {
			result.add(`${INDENT}...\n`)
		}
	} else {
		const text = TOOL_RESULT_MAX_CHARS < 0 ? content : content.slice(0, TOOL_RESULT_MAX_CHARS)
		result.add(`${r.dim(`${INDENT}→ ${text}`)}\n`)
	}
}
