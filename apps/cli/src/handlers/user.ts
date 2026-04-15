import { INDENT, READ_PREVIEW_LINES, TOOL_RESULT_MAX_CHARS } from "../constants"
import type { ParseResult, ParserState } from "./base"

export function handleUserMessage(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const message = (data.message as Record<string, unknown>) ?? {}
	const content = message.content

	if (typeof content === "string") {
		if (state.mode === "replay" && state.sessionShown) {
			const cleaned = content
				.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
				.replace(/<task-notification>[\s\S]*?<\/task-notification>/g, "")
				.replace(/<local-command-caveat>[\s\S]*?<\/local-command-caveat>/g, "")
				.replace(/<local-command-stdout>[\s\S]*?<\/local-command-stdout>/g, "")
				.replace(/<command-name>[\s\S]*?<\/command-name>/g, "")
				.replace(/<command-message>[\s\S]*?<\/command-message>/g, "")
				.replace(/<command-args>[\s\S]*?<\/command-args>/g, "")
				.replace(/<user-prompt-submit-hook>[\s\S]*?<\/user-prompt-submit-hook>/g, "")
				.trim()
			if (!cleaned) return
			const text = cleaned.slice(0, 200)
			result.add(`\n${r.green("[user]")} ${text}`)
			if (cleaned.length > 200) result.add(r.dim("..."))
			result.add("\n")
		}
		return
	}

	if (!Array.isArray(content) || content.length === 0) return

	const first = content[0] as Record<string, unknown>
	const contentType = (first.type as string) ?? ""

	if (contentType === "tool_result") {
		const rawContent = first.content

		if (typeof rawContent === "string") {
			const toolContent = rawContent
				.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
				.replace(/\[rerun: \w+\]/g, "")
				.trim()
			if (!toolContent) return
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
