import type { ParseResult } from '../../../lib/result'
import { CODEX_DEFAULT_MODEL, CodexItemType, ITEM_TYPE_ALIASES, type PlanItem, type PlanStatus } from '../constants'
import type { CodexState } from '../state'
import { renderAgentMarkdown, renderBashStart, renderEdit, renderPlan, renderToolOutput } from './render'

function extractCmd(command: string): string {
	const singleQuoted = command.match(/^\/bin\/\w+ -\w+c '([\s\S]+)'$/)
	if (singleQuoted) return singleQuoted[1]
	const doubleQuoted = command.match(/^\/bin\/\w+ -\w+c "([\s\S]+)"$/)
	if (doubleQuoted) return doubleQuoted[1]
	const unquoted = command.match(/^\/bin\/\w+ -\w+c (.+)$/)
	if (unquoted) return unquoted[1]
	return command
}

function fieldOr(item: Record<string, unknown>, snake: string, camel: string): unknown {
	return item[snake] ?? item[camel]
}

function num(value: unknown): number {
	return typeof value === 'number' ? value : 0
}

export function applyTokenUsage(state: CodexState, usage: Record<string, unknown>) {
	const input =
		num(fieldOr(usage, 'input_tokens', 'inputTokens')) + num(fieldOr(usage, 'cached_input_tokens', 'cachedInputTokens'))
	const output =
		num(fieldOr(usage, 'output_tokens', 'outputTokens')) +
		num(fieldOr(usage, 'reasoning_output_tokens', 'reasoningOutputTokens'))
	state.lastInputTokens = input
	state.lastOutputTokens = output
}

export function flushStreamingText(state: CodexState, result: ParseResult) {
	if (!state.streamingAssistantText) return
	const buffered = state.streamingAssistantText
	state.streamingAssistantText = ''
	renderAgentMarkdown(buffered, state, result)
}

export function handleStreamItem(
	rawItem: Record<string, unknown>,
	isCompleted: boolean,
	state: CodexState,
	result: ParseResult,
) {
	const itemType = ITEM_TYPE_ALIASES[(rawItem.type as string) ?? '']
	if (!itemType) return

	if (itemType === CodexItemType.AgentMessage) {
		if (!isCompleted) return
		if (state.streamingAssistantText) flushStreamingText(state, result)
		else renderAgentMarkdown((rawItem.text as string) ?? '', state, result)
		return
	}

	if (itemType === CodexItemType.CommandExecution) {
		if (!isCompleted) {
			flushStreamingText(state, result)
			renderBashStart(extractCmd((rawItem.command as string) ?? ''), state, result)
		} else {
			renderToolOutput((fieldOr(rawItem, 'aggregated_output', 'aggregatedOutput') as string) ?? '', state, result)
		}
		return
	}

	if (itemType === CodexItemType.PatchApplication && isCompleted) {
		const filePaths = (fieldOr(rawItem, 'file_paths', 'filePaths') as string[]) ?? []
		for (const file of filePaths) renderEdit(file, state, result)
		return
	}

	if (itemType === CodexItemType.FileChange && isCompleted) {
		const changes = (rawItem.changes as Array<Record<string, string>>) ?? []
		for (const change of changes) renderEdit(change.path ?? '', state, result)
		return
	}

	if (itemType === CodexItemType.TodoList && isCompleted) {
		const rawItems = (rawItem.items as Array<Record<string, unknown>>) ?? []
		const items: PlanItem[] = rawItems.map((it) => ({
			text: (it.text as string) ?? '',
			status: (it.completed ? 'completed' : 'pending') as PlanStatus,
		}))
		renderPlan(items, state, result)
	}
}

export function handleThreadStarted(data: Record<string, unknown>, state: CodexState) {
	state.sessionId = (data.thread_id as string) ?? ''
	if (!state.model) state.model = CODEX_DEFAULT_MODEL
}

export function handleTurnCompleted(data: Record<string, unknown>, state: CodexState) {
	applyTokenUsage(state, (data.usage as Record<string, unknown>) ?? {})
}
