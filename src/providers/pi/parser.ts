import { parseJsonRecord } from '../../lib/json'
import { ParseResult } from '../../lib/result'
import { PiBlockType, PiEntryType, PiMessageRole } from './constants'
import {
	queueUserText,
	renderAssistantText,
	renderInfo,
	renderToolCall,
	renderToolResult,
	showSession,
} from './handlers/render'
import type { PiState } from './state'

export function parsePiLine(line: string, state: PiState): ParseResult {
	const result = new ParseResult()
	const entry = parseJsonRecord(line)
	if (!entry) return result

	const type = stringValue(entry.type)
	if (!type) return result
	result.markRecognized()

	if (type === PiEntryType.Session) {
		state.sessionId = stringValue(entry.id) ?? ''
		state.cwd = stringValue(entry.cwd) ?? ''
		state.sessionFilePath = stringValue(entry.path) ?? state.sessionFilePath
		return result
	}

	if (type === PiEntryType.ModelChange) {
		state.provider = stringValue(entry.provider) ?? state.provider
		state.model = stringValue(entry.modelId) ?? state.model
		return result
	}

	if (type === PiEntryType.ThinkingLevelChange) return result

	if (type === PiEntryType.Compaction) {
		renderInfo('Compaction', stringValue(entry.summary) ?? '', state, result)
		return result
	}

	if (type === PiEntryType.BranchSummary) {
		renderInfo('Branch', stringValue(entry.summary) ?? '', state, result)
		return result
	}

	if (type === PiEntryType.CustomMessage) {
		if (entry.display === true)
			renderInfo(stringValue(entry.customType) ?? 'custom', contentToText(entry.content), state, result)
		return result
	}

	if (type === PiEntryType.Message) {
		handleMessage(recordValue(entry.message), state, result)
		return result
	}

	if (type === 'message_end') {
		handleMessage(recordValue(entry.message), state, result)
		return result
	}

	if (type === 'event_msg') {
		handleEventMessage(recordValue(entry.payload), state, result)
	}

	return result
}

function handleEventMessage(payload: Record<string, unknown>, state: PiState, result: ParseResult) {
	if (stringValue(payload.type) === 'user_message') queueUserText(stringValue(payload.message) ?? '', state)
}

function handleMessage(message: Record<string, unknown>, state: PiState, result: ParseResult) {
	const role = stringValue(message.role)
	if (role === PiMessageRole.User) {
		queueUserText(contentToText(message.content), state)
		return
	}

	if (role === PiMessageRole.Assistant) {
		state.provider = stringValue(message.provider) ?? state.provider
		state.model = stringValue(message.model) ?? state.model
		applyUsage((message.usage as Record<string, unknown>) ?? {}, state)
		for (const block of arrayRecords(message.content)) {
			const type = stringValue(block.type)
			if (type === PiBlockType.Text) renderAssistantText(stringValue(block.text) ?? '', state, result)
			if (type === PiBlockType.ToolCall)
				renderToolCall(stringValue(block.name) ?? '', recordValue(block.arguments), state, result)
		}
		return
	}

	if (role === PiMessageRole.ToolResult) {
		renderToolResult(contentToText(message.content), message.isError === true, state, result)
		return
	}

	if (role === PiMessageRole.BashExecution) {
		renderToolCall('bash', { command: message.command }, state, result)
		renderToolResult(stringValue(message.output) ?? '', Boolean(message.exitCode), state, result)
		return
	}

	if (role === PiMessageRole.BranchSummary) renderInfo('Branch', stringValue(message.summary) ?? '', state, result)
	if (role === PiMessageRole.CompactionSummary)
		renderInfo('Compaction', stringValue(message.summary) ?? '', state, result)
	if (role === PiMessageRole.Custom && message.display === true) {
		renderInfo(stringValue(message.customType) ?? 'custom', contentToText(message.content), state, result)
	}
}

function applyUsage(usage: Record<string, unknown>, state: PiState) {
	state.lastInputTokens = numberValue(usage.input)
	state.lastOutputTokens = numberValue(usage.output)
}

function contentToText(content: unknown): string {
	if (typeof content === 'string') return content
	return arrayRecords(content)
		.map((block) => stringValue(block.text) ?? stringValue(block.thinking) ?? '')
		.filter(Boolean)
		.join('\n')
}

function arrayRecords(value: unknown): Record<string, unknown>[] {
	return Array.isArray(value) ? value.filter(isRecord) : []
}

function recordValue(value: unknown): Record<string, unknown> {
	return isRecord(value) ? value : {}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown) {
	return typeof value === 'string' ? value : undefined
}

function numberValue(value: unknown) {
	return typeof value === 'number' ? value : 0
}
