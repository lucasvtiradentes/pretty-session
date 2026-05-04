import { INDENT, USER_MESSAGE_MAX_CHARS } from "../../../constants"
import { formatToolOutput } from "../../../lib/format"
import type { ParseResult } from "../../../lib/result"
import { ContentType, ParserMode } from "../constants"
import type { ParserState } from "../state"

export function handleUserMessage(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const message = (data.message as Record<string, unknown>) ?? {}
	const content = message.content

	if (typeof content === "string") {
		if (state.mode === ParserMode.Replay && state.sessionShown) {
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
			const text = cleaned.slice(0, USER_MESSAGE_MAX_CHARS)
			if (state.turnCount > 1) result.add(`\n${r.dim("----")}\n`)
			result.add(`\n${r.green("[user]")} ${text}`)
			if (cleaned.length > USER_MESSAGE_MAX_CHARS) result.add(r.dim("..."))
			result.add(`\n\n${r.dim("----")}\n`)
		}
		return
	}

	if (!Array.isArray(content) || content.length === 0) return

	const first = content[0] as Record<string, unknown>
	const contentType = (first.type as string) ?? ""

	if (contentType === ContentType.ToolResult) {
		const rawContent = first.content

		if (typeof rawContent === "string") {
			const toolContent = rawContent
				.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
				.replace(/\[rerun: \w+\]/g, "")
				.trim()
			if (!toolContent) return
			if (
				(toolContent.startsWith("Todos have been") || toolContent.startsWith("The file")) &&
				(toolContent.includes("has been") || toolContent.includes("have been"))
			) {
				return
			}
			if (toolContent.includes("<tool_use_error>")) {
				const errorMsg = toolContent.replace(/<[^>]*>/g, "")
				result.add(`${state.sp}${r.red(`${INDENT}✗ ${errorMsg}`)}\n`)
				return
			}

			formatToolOutput(toolContent, r, result, state.sp)
		}
	}
}
