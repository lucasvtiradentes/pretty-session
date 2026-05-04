import { formatToolOutput } from "../../../lib/format"
import { appendRenderedMarkdown } from "../../../lib/markdown"
import type { ParseResult } from "../../../lib/result"
import { CODEX_DEFAULT_MODEL, CodexItemType, CodexMessageType } from "../constants"
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
	const isCompleted = data.type === CodexMessageType.ItemCompleted
	const r = state.renderer

	if (itemType === CodexItemType.AgentMessage && isCompleted) {
		if (!state.sessionShown) showSession(state, result)
		appendRenderedMarkdown((item.text as string) ?? "", r, result)
	} else if (itemType === CodexItemType.CommandExecution) {
		if (!isCompleted) {
			if (!state.sessionShown) showSession(state, result)
			const cmd = extractCmd((item.command as string) ?? "")
			result.add(`\n${r.purple(`[Bash] ${cmd}`)}\n`)
		} else {
			const output = ((item.aggregated_output as string) ?? "").trimEnd()
			formatToolOutput(output, r, result)
		}
	} else if (itemType === CodexItemType.PatchApplication && isCompleted) {
		const filePaths = (item.file_paths as string[]) ?? []
		for (const file of filePaths) {
			result.add(`\n${r.orange(`[Edit] ${file}`)}\n`)
		}
	} else if (itemType === CodexItemType.FileChange && isCompleted) {
		if (!state.sessionShown) showSession(state, result)
		const changes = (item.changes as Array<Record<string, string>>) ?? []
		for (const change of changes) {
			result.add(`\n${r.orange(`[Edit] ${change.path ?? ""}`)}\n`)
		}
	}
}

export function handleThreadStarted(data: Record<string, unknown>, state: CodexState) {
	state.sessionId = (data.thread_id as string) ?? ""
	if (!state.model) state.model = CODEX_DEFAULT_MODEL
}

export function handleTurnCompleted(data: Record<string, unknown>, state: CodexState) {
	const usage = (data.usage as Record<string, number>) ?? {}
	state.lastInputTokens = (usage.input_tokens ?? 0) + (usage.cached_input_tokens ?? 0)
	state.lastOutputTokens = usage.output_tokens ?? 0
}
