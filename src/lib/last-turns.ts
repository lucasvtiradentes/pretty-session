import { Provider } from '../constants'
import { parseJsonRecord } from './json'

export function lastTurnsLines(provider: Provider, lines: string[], count: number): string[] {
	const startIndex = lastRealUserMessageIndexes(provider, lines).at(-Math.max(1, count))
	if (startIndex === undefined) return lines
	return [...metadataLinesBefore(provider, lines, startIndex), ...lines.slice(startIndex)]
}

function metadataLinesBefore(provider: Provider, lines: string[], startIndex: number): string[] {
	return lines.slice(0, startIndex).filter((line) => isSessionMetadata(provider, line))
}

function lastRealUserMessageIndexes(provider: Provider, lines: string[]): number[] {
	return lines
		.map((line, index) => (isRealUserMessage(provider, line) ? index : undefined))
		.filter((index): index is number => index !== undefined)
}

function isSessionMetadata(provider: Provider, line: string): boolean {
	const record = parseJsonRecord(line.trim())
	if (!record) return false
	if (provider === Provider.Claude) return isClaudeMetadata(record)
	if (provider === Provider.Codex) return isCodexMetadata(record)
	if (provider === Provider.Gemini) return isGeminiMetadata(record)
	if (provider === Provider.Pi) return isPiMetadata(record)
	return false
}

function isRealUserMessage(provider: Provider, line: string): boolean {
	const record = parseJsonRecord(line.trim())
	if (!record) return false
	if (provider === Provider.Claude) return isClaudeUserPrompt(record)
	if (provider === Provider.Codex) return isCodexUserPrompt(record)
	if (provider === Provider.Gemini) return isGeminiUserPrompt(record)
	if (provider === Provider.Pi) return isPiUserPrompt(record)
	return false
}

function isClaudeMetadata(record: Record<string, unknown>): boolean {
	return record.type === 'system' && record.subtype === 'init'
}

function isCodexMetadata(record: Record<string, unknown>): boolean {
	const result = recordValue(record.result)
	const thread = recordValue(result.thread)
	return Boolean(thread.id) || record.type === 'session_meta' || record.type === 'turn_context'
}

function isGeminiMetadata(record: Record<string, unknown>): boolean {
	if (record.kind === 'main' && record.sessionId) return true
	if (record.type === 'init') return true
	const result = recordValue(record.result)
	return Boolean(result.sessionId || result.models)
}

function isPiMetadata(record: Record<string, unknown>): boolean {
	return record.type === 'session' || record.type === 'model_change' || record.type === 'thinking_level_change'
}

function isClaudeUserPrompt(record: Record<string, unknown>): boolean {
	if (record.type !== 'user') return false
	const message = recordValue(record.message)
	return isPromptContent(message.content)
}

function isCodexUserPrompt(record: Record<string, unknown>): boolean {
	const payload = recordValue(record.payload)
	if (record.type === 'event_msg' && payload.type === 'user_message') return typeof payload.message === 'string'
	if (record.type === 'response_item' && payload.type === 'message' && payload.role === 'user') return true
	const item = recordValue(record.item)
	return record.type === 'item.completed' && item.type === 'message' && item.role === 'user'
}

function isGeminiUserPrompt(record: Record<string, unknown>): boolean {
	if (record.type === 'user') return isPromptContent(record.message ?? record.content)
	return record.type === 'message' && record.role === 'user' && isPromptContent(record.content)
}

function isPiUserPrompt(record: Record<string, unknown>): boolean {
	if (record.type === 'event_msg') {
		const payload = recordValue(record.payload)
		return payload.type === 'user_message' && typeof payload.message === 'string'
	}
	if (record.type !== 'message') return false
	const message = recordValue(record.message)
	return message.role === 'user' && isPromptContent(message.content)
}

function isPromptContent(content: unknown): boolean {
	if (typeof content === 'string') return content.trim().length > 0
	if (!Array.isArray(content)) return false
	const blocks = content.filter(isRecord)
	if (blocks.length === 0) return false
	return blocks.some((block) => block.type !== 'tool_result')
}

function recordValue(value: unknown): Record<string, unknown> {
	return isRecord(value) ? value : {}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}
