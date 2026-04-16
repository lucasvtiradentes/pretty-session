import { INDENT, READ_PREVIEW_LINES, TOOL_RESULT_MAX_CHARS } from "../../../constants"
import type { ParseResult } from "../../../result"
import type { CodexState } from "../state"
import { showSession } from "./session"

function extractCmd(command: string): string {
	const quoted = command.match(/^\/bin\/\w+ -\w+c '([\s\S]+)'$/)
	if (quoted) return quoted[1]
	const unquoted = command.match(/^\/bin\/\w+ -\w+c (.+)$/)
	if (unquoted) return unquoted[1]
	return command
}

export function handleStreamItem(data: Record<string, unknown>, state: CodexState, result: ParseResult) {
	const item = (data.item as Record<string, unknown>) ?? {}
	const itemType = (item.type as string) ?? ""
	const isCompleted = data.type === "item.completed"
	const r = state.renderer

	if (itemType === "agent_message" && isCompleted) {
		if (!state.sessionShown) showSession(state, result)
		const raw = ((item.text as string) ?? "").replace(/^\n+|\n+$/g, "")
		if (!raw) return
		const rendered = r.renderMarkdown(raw).replace(/\n+$/, "")
		if (rendered) result.add(`\n${rendered}\n`)
	} else if (itemType === "command_execution") {
		if (!isCompleted) {
			if (!state.sessionShown) showSession(state, result)
			const cmd = extractCmd((item.command as string) ?? "")
			result.add(`\n${r.purple(`[Bash] ${cmd}`)}\n`)
		} else {
			if (TOOL_RESULT_MAX_CHARS === 0) return
			const output = ((item.aggregated_output as string) ?? "").trimEnd()
			if (!output) return

			if (output.includes("\n")) {
				if (READ_PREVIEW_LINES === 0) return
				const lines = output.split("\n").slice(0, READ_PREVIEW_LINES)
				for (const line of lines) {
					result.add(`${r.dim(`${INDENT}→ ${line}`)}\n`)
				}
				if (output.split("\n").length > READ_PREVIEW_LINES) {
					result.add(`${INDENT}...\n`)
				}
			} else {
				const text = TOOL_RESULT_MAX_CHARS < 0 ? output : output.slice(0, TOOL_RESULT_MAX_CHARS)
				result.add(`${r.dim(`${INDENT}→ ${text}`)}\n`)
			}
		}
	} else if (itemType === "patch_application" && isCompleted) {
		const filePaths = (item.file_paths as string[]) ?? []
		for (const file of filePaths) {
			result.add(`\n${r.orange(`[Edit] ${file}`)}\n`)
		}
	} else if (itemType === "file_change" && isCompleted) {
		if (!state.sessionShown) showSession(state, result)
		const changes = (item.changes as Array<Record<string, string>>) ?? []
		for (const change of changes) {
			result.add(`\n${r.orange(`[Edit] ${change.path ?? ""}`)}\n`)
		}
	}
}

export function handleThreadStarted(data: Record<string, unknown>, state: CodexState) {
	state.sessionId = (data.thread_id as string) ?? ""
}

export function handleTurnCompleted(data: Record<string, unknown>, state: CodexState) {
	const usage = (data.usage as Record<string, number>) ?? {}
	state.lastInputTokens = (usage.input_tokens ?? 0) + (usage.cached_input_tokens ?? 0)
	state.lastOutputTokens = usage.output_tokens ?? 0
}
