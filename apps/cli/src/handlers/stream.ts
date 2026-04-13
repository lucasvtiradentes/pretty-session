import { HIDE_TOOLS } from "../constants"
import type { ParseResult, ParserState } from "./base"

export function handleStreamEvent(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const event = (data.event as Record<string, unknown>) ?? {}
	const eventType = (event.type as string) ?? ""

	if (eventType === "content_block_start") {
		if (state.subagentDepth > 0) {
			state.decrementDepth()
		}

		const block = (event.content_block as Record<string, unknown>) ?? {}
		if (block.type === "tool_use") {
			const name = (block.name as string) ?? ""
			state.currentTool = name
			if (!HIDE_TOOLS.has(name)) {
				result.add(`\n${state.sp}${r.purple(`[${name}]`)} `)
			}
		}
	} else if (eventType === "content_block_delta") {
		const delta = (event.delta as Record<string, unknown>) ?? {}
		const deltaType = (delta.type as string) ?? ""

		if (deltaType === "text_delta") {
			result.add(state.renderText((delta.text as string) ?? ""))
		} else if (deltaType === "input_json_delta") {
			if (!HIDE_TOOLS.has(state.currentTool)) {
				result.add((delta.partial_json as string) ?? "")
			}
		}
	} else if (eventType === "content_block_stop") {
		if (!HIDE_TOOLS.has(state.currentTool)) {
			result.add(`${r.styleReset()}\n`)
		}
		state.currentTool = ""
	} else if (eventType === "error") {
		const error = event.error ?? String(event)
		result.add(`\n${state.sp}${r.red(`[error] ${error}`)}\n`)
	}
}
