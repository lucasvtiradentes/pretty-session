import type { ParseResult } from '../../../lib/result'
import { GeminiToolKind, GeminiToolLabel } from '../constants'
import type { GeminiState } from '../state'
import { type HeaderColor, renderToolHeader, renderToolPreview } from './render'

const KIND_RENDERING: Record<string, { label: string; color: HeaderColor }> = {
	[GeminiToolKind.Execute]: { label: GeminiToolLabel.Shell, color: 'purple' },
	[GeminiToolKind.Read]: { label: GeminiToolLabel.ReadFile, color: 'purple' },
	[GeminiToolKind.Search]: { label: GeminiToolLabel.GrepSearch, color: 'purple' },
	[GeminiToolKind.Edit]: { label: GeminiToolLabel.Edit, color: 'orange' },
	[GeminiToolKind.Delete]: { label: GeminiToolLabel.Delete, color: 'orange' },
	[GeminiToolKind.Move]: { label: GeminiToolLabel.Move, color: 'orange' },
	[GeminiToolKind.Think]: { label: 'Think', color: 'dim' },
	[GeminiToolKind.Other]: { label: GeminiToolLabel.Tool, color: 'purple' },
}

function extractContentText(content: unknown): string {
	if (!Array.isArray(content)) return ''
	const parts: string[] = []
	for (const block of content) {
		if (!block || typeof block !== 'object') continue
		const inner = (block as Record<string, unknown>).content
		if (inner && typeof inner === 'object') {
			const text = (inner as Record<string, unknown>).text
			if (typeof text === 'string' && text) parts.push(text)
		}
		const text = (block as Record<string, unknown>).text
		if (typeof text === 'string' && text) parts.push(text)
	}
	return parts.join('\n').trim()
}

function renderPreviewOnce(id: string, preview: string, state: GeminiState, result: ParseResult) {
	if (!preview) return
	const line = preview.split('\n')[0]
	if (id && state.acpToolCallPreviews.get(id) === line) return
	if (id) state.acpToolCallPreviews.set(id, line)
	renderToolPreview(line, state, result)
}

export function handleAcpToolCall(update: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const id = (update.toolCallId as string) ?? ''
	if (id && state.acpToolCallsRendered.has(id)) return
	if (id) state.acpToolCallsRendered.add(id)

	const kind = (update.kind as string) ?? GeminiToolKind.Other
	const rendering = KIND_RENDERING[kind] ?? KIND_RENDERING[GeminiToolKind.Other]
	const title = (update.title as string) ?? ''
	renderToolHeader(rendering.label, title, rendering.color, state, result)

	const preview = extractContentText(update.content)
	renderPreviewOnce(id, preview, state, result)
}

export function handleAcpToolCallUpdate(update: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	if (!state.acpToolCallsRendered.has((update.toolCallId as string) ?? '')) {
		handleAcpToolCall(update, state, result)
		return
	}
	const preview = extractContentText(update.content)
	renderPreviewOnce((update.toolCallId as string) ?? '', preview, state, result)
}
