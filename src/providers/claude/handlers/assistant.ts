import { appendRenderedMarkdown } from "../../../lib/markdown"
import type { ParseResult } from "../../../lib/result"
import { BlockType } from "../constants"
import type { ParserState } from "../state"
import { dispatchTool } from "./tools/dispatch"

export function handleAssistantMessage(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const message = (data.message as Record<string, unknown>) ?? {}
	const content = message.content as Array<Record<string, unknown>>

	if (!Array.isArray(content)) return

	for (const block of content) {
		if (block.type === BlockType.Text) {
			appendRenderedMarkdown((block.text as string) ?? "", state.renderer, result)
		}
	}

	for (const block of content) {
		if (block.type !== BlockType.ToolUse) continue
		const name = (block.name as string) ?? ""
		const inp = (block.input as Record<string, unknown>) ?? {}
		dispatchTool(name, inp, state, result)
	}
}
