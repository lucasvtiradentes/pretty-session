import type { ParseResult, ParserState } from "./base"
import { dispatchTool } from "./tools/index"

export function handleAssistantMessage(data: Record<string, unknown>, state: ParserState, result: ParseResult) {
	const message = (data.message as Record<string, unknown>) ?? {}
	const content = message.content as Array<Record<string, unknown>>

	if (!Array.isArray(content)) return

	for (const block of content) {
		if (block.type === "text") {
			result.add(state.renderer.renderMarkdown((block.text as string) ?? ""))
		}
	}

	for (const block of content) {
		if (block.type !== "tool_use") continue
		const name = (block.name as string) ?? ""
		const inp = (block.input as Record<string, unknown>) ?? {}
		dispatchTool(name, inp, state, result)
	}
}
