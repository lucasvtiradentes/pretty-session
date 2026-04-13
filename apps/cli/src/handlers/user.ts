import { INDENT, READ_PREVIEW_LINES, TOOL_RESULT_MAX_CHARS } from "../constants.js"
import type { ParseResult, ParserState } from "./base.js"

export function handleUserMessage(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const message = (data.message as Record<string, unknown>) ?? {}
	const content = message.content

	if (typeof content === "string") {
		if (state.mode === "replay") {
			const text = content.slice(0, 200)
			result.add(`\n${r.green("[user]")} ${text}`)
			if (content.length > 200) result.add(r.dim("..."))
			result.add("\n")
		}
		return
	}

	if (!Array.isArray(content) || content.length === 0) return

	const first = content[0] as Record<string, unknown>
	const contentType = (first.type as string) ?? ""

	if (contentType === "tool_result") {
		const toolContent = first.content

		if (typeof toolContent === "string") {
			if (
				(toolContent.startsWith("Todos have been") || toolContent.startsWith("The file")) &&
				toolContent.includes("has been")
			) {
				return
			}
			if (toolContent.includes("<tool_use_error>")) {
				const errorMsg = toolContent.replace(/<[^>]*>/g, "")
				result.add(`${state.sp}${r.red(`${INDENT}✗ ${errorMsg}`)}\n\n`)
				return
			}

			if (toolContent.includes("\n")) {
				if (READ_PREVIEW_LINES === 0) return
				const lines = toolContent.split("\n").slice(0, READ_PREVIEW_LINES)
				for (const line of lines) {
					result.add(`${state.sp}${r.dim(`${INDENT}→ ${line}`)}\n`)
				}
				if (toolContent.split("\n").length > READ_PREVIEW_LINES) {
					result.add(`${state.sp}${INDENT}...\n`)
				}
				result.add("\n")
			} else {
				if (TOOL_RESULT_MAX_CHARS === 0) return
				const text = TOOL_RESULT_MAX_CHARS < 0 ? toolContent : toolContent.slice(0, TOOL_RESULT_MAX_CHARS)
				result.add(`${state.sp}${r.dim(`${INDENT}→ ${text}`)}\n\n`)
			}
		}
	}
}
