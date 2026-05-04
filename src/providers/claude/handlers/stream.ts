import { BlockType, DeltaType, HIDE_TOOLS, StreamEventType } from "../constants"
import type { ParseResult, ParserState } from "./base"

export function handleStreamEvent(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const r = state.renderer
	const event = (data.event as Record<string, unknown>) ?? {}
	const eventType = (event.type as string) ?? ""

	if (eventType === StreamEventType.ContentBlockStart) {
		if (state.subagentDepth > 0) {
			state.decrementDepth()
		}

		const block = (event.content_block as Record<string, unknown>) ?? {}
		if (block.type === BlockType.ToolUse) {
			const name = (block.name as string) ?? ""
			state.currentTool = name
			if (!HIDE_TOOLS.has(name)) {
				result.add(`\n${state.sp}${r.purple(`[${name}]`)} `)
			}
		}
	} else if (eventType === StreamEventType.ContentBlockDelta) {
		const delta = (event.delta as Record<string, unknown>) ?? {}
		const deltaType = (delta.type as string) ?? ""

		if (deltaType === DeltaType.TextDelta) {
			result.add(state.renderText((delta.text as string) ?? ""))
		} else if (deltaType === DeltaType.InputJsonDelta) {
			if (!HIDE_TOOLS.has(state.currentTool)) {
				result.add((delta.partial_json as string) ?? "")
			}
		}
	} else if (eventType === StreamEventType.ContentBlockStop) {
		if (!HIDE_TOOLS.has(state.currentTool)) {
			result.add(`${r.styleReset()}\n`)
		}
		state.currentTool = ""
	} else if (eventType === StreamEventType.Error) {
		const error = event.error ?? String(event)
		result.add(`\n${state.sp}${r.red(`[error] ${error}`)}\n`)
	}
}
