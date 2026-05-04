import { INDENT } from "../../constants"
import { AnsiRenderer } from "../../renderers/ansi"
import type { Renderer } from "../../renderers/base"
import { ParseResult } from "../../result"
import {
	GEMINI_DEFAULT_MODEL,
	GEMINI_SESSION_UPDATE_METHOD,
	GeminiMessageType,
	GeminiRole,
	GeminiUpdateType,
} from "./constants"

export class GeminiState {
	sessionShown = false
	sessionId = ""
	model = GEMINI_DEFAULT_MODEL
	turnCount = 0
	hasSessionTurns = false
	renderer: Renderer
	lastInputTokens = 0
	lastOutputTokens = 0

	constructor() {
		this.renderer = new AnsiRenderer()
	}
}

export function parseGeminiLine(line: string, state: GeminiState): ParseResult {
	const result = new ParseResult()

	let data: Record<string, unknown>
	try {
		data = JSON.parse(line)
	} catch {
		return result
	}

	const rpcResult = (data.result as Record<string, unknown>) ?? {}
	const models = (rpcResult.models as Record<string, unknown>) ?? {}
	if (rpcResult.sessionId) state.sessionId = (rpcResult.sessionId as string) ?? ""
	if (models.currentModelId) state.model = (models.currentModelId as string) ?? state.model
	const meta = (rpcResult._meta as Record<string, unknown>) ?? {}
	const quota = (meta.quota as Record<string, unknown>) ?? {}
	const tokenCount = (quota.token_count as Record<string, number>) ?? {}
	if (tokenCount.input_tokens || tokenCount.output_tokens) {
		state.lastInputTokens = tokenCount.input_tokens ?? 0
		state.lastOutputTokens = tokenCount.output_tokens ?? 0
	}

	if (data.sessionId) {
		state.sessionId = (data.sessionId as string) ?? state.sessionId
	}

	const type = (data.type as string) ?? ""
	if (type === GeminiMessageType.Gemini) {
		state.model = (data.model as string) ?? state.model
		const tokens = (data.tokens as Record<string, number>) ?? {}
		state.lastInputTokens = tokens.input ?? 0
		state.lastOutputTokens = (tokens.output ?? 0) + (tokens.thoughts ?? 0)
		state.turnCount++
		state.hasSessionTurns = true
		showGeminiSession(state, result)
		renderGeminiMessage(data, state, result)
		return result
	}

	if (type === GeminiMessageType.Init) {
		state.sessionId = (data.session_id as string) ?? state.sessionId
		state.model = (data.model as string) ?? state.model
		return result
	}

	if (type === GeminiMessageType.Message) {
		state.sessionId = (data.session_id as string) ?? state.sessionId
		state.model = (data.model as string) ?? state.model
		if (data.role !== GeminiRole.Assistant) return result
		showGeminiSession(state, result)
		const raw = (data.content as string) ?? ""
		if (raw) result.add(state.renderer.renderMarkdown(raw))
		return result
	}

	if (type === GeminiMessageType.Result) {
		const stats = (data.stats as Record<string, number>) ?? {}
		state.lastInputTokens = stats.input_tokens ?? stats.input ?? 0
		state.lastOutputTokens = stats.output_tokens ?? 0
		return result
	}

	const method = (data.method as string) ?? ""
	if (method !== GEMINI_SESSION_UPDATE_METHOD) return result

	const params = (data.params as Record<string, unknown>) ?? {}
	if (params.sessionId) state.sessionId = (params.sessionId as string) ?? state.sessionId

	const update = (params.update as Record<string, unknown>) ?? {}
	const updateType = (update.sessionUpdate as string) ?? ""

	if (updateType === GeminiUpdateType.AgentMessageChunk) {
		showGeminiSession(state, result)
		const content = (update.content as Record<string, unknown>) ?? {}
		const raw = (content.text as string) ?? ""
		if (!raw) return result
		result.add(state.renderer.renderMarkdown(raw))
	} else if (updateType === GeminiUpdateType.UsageUpdate) {
		const usage = (update.usage as Record<string, number>) ?? {}
		state.lastInputTokens = (usage.inputTokens ?? usage.input_tokens ?? 0) + (usage.cachedInputTokens ?? 0)
		state.lastOutputTokens = usage.outputTokens ?? usage.output_tokens ?? 0
	}

	return result
}

export function finalizeGemini(state: GeminiState): ParseResult {
	const result = new ParseResult()
	if (!state.sessionShown) return result

	if (!state.hasSessionTurns) state.turnCount += 1
	const stats = `${state.turnCount} turns, ${state.lastInputTokens} in / ${state.lastOutputTokens} out`
	result.add(`\n\n${state.renderer.dim(`[done] ${stats}`)}\n`)
	return result
}

function showGeminiSession(state: GeminiState, result: ParseResult) {
	if (state.sessionShown) return
	state.sessionShown = true
	const lines = `[session]\n${INDENT}id:    ${state.sessionId}\n${INDENT}model: ${state.model}`
	result.add(`${state.renderer.dim(lines)}\n\n`)
}

function renderGeminiMessage(data: Record<string, unknown>, state: GeminiState, result: ParseResult) {
	const raw = (data.content as string) ?? ""
	if (raw) result.add(state.renderer.renderMarkdown(raw))

	const toolCalls = (data.toolCalls as Record<string, unknown>[]) ?? []
	for (const toolCall of toolCalls) {
		const displayName = (toolCall.displayName as string) ?? (toolCall.name as string) ?? "Tool"
		const description = (toolCall.description as string) ?? ""
		const resultDisplay = (toolCall.resultDisplay as string) ?? ""
		result.add(`\n\n${state.renderer.purple(`[${displayName}] ${description}`)}`)
		if (resultDisplay) result.add(`\n${INDENT}${state.renderer.dim("→")} ${resultDisplay}`)
		result.add("\n")
	}
}
